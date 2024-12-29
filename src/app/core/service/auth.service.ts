import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl, headers } from '../../environment/environment.local';

import { Observable } from 'rxjs';
import { LoginDto, RegisterDto } from '../../shared/Dtos/AuthDtos';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

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
}
