import { Component, Input, AfterViewInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {
  CoursesSection,
  ICourse,
} from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';
import { CoursesCardComponent } from '../../../shared/ui/courses-card/courses-card.component';

@Component({
  selector: 'app-best-selling-home-v2',
  standalone: true,
  imports: [TranslateModule, CarouselModule, NgFor, CoursesCardComponent],
  templateUrl: './best-selling-home-v2.component.html',
  styleUrl: './best-selling-home-v2.component.scss',
})
export class BestSellingHomeV2Component {
  @Input() bestSellingCourses: CoursesSection | null = null;

  ngAfterViewInit(): void {
    console.log('featuredCourses', this.bestSellingCourses);
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
