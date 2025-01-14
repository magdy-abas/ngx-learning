import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FeatherIconModule } from '../../shared/utils/feather-icons.utils';
import { AuthService } from '../../core/service/auth.service';

import {
  MainMenuItem,
  navbarMenu,
} from './../../core/service/data/navbar.data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    FeatherIconModule,
    CommonModule,
    TranslateModule,
  ],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  _AuthService = inject(AuthService);
  _Router = inject(Router);

  base = '';
  page = '';
  last = '';
  public isMenuOpened = false;
  public sidebar: MainMenuItem[] = navbarMenu;

  // Static Routes
  public routes = {
    home: '/home',
    login: '/login',
    page_course_message: '/course/message',
    page_course_details: '/course/details',
    page_notifications: '/notifications',
    instructor_edit_profile: '/instructor/profile',
    students_subscription: '/student/subscription',
  };

  public toggleSidebar(): void {
    this.isMenuOpened = !this.isMenuOpened;
    if (this.isMenuOpened) {
      document.body.classList.add('menu-opened');
    } else {
      document.body.classList.remove('menu-opened');
    }

    const sidebarPosition = localStorage.getItem('sidebarPosition');
    if (sidebarPosition) {
      localStorage.removeItem('sidebarPosition');
    } else {
      localStorage.setItem('sidebarPosition', 'true');
    }
  }

  public hideSidebar(): void {
    this.isMenuOpened = false;
    document.body.classList.remove('menu-opened');
    localStorage.removeItem('sidebarPosition');
  }

  // Theme Toggle
  toggleDarkMode(): void {
    const nightMode = document.getElementById('night-mode') as HTMLInputElement;
    if (nightMode) {
      nightMode.checked = !nightMode.checked;
      document.body.classList.toggle('dark-mode');
    }
  }

  logout(): void {
    this._AuthService.clearUserData();
    this._Router.navigate(['/login']);
  }
}
