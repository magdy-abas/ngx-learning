import { Injectable } from '@angular/core';
import { SettingResponse } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly storageKey = 'darkMode';

  constructor() {}

  isDarkMode(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  setDarkMode(isDark: boolean): void {
    localStorage.setItem(this.storageKey, isDark.toString());
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleDarkMode(): void {
    const newValue = !this.isDarkMode();
    this.setDarkMode(newValue);
  }

  applyMode(): void {
    const isDark = this.isDarkMode();
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  getLogo(settings: SettingResponse | null): string {
    if (!settings || !settings.data) return '';
    return this.isDarkMode()
      ? settings.data.dark_mode_logo ?? ''
      : settings.data.light_mode_logo ?? '';
  }
}
