import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CountUpModule } from 'ngx-countup';
import { Router } from '@angular/router';
import AOS from 'aos';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  DataService,
  Featured_Courses,
  blog,
  category,
  feature_instructors,
  real_reviews,
  trending_Courses,
  universitiesCompanies,
} from './../../core/service/data/data.service';
import { routes } from '../../app.routes';
import { HomeData } from './data';
import { EventManager } from '@angular/platform-browser';

import { HomeInstructorsComponent } from './home-components/home-instructors/home-instructors.component';
import { HomeCoursesComponent } from './home-components/home-courses/home-courses.component';
import { HomeCategoriesComponent } from './home-components/home-categories/home-categories.component';
import { HomeSliderComponent } from './home-components/home-slider/home-slider.component';
import { DynamicHomeService } from '../../core/service/dynamic-home.service';
import { IHomeSection } from '../../core/interfaces/Home.interface';
import { SectionDataHelpers } from '../../shared/utils/HomeDataHelpers.utils';

import { HomeBannerComponent } from './home-components/home-banner/home-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    CarouselModule,
    CountUpModule,
    HomeInstructorsComponent,
    HomeCoursesComponent,
    HomeCategoriesComponent,
    HomeSliderComponent,
    HomeBannerComponent,
  ],
  providers: [
    EventManager,
    {
      provide: 'WINDOW',
      useFactory: () => window,
    },
    {
      provide: 'isBrowser',
      useFactory: (platformId: Object) => isPlatformBrowser(platformId),
      deps: [PLATFORM_ID],
    },
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  homeSections: IHomeSection[] = [];

  public routes = routes;
  selected = '1';
  public universitiesCompanies: universitiesCompanies[] = [];
  public Category: category[] = [];
  public Featured_Courses: Featured_Courses[] = [];
  public trending_Courses: trending_Courses[] = [];
  public feature_instructors: feature_instructors[] = [];
  public real_reviews: real_reviews[] = [];
  public blog: blog[] = [];
  constructor(
    private DataService: DataService,
    public router: Router,
    public data: HomeData,
    private _DynamicHomeService: DynamicHomeService
  ) {
    this.universitiesCompanies = this.DataService.universitiesCompanies;
    this.Category = this.data.Category;
    this.Featured_Courses = this.data.Featured_Courses;
    this.trending_Courses = this.data.trending_Courses;
    this.feature_instructors = this.data.feature_instructors;
    this.real_reviews = this.data.real_reviews;
    this.blog = this.data.blog;
  }

  // Type guard functions
  protected readonly getSliderData = SectionDataHelpers.getSliderData;
  protected readonly getCourseData = SectionDataHelpers.getCourseData;
  protected readonly getDoctorData = SectionDataHelpers.getDoctorData;
  protected readonly getCategoryData = SectionDataHelpers.getCategoryData;
  protected readonly getBannerData = SectionDataHelpers.getBannerData;

  ngOnInit(): void {
    AOS.init({
      duration: 1200,
      once: true,
    });

    this.getHomeData();
  }
  customReview: OwlOptions = {
    loop: true,
    margin: 15,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    navSpeed: 700,
    dots: false,
    nav: true,
    navText: [
      '<i class="fa-solid fa-arrow-left-long"></i>',
      '<i class="fa-solid fa-arrow-right-long"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
  };
  public universitiesCompaniesOwlOptions: OwlOptions = {
    margin: 24,
    nav: true,
    loop: true,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 6,
      },
      1170: {
        items: 6,
      },
    },
  };

  getHomeData = () => {
    this._DynamicHomeService.getHomeData().subscribe({
      next: (res) => {
        this.homeSections = res.data;
        console.log(this.homeSections);
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  directPath() {
    this.router.navigate(['/courses']);
  }
}
