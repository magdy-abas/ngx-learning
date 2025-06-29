import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../environment/environment.local';
import { DoctorsResponse } from '../interfaces/doctors.interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private http: HttpClient) {}

  getDoctors(page: number = 1, id?: number): Observable<DoctorsResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (id !== undefined) {
      params = params.set('id', id.toString());
    }

    return this.http.get<DoctorsResponse>(`${baseUrl}doctors`, { params });
  }
}
