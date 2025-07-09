import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppAccessService {
  private _hasAccess$ = new BehaviorSubject<boolean>(false);

  setAccess(status: boolean) {
    console.log('🛑 Setting access to:', status);
    this._hasAccess$.next(status);
  }

  getAccess(): boolean {
    return this._hasAccess$.value;
  }

  access$() {
    return this._hasAccess$.asObservable();
  }
}
