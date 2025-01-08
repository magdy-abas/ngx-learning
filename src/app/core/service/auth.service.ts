import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl, headers } from '../../environment/environment.local';
import { jwtDecode } from 'jwt-decode';

import { Observable } from 'rxjs';
import { LoginDto, RegisterDto } from '../interfaces/Dtos/AuthDtos';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}
  userData: any = null;

  saveUserData = (): void => {
    let token: any = localStorage.getItem('token');

    if (localStorage.getItem('token') != null) {
      try {
        let decoded = jwtDecode(token);

        this.userData = decoded;
      } catch (error) {
        this._Router.navigate(['login']);
        localStorage.clear();
      }
    }
  };

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
}
