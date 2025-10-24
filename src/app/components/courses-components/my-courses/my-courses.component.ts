import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { CoursesService } from '../../../core/service/courses.service';
import { MyCourse } from '../../../core/interfaces/my-courses.interface';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    FeatherIconModule,
    TranslateModule,
    NgFor,
    MatSelectModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss',
})
export class MyCoursesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  private _CoursesService = inject(CoursesService);
  private _Router = inject(Router);
  private globalTranslate = inject(GlobalTranslateService);

  myCourses: MyCourse[] = [];

  searchDataValue: string = '';
  selectedValue: string = 'all courses';
  searchDataValue1: string = '';

  ngOnInit(): void {
    this.getMyCourses();
    let firstLangChange = true;

    const langSub = this.globalTranslate.language$.subscribe((lang) => {
      if (firstLangChange) {
        firstLangChange = false;
        return;
      }

      this.getMyCourses(this.selectedValue);
    });

    this.subscriptions.push(langSub);
  }

  getMyCourses(selectedValue: string = 'all courses') {
    const status = selectedValue === 'completed' ? 'all' : selectedValue;
    const complete_status =
      selectedValue === 'completed' ? 'completed' : undefined;

    const courseSub = this._CoursesService
      .getMyCourses(this.searchDataValue, status, 10, complete_status)
      .subscribe((res) => {
        this.myCourses = res.data.map((course) => {
          if (
            course.client_status === 'accepted' &&
            course.complete_status !== 'completed'
          ) {
            course.client_status = 'ongoing';
          }
          return course;
        });
      });

    this.subscriptions.push(courseSub);
  }

  navigateToCourseDetails(courseId: number): void {
    this._Router.navigate([`/course-details/${courseId}`]);
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
