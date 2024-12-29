import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/auth-components/login/login.component';
import { RegisterComponent } from './components/auth-components/register/register.component';
import { ForgotPasswordComponent } from './components/auth-components/forgot-password/forgot-password.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CoursesDetailsComponent } from './components/courses-details/courses-details.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    // Routes for non-authenticated users

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'home' },
      { path: 'courses', component: CoursesComponent, title: 'courses' },
      {
        path: 'courses-d',
        component: CoursesDetailsComponent,
        title: 'courses-details',
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    // Routes for auth pages
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'signup', component: RegisterComponent, title: 'Signup' },
      {
        path: 'forgotpass',
        component: ForgotPasswordComponent,
        title: 'Forgot Password',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    // Routes for authenticated users
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'home' },
    ],
  },
  { path: '**', component: NotFoundComponent, title: 'not found' },
];
