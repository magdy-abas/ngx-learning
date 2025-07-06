import { Component, inject } from '@angular/core';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-btn-lang',
  standalone: true,
  templateUrl: './btn-lang.component.html',
  styleUrl: './btn-lang.component.scss',
  imports: [NgClass],
})
export class BtnLangComponent {
  private readonly _GlobalTranslateService = inject(GlobalTranslateService);
  readonly _TranslateService = inject(TranslateService);

  switchTo(lang: 'en' | 'ar') {
    if (this._TranslateService.currentLang !== lang) {
      this._GlobalTranslateService.changeLanguage(lang);
    }
  }

  isCurrentLang(lang: 'en' | 'ar'): boolean {
    return this._TranslateService.currentLang === lang;
  }
}
