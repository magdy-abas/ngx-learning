import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../environment/environment.local';
import { Observable } from 'rxjs';
import { DynamicHomeResponse } from '../Dtos/dynamic-home.models';

@Injectable({
  providedIn: 'root',
})
export class DynamicHomeService {
  constructor(private _HttpClient: HttpClient) {}

  getHomeData(): Observable<DynamicHomeResponse> {
    return this._HttpClient.get<DynamicHomeResponse>(`${baseUrl}home/dinamic`);
  }
}
