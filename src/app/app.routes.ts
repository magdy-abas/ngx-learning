import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/auth-components/login/login.component';
import { RegisterComponent } from './components/auth-components/register/register.component';
import { ForgotPasswordComponent } from './components/auth-components/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'forgotPass', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'home' },
      { path: 'login', component: LoginComponent, title: 'signin' },
      { path: 'signup', component: RegisterComponent, title: 'signup' },
      {
        path: 'forgotPass',
        component: ForgotPasswordComponent,
        title: 'forgotPass',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'home' },
    ],
  },
  { path: '**', component: NotFoundComponent, title: 'not found' },
];
