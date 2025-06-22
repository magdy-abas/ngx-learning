import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { SettingResponse } from '../interfaces/settings.interface';
import { baseUrl } from '../../environment/environment.local';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private isSecurityChecked = new BehaviorSubject<boolean>(false);
  private initializationComplete = new BehaviorSubject<boolean>(false);
  securityStatus$ = this.isSecurityChecked.asObservable();
  initialized$ = this.initializationComplete.asObservable();

  constructor(private _HttpClient: HttpClient, private router: Router) {}

  CheckSecurityPoint(): Observable<any> {
    return this._HttpClient.get(`${baseUrl}mobile-versions/last-version`);
  }

  checkApiStatus(): Observable<boolean> {
    return this.CheckSecurityPoint().pipe(
      tap((response) => {
        if (response.status === 1) {
          this.isSecurityChecked.next(true);
          this.initializationComplete.next(true);
        } else {
          this.isSecurityChecked.next(false);
          this.initializationComplete.next(true);
          this.router.navigate(['/notfound']);
        }
      }),
      map((response) => response.status === 1),
      catchError((error) => {
        this.isSecurityChecked.next(false);
        this.initializationComplete.next(true);
        if (error.status === 404) {
          this.router.navigate(['/notfound']);
        }
        return of(false);
      })
    );
  }

  getSecurityStatus(): boolean {
    return this.isSecurityChecked.value;
  }

  isInitialized(): boolean {
    return this.initializationComplete.value;
  }

  settings(): Observable<SettingResponse> {
    return this._HttpClient.get<SettingResponse>(`${baseUrl}settings`);
  }

  // New:  settings in localStorage
  saveSettingsToLocalStorage(settings: SettingResponse) {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }

  //  Read from localStorage
  getSettingsFromLocalStorage(): SettingResponse | null {
    const data = localStorage.getItem('appSettings');
    return data ? JSON.parse(data) : null;
  }
}
