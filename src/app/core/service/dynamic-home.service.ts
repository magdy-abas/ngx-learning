import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, headers } from '../../environment/environment.local';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicHomeService {
  constructor(private _HttpClient: HttpClient) {}

  getHomeData(): Observable<any> {
    return this._HttpClient.get(`${baseUrl}home/dinamic`);
  }
}
