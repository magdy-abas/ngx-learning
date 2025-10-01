import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale, enGbLocale } from 'ngx-bootstrap/locale';

import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { ProfileService } from '../../../core/service/profile.service';
import { AuthService } from '../../../core/service/auth.service';

import { Subject, takeUntil } from 'rxjs';
import { Session } from '../../../core/interfaces/profile.interface';

// Register locales (only once)
defineLocale('ar', arLocale);
defineLocale('en', enGbLocale);

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TranslateModule, BsDatepickerModule, NgClass],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private locale = inject(BsLocaleService);
  status = '';
  lang = signal<'ar' | 'en'>('en');
  isRTL = computed(() => this.lang() === 'ar');
  bsValue = signal<Date>(new Date());
  Sessions: Session[] = [];

  constructor(
    private globalTranslate: GlobalTranslateService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}
  getStatusClass(status: string) {
    return {
      'bg-warning': status === 'pending',
      'bg-success': status === 'accepted',
      'bg-danger': status === 'finished',
    };
  }
  ngOnInit(): void {
    const initLang =
      (this.globalTranslate.language$.value as 'ar' | 'en') ?? 'en';
    this.applyLocale(initLang);

    this.globalTranslate.language$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((l) => this.applyLocale((l as 'ar' | 'en') ?? 'en'));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private applyLocale(lang: 'ar' | 'en') {
    this.lang.set(lang);
    this.locale.use(lang === 'ar' ? 'ar' : 'en');
  }

  private formatForApi(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  loadSessions(date: Date): void {
    const formatted = this.formatForApi(date);
    this.profileService
      .getPrivateSessions(formatted)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.Sessions = res.data.sessions ?? [];
        this.bsValue.set(date);
      });
  }

  onDateChange(date: Date): void {
    this.loadSessions(date);
  }
}
