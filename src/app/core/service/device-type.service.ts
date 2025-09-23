import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
  private _isIOS: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const userAgent = navigator.userAgent || navigator.vendor;
      this._isIOS = /iPad|iPhone|iPod/.test(userAgent);
    }
  }

  get isIOS(): boolean {
    return this._isIOS;
  }
}
