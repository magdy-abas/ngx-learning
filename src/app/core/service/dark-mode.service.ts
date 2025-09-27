import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SettingResponse } from '../interfaces/settings.interface';
import { SsrService } from './ssr.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly storageKey = 'darkMode';

  constructor(
    private ssr: SsrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isDarkMode(): boolean {
    return this.ssr.getLocal(this.storageKey) === 'true';
  }

  setDarkMode(isDark: boolean): void {
    this.ssr.setLocal(this.storageKey, isDark.toString());
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  toggleDarkMode(): void {
    const newValue = !this.isDarkMode();
    this.setDarkMode(newValue);
  }

  applyMode(): void {
    const isDark = this.isDarkMode();
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  getLogo(settings: SettingResponse | null): string {
    if (!settings || !settings.data) return '';
    return this.isDarkMode()
      ? settings.data.dark_mode_logo ?? ''
      : settings.data.light_mode_logo ?? '';
  }
}
