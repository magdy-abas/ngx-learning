import { Component, inject, Input } from '@angular/core';
import { HomeData } from '../../data';

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
  @Input() instructorsData: Doctor[] = [];
  @Input() instructorsTitle: string = '';
  @Input() instructorsShortTitle: string = '';
  @Input() showViewAllButton: boolean = true;
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(public data: HomeData) {}

  viewAllDoctors() {
    this.router.navigate(['/instructors']);
  }

  goToDoctorProfile(doctor: Doctor) {
    const route = `/instructor-profile/${doctor.id}`;

    this.router.navigate([route], {
      state: { doctor },
    });
  }
}
