import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl, headers } from '../../environment/environment.local';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';
import { LoginDto, RegisterDto, UserData } from '../interfaces/Dtos/AuthDtos';
import {
  AuthResponse,
  ResetPasswordSuccessResponse,
  SendPinCodeSuccessResponse,
} from '../Dtos/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    private cookieService: CookieService
  ) {
    this.auth.set(this.isAuthenticated());
    if (this.isAuthenticated()) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        this.userData = JSON.parse(storedUserData);
      }
    }
  }
  userData: UserData | null = null;
  auth = signal(false);

  register(data: RegisterDto): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${baseUrl}register`, data);
  }
  login(data: LoginDto): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${baseUrl}login`, data);
  }
  resetPassword(data: object): Observable<ResetPasswordSuccessResponse> {
    return this._HttpClient.post<ResetPasswordSuccessResponse>(
      `${baseUrl}reset-password`,
      data,
      {}
    );
  }
  sendPinCode(data: object): Observable<SendPinCodeSuccessResponse> {
    return this._HttpClient.post<SendPinCodeSuccessResponse>(
      `${baseUrl}send-pin-code`,
      data
    );
  }

  saveUserData(userData: UserData): void {
    this.userData = userData;
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  saveToken(token: string): void {
    this.cookieService.set('token', token, {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
    this.auth.set(true); // Set auth flag to true after saving token
  }

  clearUserData(): void {
    this.cookieService.delete('token', '/'); // Delete the token cookie
    localStorage.removeItem('userData'); // Remove user data from localStorage
    this.userData = null;
    this.auth.set(false);
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('token');
  }

  getToken(): string | null {
    return this.cookieService.get('token') || null;
  }
}
