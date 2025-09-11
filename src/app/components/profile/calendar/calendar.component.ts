import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {
  BsDatepickerModule,
  BsLocaleService,
  DatepickerDateCustomClasses,
  BsDatepickerDirective,
} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale, enGbLocale } from 'ngx-bootstrap/locale';

import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { ProfileService } from '../../../core/service/profile.service';
import { AuthService } from '../../../core/service/auth.service';
import { CoursesService } from '../../../core/service/courses.service';
import { EncryptionService } from '../../../core/service/encryption.service';

import { Subject, takeUntil } from 'rxjs';

// Register locales (only once)
defineLocale('ar', arLocale);
defineLocale('en', enGbLocale);

type UiEvent = {
  meetingId: number;
  chapterId?: number;
  title: string;
  subtitle?: string;
  icon?: string; // e.g. 'bi-people'
  startISO: string;
};

type EventsMap = Record<string, UiEvent[]>; // key: 'YYYY-MM-DD'

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TranslateModule, BsDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private locale = inject(BsLocaleService);

  @ViewChild('dp', { static: false }) datepicker?: BsDatepickerDirective;

  // Demo event markers
  eventDates: DatepickerDateCustomClasses[] = [
    { date: new Date(2026, 0, 1), classes: ['has-event'] },
    { date: new Date(2026, 0, 8), classes: ['has-event'] },
    { date: new Date(2026, 0, 17), classes: ['has-event'] },
  ];

  // Language & Direction
  lang = signal<'ar' | 'en'>('en');
  isRTL = computed(() => this.lang() === 'ar');

  // User info
  userInfo!: any;

  // Current selected date
  bsValue = signal<Date>(new Date('2026-01-02T12:00:00'));

  // Events map (by date key)
  EVENTS: EventsMap = {};

  // Optional: upcoming events list
  UPCOMING: Array<{ date: string; title: string; subtitle?: string }> = [];

  constructor(
    private globalTranslate: GlobalTranslateService,
    private profileService: ProfileService,
    private authService: AuthService,
    private coursesService: CoursesService,
    private encryptionService: EncryptionService
  ) {}

  // ======== Lifecycle ========
  ngOnInit(): void {
    // 1) Load user info
    this.userInfo = this.authService.userData;

    // 2) Init locale + listen to language changes
    const initLang =
      (this.globalTranslate.language$.value as 'ar' | 'en') ?? 'en';
    this.applyLocale(initLang);
    this.globalTranslate.language$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((l) => this.applyLocale((l as 'ar' | 'en') ?? 'en'));

    // 3) Load meeting events
    this.loadMeetingEvents();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // ======== Locale / Language ========
  private applyLocale(lang: 'ar' | 'en') {
    this.lang.set(lang);
    this.locale.use(lang === 'ar' ? 'ar' : 'en');
  }

  // ======== Helpers ========
  // Generate date key (YYYY-MM-DD in UTC)
  private keyOf(d: Date) {
    const iso = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    ).toISOString();
    return iso.slice(0, 10);
  }

  private keyOfISO(iso: string) {
    const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
    return this.keyOf(d);
  }

  fmtLong(d: Date) {
    return d.toLocaleDateString(this.lang() === 'ar' ? 'ar' : undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  fmtMonth(d: Date) {
    return d.toLocaleDateString(this.lang() === 'ar' ? 'ar' : undefined, {
      month: 'short',
    });
  }

  // Show dot under days with events
  hasEvents(d: Date) {
    return !!this.EVENTS[this.keyOf(d)];
  }

  // ======== Data Loading ========
  private loadMeetingEvents(): void {
    this.profileService
      .getMeetingTimes()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => {
          const data = Array.isArray(res?.data) ? res.data : [];

          // Normalize API data to UiEvent
          const uiEvents: UiEvent[] = data.map((m: any) => ({
            meetingId: Number(m.id),
            chapterId: m.chapter_id ? Number(m.chapter_id) : undefined,
            title: String(m.title ?? 'Meeting'),
            subtitle: m.instructor ?? m.owner ?? '',
            icon: 'bi-people',
            startISO: String(m.start),
          }));

          // Build map by day
          const map: EventsMap = {};
          uiEvents.forEach((e) => {
            const k = this.keyOfISO(e.startISO);
            (map[k] ||= []).push(e);
          });

          this.EVENTS = map;

          // Build upcoming list (optional)
          this.UPCOMING = uiEvents
            .slice()
            .sort(
              (a, b) =>
                new Date(a.startISO).getTime() - new Date(b.startISO).getTime()
            )
            .map((e) => ({
              date: this.keyOfISO(e.startISO),
              title: e.title,
              subtitle: e.subtitle,
            }))
            .slice(0, 10);
        },
        error: (err) => {
          console.error('loadMeetingEvents error:', err);
        },
      });
  }

  // ======== Join Meeting ========
  joinMeetingFromCalendar(meetingId: number, chapterId?: number): void {
    const leaveUrl = `${window.location.origin}/profile?section=calendar`;

    this.coursesService
      .joinMeeting(meetingId, leaveUrl)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => {
          if (res?.status === 1 && res.data?.join_url) {
            const decryptedUrl = this.encryptionService.decryptData(
              res.data.join_url,
              this.userInfo?.id,
              chapterId ?? 0,
              meetingId,
              this.userInfo?.name
            );

            if (decryptedUrl) {
              window.open(decryptedUrl, '_blank');
            } else {
              console.error('Decryption failed or empty URL');
            }
          } else {
            console.error('No join URL returned from API');
          }
        },
        error: (err) => {
          console.error('Error joining meeting:', err);
        },
      });
  }
}
