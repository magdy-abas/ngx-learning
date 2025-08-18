import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgIf } from '@angular/common';
import { AuthNavbarComponent } from '../../components/auth-navbar/auth-navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, NgIf],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateNavbarVisibility(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = (event as NavigationEnd).urlAfterRedirects;
        this.updateNavbarVisibility(currentUrl);
      });
  }

  private updateNavbarVisibility(url: string): void {
    this.showNavbar = !(
      url.startsWith('/login') ||
      url.startsWith('/signup') ||
      url.startsWith('/forgotpass') ||
      url.startsWith('/resetpass') ||
      url.startsWith('/course-details/')
    );
  }
}
