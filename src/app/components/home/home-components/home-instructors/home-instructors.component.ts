import { Component, inject, Input } from '@angular/core';
import { HomeData } from '../../data';
import { feature_instructors } from '../../../../core/service/data/data.service';
import { NgFor, NgIf } from '@angular/common';
import { IDoctor } from '../../../../core/interfaces/dynamic-home.interface';
import { Doctor } from '../../../../core/interfaces/dynamic-home.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';

@Component({
  selector: 'app-home-instructors',
  standalone: true,
  imports: [NgFor, TranslateModule, NgIf],
  templateUrl: './home-instructors.component.html',
  styleUrl: './home-instructors.component.scss',
})
export class HomeInstructorsComponent {
  public feature_instructors: feature_instructors[] = [];
  @Input() instructorsData: Doctor[] = [];
  @Input() instructorsTitle: string = '';
  @Input() instructorsShortTitle: string = '';
  @Input() showViewAllButton: boolean = true;
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(public data: HomeData) {
    this.feature_instructors = this.data.feature_instructors;
  }

  goToDoctorCourses(doctorId: number) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([`/auth/courses/doctor/${doctorId}`]);
    } else {
      this.router.navigate([`/courses/doctor/${doctorId}`]);
    }
  }
}
