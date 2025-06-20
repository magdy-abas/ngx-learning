import { Component, inject, OnInit } from '@angular/core';
import { MyCoursesComponent } from '../courses-components/my-courses/my-courses.component';
import AOS from 'aos';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MyCoursesComponent, NgIf, NgClass, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  activeSection: 'profile' | 'courses' = 'profile';
  private _AuthService = inject(AuthService);
  ngOnInit(): void {
    AOS.init({ duration: 1000, once: true });
  }

  switchSection(section: 'profile' | 'courses') {
    this.activeSection = section;

    // delay بسيط لتضمن AOS يشتغل بعد DOM update
    setTimeout(() => AOS.refresh(), 50);
  }

  logout() {
    this._AuthService.logout();
  }
}
