import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatherIconModule } from './../../../shared/utils/feather-icons.utils';
import { RouterLink } from '@angular/router';
import { routes } from './../../../core/service/routes/routes';
import { AuthService } from './../../../core/service/auth.service';
import { CoursesService } from './../../../core/service/courses.service';
import * as CryptoJS from 'crypto-js';
import { CourseContent } from './../../../core/interfaces/courses.interface';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from './../../../shared/utils/unSubscribeObservable.utils';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [FeatherIconModule, NgIf, NgFor],

  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss'],
})
export class CoursesDetailsComponent implements OnInit, OnDestroy {
  public routes = routes;
  courseDetails?: CourseContent;
  public isLoading = true;
  public errorMessage = '';
  courseId!: number;
  subscriptions: Subscription[] = [];
  shapterId!: number;
  CourseSubscribe: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    // Get course ID from route parameters
    const courseId = this._route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(+courseId);
      this.getResources(+courseId);
      this.courseId = +courseId;
    } else {
      this.errorMessage = 'Invalid course ID';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }

  isClientSubscribe() {
    if (this.courseDetails?.course.client_status === 'accepted') {
      this.CourseSubscribe = true;
    }
  }
  redirectToLesson(id: number, type: string, shapterId: number): void {
    console.log('clicked');

    if (type === 'quiz') {
      if (this._AuthService.isAuthenticated() && this.CourseSubscribe) {
        this._Router.navigate([`/auth/course-quiz/${this.courseId}/${id}`]);
      }
    }
    if (type === 'meeting') {
      if (this._AuthService.isAuthenticated() && this.CourseSubscribe) {
        this._Router.navigate([
          `/auth/course-metting/${this.courseId}/${id}/${shapterId}`,
        ]);
      }
    }
    if (type === 'video') {
    }
  }
  getDisplayIcon(lesson: any): string {
    // For free lessons,
    if (lesson.is_free) {
      return this.getLessonTypeIcon(lesson.type);
    }

    // For non-free lessons
    if (this.CourseSubscribe) {
      // If user bought the course
      return this.getLessonTypeIcon(lesson.type);
    } else {
      // If user hasn't bought the course, show lock icon
      return 'assets/img/icon/lock.svg';
    }
  }

  getLessonTypeIcon(type: string): string {
    switch (type) {
      case 'video':
        return 'assets/img/icon/play-icon.svg';
      case 'quiz':
        return 'assets/img/icon/quiz.svg';
      case 'meeting':
        return 'assets/img/icon/google-meet.svg';
      default:
        return 'assets/img/icon/lock.svg';
    }
  }
  getTotalLessons(): number {
    if (!this.courseDetails?.data) {
      return 0;
    }
    return this.courseDetails.data.reduce(
      (total, chapter) => total + (chapter.lessons?.length || 0),
      0
    );
  }

  fetchCourseDetails(courseId: number): void {
    const courseDetailsSub = this._CoursesService
      .getCoursesDetails(courseId)
      .subscribe({
        next: (data) => {
          this.courseDetails = data;
          console.log(data);

          this.isLoading = false;
          this.isClientSubscribe();
          console.log(this.CourseSubscribe);
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch course details.';
          console.error(err);
          this.isLoading = false;
        },
      });

    this.subscriptions.push(courseDetailsSub);
  }

  getResources(courseId: any) {
    this._CoursesService.getResources(courseId).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
