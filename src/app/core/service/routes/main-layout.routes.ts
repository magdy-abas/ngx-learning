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
  },
  {
    path: 'booking',
    loadComponent: () =>
      import(
        '../../../components/doctors-components/booking/booking.component'
      ).then((m) => m.BookingComponent),
    title: 'booking',
  },
  {
    path: 'instructor-register',
    loadComponent: () =>
      import(
        '../../../components/doctors-components/doctors-reg/doctors-reg.component'
      ).then((m) => m.DoctorsRegComponent),
    title: 'instructor-register',
  },

  {
    path: 'courses/category/:categoryId',

    loadComponent: () =>
      import(
        '../../../components/courses-components/courses/courses.component'
      ).then((m) => m.CoursesComponent),
    title: 'courses-category',
  },
  {
    path: 'courses/doctor/:doctorId',

    loadComponent: () =>
      import(
        '../../../components/courses-components/courses/courses.component'
      ).then((m) => m.CoursesComponent),
    title: 'courses-doctor',
  },
  {
    path: 'course-details/:id',

    loadComponent: () =>
      import(
        '../../../components/courses-components/courses-details/courses-details.component'
      ).then((m) => m.CoursesDetailsComponent),
    title: 'course-details',
  },
  {
    path: 'categories',

    loadComponent: () =>
      import('../../../components/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    title: 'categories',
  },
  {
    path: 'categories/:categoryId',

    loadComponent: () =>
      import('../../../components/categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    title: 'categories-sub',
  },

  {
    path: 'instructors',

    loadComponent: () =>
      import(
        '../../../components/doctors-components/doctors/doctors.component'
      ).then((m) => m.DoctorsComponent),
    title: 'instructors',
  },
  {
    path: 'instructor-profile/:id',

    loadComponent: () =>
      import(
        '../../../components/doctors-components/doctors-details/doctors-details.component'
      ).then((m) => m.DoctorsDetailsComponent),
    title: 'instructor profile',
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
  },
  {
    canActivate: [publicGuard],
    path: 'signup',
    loadComponent: () =>
      import(
        '../../../components/auth-components/register/register.component'
      ).then((m) => m.RegisterComponent),
    title: 'Signup',
  },
  {
    canActivate: [publicGuard],
    path: 'forgotpass',
    loadComponent: () =>
      import(
        '../../../components/auth-components/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    title: 'Forgot Password',
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
  },
  {
    path: 'course-quiz/:courseId/:quizId',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../../../components/courses-components/courses-quiz/courses-quiz.component'
      ).then((m) => m.CoursesQuizComponent),
    title: 'quiz',
  },
];
