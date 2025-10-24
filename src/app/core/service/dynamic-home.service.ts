import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../environment/environment.local';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DynamicHomeResponse } from '../interfaces/dynamic-home.interface';

@Injectable({
  providedIn: 'root',
})
export class DynamicHomeService {
  constructor(private _HttpClient: HttpClient) {}
  private appAttrs: any[] = [];
  private appAttrsSubject = new BehaviorSubject<any[]>([]);
  public appAttrs$ = this.appAttrsSubject.asObservable();

  getHomeData(): Observable<DynamicHomeResponse> {
    return this._HttpClient
      .get<DynamicHomeResponse>(`${baseUrl}home/dinamic?with_last_version=1`)
      .pipe(
        tap((response) => {
          if (response.last_version_data?.app_attrs) {
            this.setAppAttrs(response.last_version_data.app_attrs);
          }
        })
      );
  }
  // response.data.app_attrs

  setAppAttrs(attrs: any[]) {
    this.appAttrs = attrs;
    this.appAttrsSubject.next(attrs);
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
