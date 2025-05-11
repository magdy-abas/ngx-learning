import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { routes } from './../../../core/service/routes/routes';
import { MatSelectModule } from '@angular/material/select';
import { CoursesService } from '../../../core/service/courses.service';
import { MyCourse } from '../../../core/interfaces/my-courses.interface';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgClass,
    FeatherIconModule,

    NgFor,
    MatSelectModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.scss',
})
export class MyCoursesComponent implements OnInit {
  private _CoursesService = inject(CoursesService);
  private _Router = inject(Router);
  myCourses: MyCourse[] = [];
  routes = routes;
  searchDataValue: string = '';
  selectedValue: string = 'all courses';
  searchDataValue1: string = '';

  ngOnInit(): void {
    this.getMyCourses();
  }

  getMyCourses(selectedValue: string = 'all courses') {
    const status = selectedValue === 'completed' ? 'all' : selectedValue;
    const complete_status =
      selectedValue === 'completed' ? 'completed' : undefined;

    this._CoursesService
      .getMyCourses(this.searchDataValue, status, 10, complete_status)
      .subscribe((res) => {
        console.log(res);
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
  }

  navigateToCourseDetails(courseId: number): void {
    console.log(courseId);

    this._Router.navigate([`auth/course-details/${courseId}`]);
  }
}
