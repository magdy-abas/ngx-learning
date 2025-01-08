import { NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Featured_Courses } from '../../../../core/service/data/data.service';
import { HomeData } from '../../data';
import { CoursesCardComponent } from '../../../../shared/ui/courses-card/courses-card.component';
import { ICourse } from '../../../../core/interfaces/Home.interface';

@Component({
  selector: 'app-home-courses',
  standalone: true,
  imports: [CoursesCardComponent],
  templateUrl: './home-courses.component.html',
  styleUrl: './home-courses.component.scss',
})
export class HomeCoursesComponent {
  public Featured_Courses: Featured_Courses[] = [];
  @Input() coursesData: ICourse[] = [];
  @Input() courseTitle: string = '';
  @Input() CourseShortTitle: string = '';

  constructor(public data: HomeData) {
    this.Featured_Courses = this.data.Featured_Courses;
  }

  // ngOnInit(): void {
  //   console.log(this.coursesData);
  // }
}
