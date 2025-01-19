import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class GlobalTranslateService {
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(
    null,
    null
  );
  private styleLinks: HTMLLinkElement[] = [];

  constructor(
    private _TranslateService: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    let lang = localStorage.getItem('lang') || 'ar';
    this._TranslateService.setDefaultLang('ar');
    this._TranslateService.use(lang);
    this.changeDirection();

    // Add language class on initialization
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('lang-ar', 'lang-en');
    htmlElement.classList.add(`lang-${lang}`);
  }

  changeDirection(): void {
    let lang = localStorage.getItem('lang') || 'ar';
    const htmlElement = document.documentElement;

    // Remove existing language classes
    htmlElement.classList.remove('lang-ar', 'lang-en');

    if (lang === 'en') {
      this._Renderer2.setAttribute(htmlElement, 'dir', 'ltr');
      this._Renderer2.setAttribute(htmlElement, 'lang', 'en');
      htmlElement.classList.add('lang-en');
    } else if (lang === 'ar') {
      this._Renderer2.setAttribute(htmlElement, 'dir', 'rtl');
      this._Renderer2.setAttribute(htmlElement, 'lang', 'ar');
      htmlElement.classList.add('lang-ar');
    }

    // Force a style recalculation
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force a reflow
    document.body.style.display = '';
  }

  async changeLanguage(lang: 'en' | 'ar'): Promise<void> {
    try {
      await this.spinner.show();
      localStorage.setItem('lang', lang);
      await this._TranslateService.use(lang).toPromise();
      this.changeDirection();

      // Add a small delay to ensure styles are applied
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      await this.spinner.hide();
    }
  }
}
