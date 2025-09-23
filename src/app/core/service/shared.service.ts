import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { SettingResponse } from '../interfaces/settings.interface';
import { baseUrl } from '../../environment/environment.local';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckSecurityPointResponse } from '../interfaces/mobile-versions';

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
  private homeVersion: 'v1' | 'v2' = 'v2';
  private appAttrs: any[] = [];

  constructor(private _HttpClient: HttpClient, private router: Router) {}

  CheckSecurityPoint(): Observable<CheckSecurityPointResponse> {
    return this._HttpClient.get<CheckSecurityPointResponse>(
      `${baseUrl}mobile-versions/last-version`
    );
  }

  checkApiStatus(): Observable<boolean> {
    return this.CheckSecurityPoint().pipe(
      tap((response) => {
        if (response.status === 1) {
          this.isSecurityChecked.next(true);
          this.initializationComplete.next(true);

          // home version (v1 or v2)
          const version = this.extractHomeVersion(response.data);
          this.setHomeVersion(version);
          this.setLoginMethod(response.data.settings.auth_login_with);

          if (version === 'v2') {
            this.setAppAttrs(response.data.app_attrs || []);
          }
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

  async loadSettings(): Promise<void> {
    const response = await firstValueFrom(this.settings());
    if (response) {
      this.settingsData = response;
      this.saveSettingsToLocalStorage(response);
      this.settingsSubject.next(response);
    }
  }

  getSettings(): SettingResponse | null {
    if (this.settingsData) {
      return this.settingsData;
    }
    const local = localStorage.getItem('appSettings');
    return local ? JSON.parse(local) : null;
  }
  private extractHomeVersion(data: any): 'v1' | 'v2' {
    const appAttrs = data?.app_attrs;
    const homeAttr = appAttrs?.find((attr: any) => attr.key === 'home_version');

    if (homeAttr?.value === 'v2' || homeAttr?.value === 'v1') {
      return homeAttr.value;
    }

    return 'v1';
  }

  setHomeVersion(version: 'v1' | 'v2') {
    this.homeVersion = version;
    this.applyHomeClass(version);
  }

  getHomeVersion(): 'v1' | 'v2' {
    return this.homeVersion;
  }

  private applyHomeClass(version: 'v1' | 'v2') {
    document.body.classList.remove('home-v1', 'home-v2');
    document.body.classList.add(version === 'v1' ? 'home-v1' : 'home-v2');
  }

  // response.data.app_attrs

  setAppAttrs(attrs: any[]) {
    this.appAttrs = attrs;
  }

  getAppAttrs() {
    return this.appAttrs;
  }

  getAppAttrByCategory(category: string) {
    return this.appAttrs?.filter((attr) => attr.category === category) || [];
  }

  getAppAttrValue(category: string, key: string): string | null {
    const item = this.appAttrs.find(
      (attr) => attr.category === category && attr.key === key
    );
    return item ? item.value : null;
  }
}
