import { Component } from '@angular/core';
import { AuthNavbarComponent } from '../../components/auth-navbar/auth-navbar.component';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [AuthNavbarComponent, RouterOutlet, HomeComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
