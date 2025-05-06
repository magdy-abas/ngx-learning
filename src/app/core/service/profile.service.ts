import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateInfoResponse } from '../interfaces/profile.interface';
import { baseUrl } from '../../environment/environment.local';
import { UpdateProfileDto } from '../Dtos/profileDtos';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _HttpClient: HttpClient) {}

  updateInfo(data: UpdateProfileDto): Observable<UpdateInfoResponse> {
    return this._HttpClient.post<UpdateInfoResponse>(
      `${baseUrl}update-profile`,
      data
    );
  }
}
