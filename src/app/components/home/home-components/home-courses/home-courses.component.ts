import { NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Featured_Courses } from '../../../../core/service/data/data.service';
import { HomeData } from '../../data';
import { CoursesCardComponent } from '../../../../shared/ui/courses-card/courses-card.component';
import { ICourse } from '../../../../core/interfaces/dynamic-home.interface';
import { Course } from '../../../../core/interfaces/dynamic-home.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-courses',
  standalone: true,
  imports: [CoursesCardComponent, TranslateModule],
  templateUrl: './home-courses.component.html',
  styleUrl: './home-courses.component.scss',
})
export class HomeCoursesComponent {
  public Featured_Courses: Featured_Courses[] = [];
  @Input() coursesData: Course[] = [];
  @Input() courseTitle: string = '';
  @Input() CourseShortTitle: string = '';

  ngOnInit(): void {
    console.log(this.coursesData);
  }
  constructor(public data: HomeData) {
    this.Featured_Courses = this.data.Featured_Courses;
  }
}
