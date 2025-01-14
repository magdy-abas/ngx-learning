import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalTranslateService {
  constructor(private _TranslateService: TranslateService) {
    // get Lang
    let lang = localStorage.getItem('lang');

    // set Default lang
    this._TranslateService.setDefaultLang('en');

    this._TranslateService.use(lang!);

    // direction
  }

  changeDirection(): void {
    let lang = localStorage.getItem('lang');
    if ((lang = 'en')) {
      document.documentElement.dir = 'ltr';
    } else if ((lang = 'ar')) {
      document.documentElement.dir = 'rtl';
    }
  }
}
