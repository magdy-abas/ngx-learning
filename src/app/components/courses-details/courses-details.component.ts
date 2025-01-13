import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeatherIconModule } from './../../shared/utils/feather-icons.utils';
import { RouterLink } from '@angular/router';
import { routes } from '../../core/service/routes/routes';
import { AuthService } from '../../core/service/auth.service';
import { CoursesService } from '../../core/service/courses.service';
import { CourseContent } from '../../core/interfaces/courses.interface';
import { unsubscribeAll } from '../../shared/utils/unSubscribeObservable.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [FeatherIconModule, RouterLink],
  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss'],
})
export class CoursesDetailsComponent implements OnInit, OnDestroy {
  public routes = routes; // Preserve the existing routes property
  courseDetails?: CourseContent;
  public isLoading = true;
  public errorMessage = '';
  subscriptions: Subscription[] = [];

  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get course ID from route parameters
    const courseId = this._route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(+courseId);
    } else {
      this.errorMessage = 'Invalid course ID';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'video':
        return 'assets/img/icon/play.svg';
      case 'quiz':
        return 'assets/img/icon/quiz.svg';
      default:
        return 'assets/img/icon/google-meet.svg';
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
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch course details.';
          console.error(err);
          this.isLoading = false;
        },
      });

    this.subscriptions.push(courseDetailsSub);
  }
}
