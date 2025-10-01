import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../environment/environment.local';
import { DoctorsResponse } from '../interfaces/doctors.interface';
import {
  AvailableDatesResponse,
  AvailableTimesResponse,
  BookSessionResponse,
} from '../interfaces/private-sessions.interface';
import { SKIP_GLOBAL_SPINNER } from '../../shared/utils/loading.utils';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private http: HttpClient) {}

  getDoctors(
    page: number = 1,
    id?: number,
    showSpinner: boolean = true
  ): Observable<DoctorsResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (id !== undefined) {
      params = params.set('id', id.toString());
    }

    return this.http.get<DoctorsResponse>(`${baseUrl}doctors`, {
      params,
      context: new HttpContext().set(SKIP_GLOBAL_SPINNER, !showSpinner),
      observe: 'body' as const,
    });
  }
  // BookPrivateAppointment(doctor_id: number): Observable<any> {
  //   return this.http.post(`${baseUrl}request-private-course`, { doctor_id });
  // }

  doctorRegister(data: {
    name: string;
    email: string;
    phone: string;
    courses: string;
    note: string;
  }): Observable<any> {
    return this.http.post(`${baseUrl}register-doctor`, data);
  }

  getAvailableDates(doctorId: number): Observable<AvailableDatesResponse> {
    return this.http.get<AvailableDatesResponse>(
      `${baseUrl}doctors/private-sessions/${doctorId}/dates`
    );
  }

  getAvailableTimes(
    doctorId: number,
    date: string
  ): Observable<AvailableTimesResponse> {
    return this.http.get<AvailableTimesResponse>(
      `${baseUrl}doctors/private-sessions/${doctorId}/time-by-date/${date}`
    );
  }

  bookSession(
    doctorId: number,
    date: string,
    time: string
  ): Observable<BookSessionResponse> {
    return this.http.post<BookSessionResponse>(
      `${baseUrl}doctors/private-sessions/book`,
      {
        doctor_id: doctorId,
        date,
        time,
      }
    );
  }
}
