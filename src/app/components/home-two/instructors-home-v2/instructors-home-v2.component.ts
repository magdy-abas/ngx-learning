import { Component, inject, Input } from '@angular/core';
import {
  Doctor,
  DoctorsSection,
} from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-instructors-home-v2',
  standalone: true,
  imports: [NgIf, CarouselModule, NgFor, TranslateModule],
  templateUrl: './instructors-home-v2.component.html',
  styleUrl: './instructors-home-v2.component.scss',
})
export class InstructorsHomeV2Component {
  @Input() doctorsSection: DoctorsSection | null = null;
  private router = inject(Router);

  goToDoctorProfile(doctor: Doctor) {
    const route = `/instructor-profile/${doctor.id}`;

    this.router.navigate([route], {
      state: { doctor },
    });
  }
  customOptionsCrSlider = {
    loop: true,
    margin: 20,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 800,
    dots: false,
    nav: false,
    responsive: {
      0: { items: 1 },
      768: { items: 3 },
    },
  };
}
