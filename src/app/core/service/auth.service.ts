import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl, headers } from '../../environment/environment.local';

import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendOtpDto,
  sendPinCodeDto,
  UserData,
  WatsLoginDto,
} from './../Dtos/AuthDtos';
import {
  AuthResponse,
  ResetPasswordSuccessResponse,
  SendPinCodeSuccessResponse,
  CheckResponse,
  OtpResponse,
  LoginResponse,
} from '../interfaces/auth.interface';
import { SsrService } from './ssr.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    private cookieService: CookieService,
    private ssr: SsrService
  ) {
    this.auth.set(this.isAuthenticated());
    if (this.isAuthenticated()) {
      const storedUserData = this.ssr.getLocal('userData');
      if (storedUserData) {
        this.userData = JSON.parse(storedUserData);
      }
    }
  }
  userData: UserData | null = null;
  auth = signal(false);

  sendOtpCode(data: SendOtpDto): Observable<OtpResponse> {
    return this._HttpClient.post<OtpResponse>(
      `${baseUrl}auth/ws/send-otp`,
      data
    );
  }

  watsLogin(data: WatsLoginDto): Observable<LoginResponse> {
    return this._HttpClient.post<LoginResponse>(
      `${baseUrl}auth/ws/login`,
      data
    );
  }

  //regular login
  register(data: RegisterDto): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${baseUrl}register`, data);
  }
  login(data: LoginDto): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${baseUrl}login`, data);
  }
  resetPassword(
    data: ResetPasswordDto
  ): Observable<ResetPasswordSuccessResponse> {
    return this._HttpClient.post<ResetPasswordSuccessResponse>(
      `${baseUrl}reset-password`,
      data,
      {}
    );
  }
  sendPinCode(data: sendPinCodeDto): Observable<SendPinCodeSuccessResponse> {
    return this._HttpClient.post<SendPinCodeSuccessResponse>(
      `${baseUrl}send-pin-code`,
      data
    );
  }

  saveUserData(userData: UserData): void {
    this.userData = userData;
    this.ssr.setLocal('userData', JSON.stringify(userData));
  }

  saveToken(token: string): void {
    this.cookieService.set('token', token, {
      path: '/',
      secure: true,
      sameSite: 'None',
    });

    this.ssr.setLocal('token', token);

    this.auth.set(true);
  }

  // logout
  logout(): void {
    this.cookieService.delete('token', '/');

    this.ssr.removeLocal('token');
    this.ssr.removeLocal('userData');

    this.userData = null;
    this.auth.set(false);

    this._Router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('token') || this.ssr.getLocal('token');
    return !!token;
  }

  getToken(): string | null {
    return (
      this.cookieService.get('token') || this.ssr.getLocal('token') || null
    );
  }
}
