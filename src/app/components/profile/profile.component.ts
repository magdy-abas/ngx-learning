import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MyCoursesComponent } from '../courses-components/my-courses/my-courses.component';
import AOS from 'aos';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../core/service/profile.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { SsrService } from '../../core/service/ssr.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MyCoursesComponent,
    NgIf,
    NgClass,
    TranslateModule,
    ReactiveFormsModule,
    TooltipModule,
    CalendarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  activeSection: 'profile' | 'courses' | 'calendar' = 'profile';
  isEditingName = false;
  userData: any = { name: '' };
  errorMessage: string = '';
  private ssr = inject(SsrService);
  private _AuthService = inject(AuthService);
  private _ProfileService = inject(ProfileService);
  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);

  ngOnInit(): void {
    AOS.init({ duration: 1000, once: true });

    this._route.queryParams.subscribe((params) => {
      const section = params['section'];
      if (section === 'courses' || section === 'calendar') {
        this.activeSection = section;
      }
    });

    this.profileForm = this._fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
    });

    this.loadUserData();
  }

  loadUserData() {
    const userDataString = this.ssr.getLocal('userData');
    if (userDataString) {
      const user = JSON.parse(userDataString);

      this.profileForm.patchValue({
        name: user.name || '',
      });

      this.userData = { name: user.name || '' };
    } else {
      this.profileForm.patchValue({
        name: '',
      });
      this.userData = { name: '' };
    }
  }

  switchSection(section: 'profile' | 'courses' | 'calendar') {
    this.activeSection = section;
    setTimeout(() => AOS.refresh(), 50);
  }

  toggleEdit() {
    this.isEditingName = !this.isEditingName;
    const nameControl = this.profileForm.get('name');
    if (this.isEditingName) {
      this.errorMessage = '';
      nameControl?.enable();
    } else {
      nameControl?.disable();
    }
  }

  logout() {
    this._AuthService.logout();
  }

  updateUserInfor() {
    const nameValue = this.profileForm.get('name')?.value;

    if (nameValue === this.userData.name) {
      return;
    }

    const updateBody = { name: nameValue };

    this._ProfileService.updateInfo(updateBody).subscribe({
      next: (res) => {
        if (res.status === 1) {
          this.ssr.setLocal('userData', JSON.stringify(res.data));
          this.loadUserData();
          this.isEditingName = false;
          this.profileForm.get('name')?.disable();
          this.errorMessage = '';
          console.log(res);
        } else if (res.status === 0) {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Something went wrong, please try again.';
      },
    });
  }
}
