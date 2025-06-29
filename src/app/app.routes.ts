import { Routes } from '@angular/router';
import { publicGuard } from './core/guard/public.guard';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent
          ),
        title: 'home',
      },
      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'courses',
        loadComponent: () =>
          import(
            './components/courses-components/courses/courses.component'
          ).then((m) => m.CoursesComponent),
        title: 'courses',
      },
      {
        path: 'courses/category/:categoryId',
        loadComponent: () =>
          import(
            './components/courses-components/courses/courses.component'
          ).then((m) => m.CoursesComponent),
        title: 'courses-category',
      },
      {
        path: 'courses/doctor/:doctorId',
        loadComponent: () =>
          import(
            './components/courses-components/courses/courses.component'
          ).then((m) => m.CoursesComponent),
        title: 'courses-doctor',
      },

      {
        path: 'course-details/:id',
        loadComponent: () =>
          import(
            './components/courses-components/courses-details/courses-details.component'
          ).then((m) => m.CoursesDetailsComponent),
        title: 'course-details',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
        title: 'categories',
      },
      {
        path: 'categories/:categoryId',
        loadComponent: () =>
          import('./components/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
        title: 'categories-sub',
      },
      {
        path: 'course-quiz/:courseId/:quizId',
        loadComponent: () =>
          import(
            './components/courses-components/courses-quiz/courses-quiz.component'
          ).then((m) => m.CoursesQuizComponent),
        title: 'quiz',
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import(
            './components/doctors-components/doctors/doctors.component'
          ).then((m) => m.DoctorsComponent),
        title: 'instructors',
      },
      {
        path: 'instructor-profile/:id',
        loadComponent: () =>
          import(
            './components/doctors-components/doctors-details/doctors-details.component'
          ).then((m) => m.DoctorsDetailsComponent),
        title: 'instructor profile',
      },
    ],
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layouts/app-layout/app-layout.component').then(
        (m) => m.AppLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/application-page/application-page.component'
          ).then((m) => m.ApplicationPageComponent),
        title: 'app-landing',
      },
    ],
  },
  // Auth routes (login, register, forgot)
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth-components/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'Login',
      },
      {
        path: 'signup',
        loadComponent: () =>
          import(
            './components/auth-components/register/register.component'
          ).then((m) => m.RegisterComponent),
        title: 'Signup',
      },
      {
        path: 'forgotpass',
        loadComponent: () =>
          import(
            './components/auth-components/forgot-password/forgot-password.component'
          ).then((m) => m.ForgotPasswordComponent),
        title: 'Forgot Password',
      },
    ],
  },

  // Protected routes
  {
    path: 'auth',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent
          ),
        title: 'home',
      },
      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'courses',
        loadComponent: () =>
          import(
            './components/courses-components/courses/courses.component'
          ).then((m) => m.CoursesComponent),
        title: 'courses',
      },
      {
        path: 'courses/category/:categoryId',
        loadComponent: () =>
          import(
            './components/courses-components/courses/courses.component'
          ).then((m) => m.CoursesComponent),
        title: 'courses-category',
      },
      {
        path: 'courses/doctor/:doctorId',
        loadComponent: () =>
          import(
            './components/courses-components/courses/courses.component'
          ).then((m) => m.CoursesComponent),
        title: 'courses-doctor',
      },
      {
        path: 'course-details/:id',
        loadComponent: () =>
          import(
            './components/courses-components/courses-details/courses-details.component'
          ).then((m) => m.CoursesDetailsComponent),
        title: 'course-details',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
        title: 'categories',
      },
      {
        path: 'categories/:categoryId',
        loadComponent: () =>
          import('./components/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
        title: 'categories-sub',
      },
      {
        path: 'course-quiz/:courseId/:quizId',
        loadComponent: () =>
          import(
            './components/courses-components/courses-quiz/courses-quiz.component'
          ).then((m) => m.CoursesQuizComponent),
        title: 'quiz',
      },
      {
        path: 'my-courses',
        loadComponent: () =>
          import(
            './components/courses-components/my-courses/my-courses.component'
          ).then((m) => m.MyCoursesComponent),
        title: 'myCourses',
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import(
            './components/doctors-components/doctors/doctors.component'
          ).then((m) => m.DoctorsComponent),
        title: 'instructors',
      },
      {
        path: 'instructors-profile/:id',
        loadComponent: () =>
          import(
            './components/doctors-components/doctors-details/doctors-details.component'
          ).then((m) => m.DoctorsDetailsComponent),
        title: 'instructor profile',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        title: 'profile',
      },
    ],
  },

  // Not Found route
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'not found',
  },
];
