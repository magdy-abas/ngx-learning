import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SsrService {
  private platformId = inject(PLATFORM_ID);

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  setLocal(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  getLocal(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeLocal(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  clearLocal(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }

  setSession(key: string, value: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(key, value);
    }
  }

  getSession(key: string): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  removeSession(key: string): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(key);
    }
  }

  clearSession(): void {
    if (this.isBrowser()) {
      sessionStorage.clear();
    }
  }

  getWindow(): Window | null {
    return this.isBrowser() ? window : null;
  }

  getDocument(): Document | null {
    return this.isBrowser() ? document : null;
  }

  getIntersectionObserver(): typeof IntersectionObserver | null {
    return this.isBrowser() ? IntersectionObserver : null;
  }

  getResizeObserver(): typeof ResizeObserver | null {
    return this.isBrowser() ? ResizeObserver : null;
  }
  getNavigator(): Navigator | null {
    return this.isBrowser() ? navigator : null;
  }
  getLocation(): Location | null {
    return this.isBrowser() ? window.location : null;
  }
}
