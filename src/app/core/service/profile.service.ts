import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MettingDateApiResponse,
  SessionsResponse,
  UpdateInfoResponse,
} from '../interfaces/profile.interface';
import { baseUrl } from '../../environment/environment.local';
import { UpdateProfileDto } from '../Dtos/profileDtos';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _HttpClient: HttpClient) {}

  updateInfo(body: any): Observable<UpdateInfoResponse> {
    return this._HttpClient.post<UpdateInfoResponse>(
      `${baseUrl}update-profile`,
      body
    );
  }
  getMeetingTimes(): Observable<MettingDateApiResponse> {
    return this._HttpClient.get<MettingDateApiResponse>(
      `${baseUrl}lessons/upcoming-meeting`
    );
  }

  getPrivateSessions(date?: string): Observable<SessionsResponse> {
    const params: any = {};
    if (date) params.date = date;

    return this._HttpClient.get<SessionsResponse>(
      `${baseUrl}doctors/private-sessions/list`,
      { params }
    );
  }
}
