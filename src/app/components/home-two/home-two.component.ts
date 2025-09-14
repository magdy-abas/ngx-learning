import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import Aos from 'aos';
import { CountUp } from 'countup.js';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DynamicHomeService } from '../../core/service/dynamic-home.service';
import {
  ContactUs,
  HomeSection,
  ICategory,
  ICourse,
  IDoctor,
} from '../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroHomeV2Component } from './hero-home-v2/hero-home-v2.component';
import { CounterHomeV2Component } from './counter-home-v2/counter-home-v2.component';
import { WhyUsHomeV2Component } from './why-us-home-v2/why-us-home-v2.component';
import { LessonsHomeV2Component } from './lessons-home-v2/lessons-home-v2.component';
import { FeaturedCoursesHomeV2Component } from './featured-courses-home-v2/featured-courses-home-v2.component';
import { SmartCoursesHomeV2Component } from './smart-courses-home-v2/smart-courses-home-v2.component';
import { BestSellingHomeV2Component } from './best-selling-home-v2/best-selling-home-v2.component';
import { TestimonialHomeV2Component } from './testimonial-home-v2/testimonial-home-v2.component';

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [
    CarouselModule,
    TranslateModule,
    NgIf,
    RouterLink,
    NgFor,
    HeroHomeV2Component,
    CounterHomeV2Component,
    WhyUsHomeV2Component,
    LessonsHomeV2Component,
    FeaturedCoursesHomeV2Component,
    SmartCoursesHomeV2Component,
    BestSellingHomeV2Component,
    TestimonialHomeV2Component,
  ],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss',
})
export class HomeTwoComponent implements AfterViewInit, OnInit {
  homeSections: HomeSection[] = [];
  featuredCourses: ICourse[] = [];
  universities: ICategory[] = [];
  doctors: IDoctor[] = [];

  contactUs: ContactUs | null = null;

  private _DynamicHomeService = inject(DynamicHomeService);

  ngOnInit(): void {
    this.getHomeData();
    Aos.init({
      offset: 20,
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    });
  }

  ngAfterViewInit(): void {
    const counters = [
      { id: 'stat-courses', endVal: 50 },
      { id: 'stat-students', endVal: 2000 },
      { id: 'stat-teachers', endVal: 150 },
      { id: 'stat-fields', endVal: 10 },
    ];

    const options = { duration: 2 };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.id;
            const counter = counters.find((c) => c.id === targetId);
            if (counter) {
              new CountUp(counter.id, counter.endVal, options).start();
              obs.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) {
        observer.observe(el);
      }
    });
  }

  getHomeData(): void {
    this._DynamicHomeService.getHomeData().subscribe({
      next: (res) => {
        this.homeSections = res.data;

        this.featuredCourses = this.homeSections.find(
          (section) => section.type === 'courses'
        )?.data as ICourse[];
        console.log(this.featuredCourses);

        this.universities = this.homeSections.find(
          (section) => section.type === 'categories'
        )?.data as ICategory[];
        console.log(this.universities);

        this.doctors = this.homeSections.find(
          (section) => section.type === 'doctors'
        )?.data as IDoctor[];
        console.log(this.doctors);
        this.contactUs = res.contact_us;

        console.log('contact_us:', this.universities);
      },
      error: (err) => console.error(err),
    });
  }
}
