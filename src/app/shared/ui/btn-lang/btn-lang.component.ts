import { Component, inject } from '@angular/core';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-lang',
  standalone: true,
  templateUrl: './btn-lang.component.html',
  styleUrl: './btn-lang.component.scss',
})
export class BtnLangComponent {
  private readonly _GlobalTranslateService = inject(GlobalTranslateService);
  readonly _TranslateService = inject(TranslateService);

  toggleLanguage() {
    const currentLang = this._TranslateService.currentLang;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    this._GlobalTranslateService.changeLanguage(newLang);
  }

  get currentLangShort(): 'AR' | 'EN' {
    return this._TranslateService.currentLang === 'ar' ? 'EN' : 'AR';
  }
}
