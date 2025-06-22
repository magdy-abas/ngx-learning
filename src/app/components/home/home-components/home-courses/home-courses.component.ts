import { NgClass, NgFor } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { HomeData } from '../../data';
import { CoursesCardComponent } from '../../../../shared/ui/courses-card/courses-card.component';
import { ICourse } from '../../../../core/interfaces/dynamic-home.interface';
import { Course } from '../../../../core/interfaces/dynamic-home.interface';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-home-courses',
  standalone: true,
  imports: [CoursesCardComponent, TranslateModule],
  templateUrl: './home-courses.component.html',
  styleUrl: './home-courses.component.scss',
})
export class HomeCoursesComponent {
  @Input() coursesData: Course[] = [];
  @Input() courseTitle: string = '';
  @Input() CourseShortTitle: string = '';
  private router = inject(Router);
  private authService = inject(AuthService);
  ngOnInit(): void {
    console.log(this.coursesData);
  }
  constructor(public data: HomeData) {}

  viewAllCourses() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/courses']);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
