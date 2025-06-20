import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { publicGuard } from './core/guard/public.guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses-components/courses/courses.component';
import { CoursesDetailsComponent } from './components/courses-components/courses-details/courses-details.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/auth-components/login/login.component';
import { RegisterComponent } from './components/auth-components/register/register.component';
import { ForgotPasswordComponent } from './components/auth-components/forgot-password/forgot-password.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CoursesQuizComponent } from './components/courses-components/courses-quiz/courses-quiz.component';

import { CategoriesComponent } from './components/categories/categories.component';
import { MyCoursesComponent } from './components/courses-components/my-courses/my-courses.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { ProfileComponent } from './components/profile/profile.component';

const publicRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'home' },
  { path: 'courses', component: CoursesComponent, title: 'courses' },
  {
    path: 'courses/category/:categoryId',
    component: CoursesComponent,
    title: 'courses-category',
  },
  {
    path: 'courses/doctor/:doctorId',
    component: CoursesComponent,
    title: 'courses-doctor',
  },
  {
    path: 'course-details/:id',
    component: CoursesDetailsComponent,
    title: 'course-details',
  },
  { path: 'categories', component: CategoriesComponent, title: 'categories' },
  {
    path: 'categories/:categoryId',
    component: CategoriesComponent,
    title: 'categories-sub',
  },
  {
    path: 'course-quiz/:courseId/:quizId',
    component: CoursesQuizComponent,
    title: 'quiz',
  },
];

const authRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'home' },
  { path: 'courses', component: CoursesComponent, title: 'courses' },
  {
    path: 'courses/category/:categoryId',
    component: CoursesComponent,
    title: 'courses-category',
  },
  {
    path: 'doctors',
    component: DoctorsComponent,
    title: 'doctors',
  },
  {
    path: 'courses/doctor/:doctorId',
    component: CoursesComponent,
    title: 'courses-doctor',
  },
  {
    path: 'course-details/:id',
    component: CoursesDetailsComponent,
    title: 'course-details',
  },
  {
    path: 'course-quiz/:courseId/:quizId',
    component: CoursesQuizComponent,
    title: 'quiz',
  },

  { path: 'my-courses', component: MyCoursesComponent, title: 'myCourses' },
  { path: 'categories', component: CategoriesComponent, title: 'categories' },
  {
    path: 'categories/:categoryId',
    component: CategoriesComponent,
    title: 'categories-sub',
  },
  {
    path: 'courses/doctor/:doctorId',
    component: CoursesComponent,
    title: 'courses-doctor',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'profile',
  },
];

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [publicGuard],
    children: publicRoutes,
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [publicGuard],
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
    path: 'auth',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: authRoutes,
  },
  { path: '**', component: NotFoundComponent, title: 'not found' },
];
