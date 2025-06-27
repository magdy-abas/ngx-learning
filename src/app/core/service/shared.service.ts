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
  private settingsData: SettingResponse | null = null;
  private settingsSubject = new BehaviorSubject<SettingResponse | null>(null);
  public settings$ = this.settingsSubject.asObservable();
  private isSecurityChecked = new BehaviorSubject<boolean>(false);
  private initializationComplete = new BehaviorSubject<boolean>(false);
  securityStatus$ = this.isSecurityChecked.asObservable();
  initialized$ = this.initializationComplete.asObservable();
  private loginMethod: string | null = null;

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
          this.setLoginMethod(response.data.settings.auth_login_with);
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

  setLoginMethod(method: string) {
    this.loginMethod = method;
  }

  getLoginMethod(): string | null {
    return this.loginMethod;
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

  //  settings in localStorage
  saveSettingsToLocalStorage(settings: SettingResponse) {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }

  loadSettings(): Promise<void> {
    return this.settings()
      .toPromise()
      .then((response) => {
        if (response) {
          this.settingsData = response;
          this.saveSettingsToLocalStorage(response);
          this.settingsSubject.next(response);
        } else {
          console.warn('Settings API returned undefined');
        }
      });
  }

  getSettings(): SettingResponse | null {
    if (this.settingsData) {
      return this.settingsData;
    }
    const local = localStorage.getItem('appSettings');
    return local ? JSON.parse(local) : null;
  }
}
