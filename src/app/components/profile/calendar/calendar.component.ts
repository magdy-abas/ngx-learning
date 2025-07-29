import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import arLocale from '@fullcalendar/core/locales/ar';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from './../../../core/service/profile.service';
import { map } from 'rxjs';
import { AuthService } from '../../../core/service/auth.service';
import { CoursesService } from '../../../core/service/courses.service';
import { EncryptionService } from '../../../core/service/encryption.service';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, TranslateModule],

  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  userInfo!: any;
  constructor(
    private globalTranslate: GlobalTranslateService,
    private ProfileService: ProfileService,
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.globalTranslate.language$.subscribe((lang) => {
      this.updateCalendarLanguage(lang);
    });

    this.loadMeetingEvents();

    this.userInfo = this._AuthService.userData;
    console.log(this.userInfo);
  }

  private updateCalendarLanguage(lang: 'ar' | 'en') {
    this.calendarOptions = {
      ...this.calendarOptions,
      locale: lang === 'ar' ? arLocale : enLocale,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    };
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: this.getInitialView(),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    locale: this.globalTranslate.language$.value === 'ar' ? arLocale : enLocale,
    direction: this.globalTranslate.language$.value === 'ar' ? 'rtl' : 'ltr',
    events: [],
    eventClick: (info) => {
      const meetingId = +info.event.id;
      const chapterId = +(info.event.extendedProps['chapterId'] || 0);
      this.joinMeetingFromCalendar(meetingId, chapterId);
    },

    windowResize: (view) => this.updateView(view),
  };

  getInitialView() {
    if (window.innerWidth < 600) {
      return 'dayGridDay';
    } else if (window.innerWidth < 992) {
      return 'dayGridWeek';
    } else {
      return 'dayGridMonth';
    }
  }

  updateView(view: any) {
    const newView = this.getInitialView();
    const calendarApi = view.view.calendar;
    if (calendarApi.view.type !== newView) {
      calendarApi.changeView(newView);
    }
  }

  private loadMeetingEvents(): void {
    this.ProfileService.getMeetingTimes().subscribe({
      next: (res) => {
        const events = res.data.map((meeting) => ({
          id: String(meeting.id),
          chapterId: String(meeting.chapter_id),
          title: meeting.title,
          start: meeting.start,
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events,
        };

        console.log(res.data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private joinMeetingFromCalendar(meetingId: number, chapterId: number): void {
    const leaveUrl = `${window.location.origin}/profile?section=calendar`;

    console.log(leaveUrl);

    this._CoursesService.joinMeeting(meetingId, leaveUrl).subscribe({
      next: (res) => {
        if (res.status === 1 && res.data?.join_url) {
          const decryptedUrl = this.encryptionService.decryptData(
            res.data.join_url,
            this.userInfo?.id,
            chapterId,
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
