import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Featured_Courses } from '../../../../core/service/data/data.service';
import { HomeData } from '../../data';

@Component({
  selector: 'app-home-courses',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home-courses.component.html',
  styleUrl: './home-courses.component.scss',
})
export class HomeCoursesComponent {
  public Featured_Courses: Featured_Courses[] = [];
  @Input() coursesData: any[] = [];
  constructor(public data: HomeData) {
    this.Featured_Courses = this.data.Featured_Courses;
  }

  // ngOnInit(): void {
  //   console.log(this.coursesData);
  // }
}
