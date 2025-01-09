import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl, headers } from '../../environment/environment.local';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';
import { LoginDto, RegisterDto } from '../interfaces/Dtos/AuthDtos';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    private cookieService: CookieService
  ) {}
  userData: any = null;
  auth = signal(false); // Signal to track auth status

  register(data: RegisterDto): Observable<any> {
    return this._HttpClient.post(`${baseUrl}register`, data, {
      headers: headers,
    });
  }

  login(data: LoginDto): Observable<any> {
    return this._HttpClient.post(`${baseUrl}login`, data, {
      headers: headers,
    });
  }
  resetPassword(data: object): Observable<any> {
    return this._HttpClient.post(`${baseUrl}reset-password`, data, {
      headers: headers,
    });
  }
  sendPinCode(data: object): Observable<any> {
    return this._HttpClient.post(`${baseUrl}send-pin-code`, data, {
      headers: headers,
    });
  }

  saveUserData(): void {
    const token = this.cookieService.get('token'); // Retrieve token from cookies

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT
        this.userData = decoded; // Save decoded data
        this.auth.set(true); // Set auth flag to true
      } catch (error) {
        this._Router.navigate(['/login']);
        this.clearUserData(); // Clear cookies if token is invalid
      }
    } else {
      this.auth.set(false); // Set auth flag to false if no token
    }
  }

  saveToken(token: string): void {
    this.cookieService.set('token', token, {
      path: '/',
      secure: true, // Use secure cookies in production
      sameSite: 'Strict', // Prevent CSRF attacks
    });
    this.auth.set(true); // Set auth flag to true after saving token
  }

  clearUserData(): void {
    this.cookieService.delete('token', '/'); // Delete the token cookie
    this.userData = null; // Clear user data in memory
    this.auth.set(false); // Set auth flag to false
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('token');
  }
}
