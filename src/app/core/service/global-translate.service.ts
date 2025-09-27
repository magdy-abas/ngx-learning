import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, catchError, firstValueFrom, retry } from 'rxjs';
import { SsrService } from './ssr.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GlobalTranslateService {
  private renderer: Renderer2;
  public language$: BehaviorSubject<'ar' | 'en'>;

  constructor(
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private rendererFactory: RendererFactory2,
    private ssr: SsrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    const storedLang = this.ssr.getLocal('lang') as 'ar' | 'en' | null;
    const savedLang: 'ar' | 'en' = storedLang === 'en' ? 'en' : 'ar';

    this.language$ = new BehaviorSubject<'ar' | 'en'>(savedLang);
    this.translateService.setDefaultLang('ar');
    this.initializeLanguage();
  }

  initializeLanguage(): Promise<void> {
    const lang = this.language$.value;

    this.translateService.setDefaultLang('ar');

    return firstValueFrom(
      this.translateService.use(lang || 'ar').pipe(
        retry(2),
        catchError(() => this.translateService.use('ar'))
      )
    ).then(() => {
      this.updateDocumentDirection(lang || 'ar');
    });
  }

  private updateDocumentDirection(lang: 'ar' | 'en'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const htmlElement = document.documentElement;
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

  async changeLanguage(lang: 'en' | 'ar'): Promise<void> {
    try {
      if (isPlatformBrowser(this.platformId)) {
        await this.spinner.show();
      }

      this.ssr.setLocal('lang', lang);

      await this.translateService.use(lang).toPromise();
      this.language$.next(lang);

      if (isPlatformBrowser(this.platformId)) {
        this.updateDocumentDirection(lang);
        await this.spinner.hide();

        // بس اعمل reload في المتصفح فقط
        window.location.reload();
      }
    } catch {
      if (isPlatformBrowser(this.platformId)) {
        await this.spinner.hide();
      }
    }
  }
}
