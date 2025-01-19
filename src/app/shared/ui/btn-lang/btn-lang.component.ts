import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-lang',
  standalone: true,
  imports: [],
  templateUrl: './btn-lang.component.html',
  styleUrl: './btn-lang.component.scss',
})
export class BtnLangComponent {
  private readonly _GlobalTranslateService = inject(GlobalTranslateService);
  readonly _TranslateService = inject(TranslateService);

  setLanguage(lang: 'en' | 'ar') {
    this._GlobalTranslateService.changeLanguage(lang);
  }
}
