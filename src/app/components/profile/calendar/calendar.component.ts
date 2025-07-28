import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import arLocale from '@fullcalendar/core/locales/ar';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, TranslateModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  constructor(private globalTranslate: GlobalTranslateService) {}

  ngOnInit(): void {
    this.globalTranslate.language$.subscribe((lang) => {
      this.updateCalendarLanguage(lang);
    });
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
    events: [
      { title: 'ورشة مساحة', start: '2025-07-29T17:00:00' },
      { title: 'تحليل الإنشاءات', start: '2025-07-30T09:30:00' },
      { title: 'خرسانة مسلحة', start: '2025-07-31T14:00:00' },
      { title: 'تصميم الأساسات', start: '2025-08-01T10:00:00' },
      { title: 'كورس رسم معماري', start: '2025-08-02T16:00:00' },
      { title: 'التصميم الهندسي (SAP)', start: '2025-08-03T15:00:00' },
      { title: 'هندسة التربة', start: '2025-08-03T19:00:00' },
    ],

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
}
