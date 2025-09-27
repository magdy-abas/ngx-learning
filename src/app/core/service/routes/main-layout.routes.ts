// mainRoutes.ts
import { MainLayoutComponent } from '../../../layouts/main-layout/main-layout.component';
import { authGuard } from '../../guard/auth.guard';
import { publicGuard } from '../../guard/public.guard';

import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('../../../components/home-selector/home-selector.component').then(
        (m) => m.HomeSelectorComponent
      ),
    title: 'home',
  },

  {
    path: 'courses',
    loadComponent: () =>
      import(
        '../../../components/courses-components/courses/courses.component'
      ).then((m) => m.CoursesComponent),
    title: 'courses',
    data: { ssr: false },
  },
  {
    path: 'booking',
    loadComponent: () =>
      import(
        '../../../components/doctors-components/booking/booking.component'
      ).then((m) => m.BookingComponent),
    title: 'booking',
    data: { ssr: false },
  },
  {
    path: 'instructor-register',
    loadComponent: () =>
      import(
        '../../../components/doctors-components/doctors-reg/doctors-reg.component'
      ).then((m) => m.DoctorsRegComponent),
    title: 'instructor-register',
    data: { ssr: false },
  },

  {
    path: 'courses/category/:categoryId',

    loadComponent: () =>
      import(
        '../../../components/courses-components/courses/courses.component'
      ).then((m) => m.CoursesComponent),
    title: 'courses-category',
    data: { ssr: false },
  },
  {
    path: 'courses/doctor/:doctorId',

    loadComponent: () =>
      import(
        '../../../components/courses-components/courses/courses.component'
      ).then((m) => m.CoursesComponent),
    title: 'courses-doctor',
    data: { ssr: false },
  },
  {
    path: 'course-details/:id',

    loadComponent: () =>
      import(
        '../../../components/courses-components/courses-details/courses-details.component'
      ).then((m) => m.CoursesDetailsComponent),
    title: 'course-details',
    data: { ssr: false },
  },
  {
    path: 'categories',

    loadComponent: () =>
      import('../../../components/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    title: 'categories',
    data: { ssr: false },
  },
  {
    path: 'categories/:categoryId',

    loadComponent: () =>
      import('../../../components/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    title: 'categories-sub',
    data: { ssr: false },
  },

  {
    path: 'instructors',

    loadComponent: () =>
      import(
        '../../../components/doctors-components/doctors/doctors.component'
      ).then((m) => m.DoctorsComponent),
    title: 'instructors',
    data: { ssr: false },
  },
  {
    path: 'instructor-profile/:id',

    loadComponent: () =>
      import(
        '../../../components/doctors-components/doctors-details/doctors-details.component'
      ).then((m) => m.DoctorsDetailsComponent),
    title: 'instructor profile',
    data: { ssr: false },
  },
  // Public pages
  {
    canActivate: [publicGuard],
    path: 'login',
    loadComponent: () =>
      import('../../../components/auth-components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login',
    data: { ssr: false },
  },
  {
    canActivate: [publicGuard],
    path: 'signup',
    loadComponent: () =>
      import(
        '../../../components/auth-components/register/register.component'
      ).then((m) => m.RegisterComponent),
    title: 'Signup',
    data: { ssr: false },
  },
  {
    canActivate: [publicGuard],
    path: 'forgotpass',
    loadComponent: () =>
      import(
        '../../../components/auth-components/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    title: 'Forgot Password',
    data: { ssr: false },
  },

  // Protected pages

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../../components/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'profile',
    data: { ssr: false },
  },
  {
    path: 'course-quiz/:courseId/:quizId',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../../../components/courses-components/courses-quiz/courses-quiz.component'
      ).then((m) => m.CoursesQuizComponent),
    title: 'quiz',
    data: { ssr: false },
  },
];
