import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
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

  constructor(public data: HomeData) {
    this.Featured_Courses = this.data.Featured_Courses;
  }
}
