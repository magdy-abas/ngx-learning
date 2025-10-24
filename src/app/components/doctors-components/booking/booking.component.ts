import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale, enGbLocale } from 'ngx-bootstrap/locale';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';

import { DoctorsService } from '../../../core/service/doctors.service';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import {
  AvailableDatesResponse,
  AvailableTimesResponse,
  BookSessionResponse,
} from '../../../core/interfaces/private-sessions.interface';
import { SweetAlertUtils } from '../../../shared/utils/SweetAlert.utils';
import { Subject, takeUntil } from 'rxjs';

// ✅ Register locales once
defineLocale('ar', arLocale);
defineLocale('en', enGbLocale);
registerLocaleData(localeAr);
registerLocaleData(localeEn);

export interface TimeSlot {
  id: number;
  time_from: string;
  time_to: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule, TranslateModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private localeService = inject(BsLocaleService);
  private platformId = inject(PLATFORM_ID);
  refreshKey = signal(1);

  doctor: any = null;
  bookingSuccess: any = null;
  private lastLoadedDate: string | null = null;
  private skipNextDateChange = false;

  selectedDate = new Date();
  availableDates: Date[] = [];

  timeSlots: TimeSlot[] = [];
  selectedTime: TimeSlot | null = null;

  currentLang: 'ar' | 'en' = 'ar';

  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-custom',
    showWeekNumbers: false,
    dateInputFormat: 'DD/MM/YYYY',
  };

  constructor(
    private router: Router,
    private doctorsService: DoctorsService,
    private globalTranslate: GlobalTranslateService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.doctor = history.state['doctor'] ?? null;
    }

    if (!this.doctor) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    const initLang =
      (this.globalTranslate.language$.value as 'ar' | 'en') ?? 'ar';
    this.applyLocale(initLang);

    this.globalTranslate.language$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((lang) => this.applyLocale(lang as 'ar' | 'en'));

    if (this.doctor?.id) {
      this.loadAvailableDates(this.doctor.id);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private applyLocale(lang: 'ar' | 'en') {
    this.currentLang = lang;
    this.localeService.use(lang === 'ar' ? 'ar' : 'en');

    this.skipNextDateChange = true;

    this.refreshKey.set(0);
    setTimeout(() => this.refreshKey.set(1), 0);
  }

  private loadAvailableDates(doctorId: number) {
    this.doctorsService.getAvailableDates(doctorId).subscribe({
      next: (res: AvailableDatesResponse) => {
        this.availableDates = res.data.map((d: string) => new Date(d));

        if (this.availableDates.length > 0) {
          this.selectedDate = this.availableDates[0];
          this.onDateChange(this.selectedDate, true);
        }
      },
      error: (err) => console.error('Failed to load available dates', err),
    });
  }

  onDateChange(date: Date, initial = false) {
    const formatted = this.formatDate(date);

    if (this.skipNextDateChange) {
      this.skipNextDateChange = false;
      return;
    }

    if (this.lastLoadedDate === formatted) return;

    this.lastLoadedDate = formatted;
    this.selectedDate = date;

    this.doctorsService.getAvailableTimes(this.doctor.id, formatted).subscribe({
      next: (res: AvailableTimesResponse) => {
        this.timeSlots = res.data.map((t) => ({
          id: t.id,
          time_from: t.time_from,
          time_to: t.time_to,
        }));
        this.selectedTime = this.timeSlots[0] ?? null;
      },
      error: (err) => console.error('Failed to load available times', err),
    });
  }

  proceedBooking() {
    if (!this.selectedDate || !this.selectedTime) return;

    this.doctorsService
      .bookSession(
        this.doctor.id,
        this.formatDate(this.selectedDate),
        this.selectedTime.id.toString()
      )
      .subscribe({
        next: (res: BookSessionResponse) => {
          if (res.status === 1) {
            this.bookingSuccess = res.data.request;
          } else {
            SweetAlertUtils.showAlert({ message: res.message });
          }
        },
        error: (err) => console.error('Booking failed', err),
      });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
