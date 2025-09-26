import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, BsDatepickerModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  selectedDate: Date = new Date();
  selectedTime: string | null = null;

  minDate: Date = new Date(2025, 7, 1);
  maxDate: Date = new Date(2025, 7, 31);

  availableDates: Date[] = [new Date(2025, 7, 10), new Date(2025, 7, 21)];

  timeSlots = [
    { label: '08:00AM - 09:00AM', value: '08:00-09:00' },
    { label: '09:30AM - 10:30AM', value: '09:30-10:30' },
    { label: '10:45AM - 11:45AM', value: '10:45-11:45' },
    { label: '10:00PM - 11:00PM', value: '22:00-23:00' },
  ];

  bsConfig: Partial<BsDatepickerConfig>;

  constructor() {
    this.bsConfig = {
      containerClass: 'theme-custom',
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  proceedBooking() {
    if (this.selectedDate && this.selectedTime) {
      alert(`تم الحجز
اليوم: ${this.selectedDate.toDateString()}
الساعة: ${this.selectedTime}`);
    } else {
      alert('اختر يوم وموعد أولاً ');
    }
  }
}
