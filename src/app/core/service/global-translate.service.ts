import {
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, catchError, firstValueFrom, retry } from 'rxjs';
import { SsrService } from './ssr.service';
import { SharedService } from './shared.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GlobalTranslateService {
  private renderer: Renderer2;
  public language$ = new BehaviorSubject<'ar' | 'en'>('ar');
  private sharedService = inject(SharedService);
  private platformId = inject(PLATFORM_ID);

  constructor(
    private translateService: TranslateService,
    private rendererFactory: RendererFactory2,
    private ssr: SsrService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    const storedLang = (this.ssr.getLocal('lang') as 'ar' | 'en') || 'ar';
    this.language$.next(storedLang);

    this.translateService.setDefaultLang('ar');
  }

  async initializeLanguage(lang?: 'ar' | 'en'): Promise<void> {
    const targetLang = lang || this.language$.value || 'ar';
    await this.applyLanguage(targetLang);
  }

  async changeLanguage(lang: 'ar' | 'en'): Promise<void> {
    if (this.language$.value === lang) return;

    await this.applyLanguage(lang);
  }

  private async applyLanguage(lang: 'ar' | 'en'): Promise<void> {
    this.ssr.setLocal('lang', lang);

    // ✅ هنا نضيف سطر لتخزين اللغة في الكوكيز عشان السيرفر يشوفها
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `lang=${lang}; path=/; SameSite=None; Secure`;
    }

    this.updateDocumentDirection(lang);

    await firstValueFrom(
      this.translateService.use(lang).pipe(
        retry(2),
        catchError(() => this.translateService.use('ar'))
      )
    );

    if (isPlatformBrowser(this.platformId)) {
      await firstValueFrom(this.sharedService.setLang(lang));
    }

    this.language$.next(lang);
  }

  private updateDocumentDirection(lang: 'ar' | 'en'): void {
    const htmlElement = this.ssr.getDocument()?.documentElement;
    if (!htmlElement) return;

    htmlElement.classList.remove('lang-ar', 'lang-en');

    if (lang === 'en') {
      this.renderer.setAttribute(htmlElement, 'dir', 'ltr');
      this.renderer.setAttribute(htmlElement, 'lang', 'en');
      htmlElement.classList.add('lang-en');
    } else {
      this.renderer.setAttribute(htmlElement, 'dir', 'rtl');
      this.renderer.setAttribute(htmlElement, 'lang', 'ar');
      htmlElement.classList.add('lang-ar');
    }
  }
}
