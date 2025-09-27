import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import Aos from 'aos';
import { CountUp } from 'countup.js';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DynamicHomeService } from '../../core/service/dynamic-home.service';
import {
  ContactUs,
  ICategory,
  IDoctor,
  DynamicHomeResponseV2,
  CourseSection,
  ICourse,
  HomeSection,
  CoursesSection,
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
import { FooterHomeV2Component } from './footer-home-v2/footer-home-v2.component';
import { SsrService } from '../../core/service/ssr.service';

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [
    CarouselModule,
    TranslateModule,

    HeroHomeV2Component,
    CounterHomeV2Component,
    WhyUsHomeV2Component,
    LessonsHomeV2Component,
    FeaturedCoursesHomeV2Component,
    SmartCoursesHomeV2Component,
    BestSellingHomeV2Component,
    TestimonialHomeV2Component,
    FooterHomeV2Component,
  ],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss',
})
export class HomeTwoComponent implements AfterViewInit, OnInit {
  homeSections: HomeSection[] = [];
  featuredCourses: CoursesSection | null = null;
  bestSellingCourses: CoursesSection | null = null;
  universities: ICategory[] = [];
  doctors: IDoctor[] = [];

  contactUs: ContactUs | null = null;
  private ssr = inject(SsrService);

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
    if (!this.ssr.isBrowser()) return;

    const counters = [
      { id: 'stat-courses', endVal: 50 },
      { id: 'stat-students', endVal: 2000 },
      { id: 'stat-teachers', endVal: 150 },
      { id: 'stat-fields', endVal: 10 },
    ];

    const options = { duration: 2 };
    const win = this.ssr.getWindow();
    if (!win) return;
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
      const el = this.ssr.getDocument()?.getElementById(c.id);
      if (el) {
        observer.observe(el);
      }
    });
  }

  getHomeData(): void {
    this._DynamicHomeService.getHomeData().subscribe({
      next: (res) => {
        this.homeSections = res.data;

        const coursesSections = this.homeSections.filter(
          (section): section is HomeSection & { data: ICourse[] } =>
            section.type === 'courses'
        );

        coursesSections.forEach((section) => {
          const mappedSection: CoursesSection = {
            title: section.title,
            short_title: section.short_title,
            description: section.description,
            data: section.data,
          };

          if (section.data.length > 3) {
            this.bestSellingCourses = mappedSection;
          } else {
            this.featuredCourses = mappedSection;
          }
        });

        console.log(this.featuredCourses);

        // categories
        const categoriesSection = this.homeSections.find(
          (section): section is HomeSection & { data: ICategory[] } =>
            section.type === 'categories'
        );
        this.universities = categoriesSection?.data ?? [];

        //  doctors
        const doctorsSection = this.homeSections.find(
          (section): section is HomeSection & { data: IDoctor[] } =>
            section.type === 'doctors'
        );
        this.doctors = doctorsSection?.data ?? [];
      },
      error: (err) => console.error(err),
    });
  }
}
