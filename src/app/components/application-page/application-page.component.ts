import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SsrService } from '../../core/service/ssr.service';

@Component({
  selector: 'app-application-page',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './application-page.component.html',
  styleUrl: './application-page.component.scss',
})
export class ApplicationPageComponent implements OnInit {
  constructor(private ssr: SsrService) {}

  appData: any;
  tooltipText = 'تواصل معنا';
  whatsappNumber: string | null = null;
  lang: 'en' | 'ar' = 'ar';
  ngOnInit() {
    const storedLang = this.ssr.getLocal('langApp') ?? 'ar';
    this.lang =
      storedLang === 'ar' || storedLang === 'en'
        ? (storedLang as 'ar' | 'en')
        : 'ar';

    this.tooltipText = this.lang === 'ar' ? 'تواصل معنا' : 'Contact us';

    setTimeout(() => {
      const storedData = this.ssr.getLocal('errorData');

      if (storedData) this.appData = JSON.parse(storedData);
      this.whatsappNumber =
        this.appData?.settings?.contact_us?.whatsapp || null;
    }, 500);
  }

  openWhatsApp(): void {
    if (this.whatsappNumber) {
      const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=اهلا`;
      if (this.ssr.isBrowser()) {
        this.ssr.getWindow()?.open(whatsappUrl, '_blank');
      }
    }
  }

  switchLang() {
    this.lang = this.lang === 'ar' ? 'en' : 'ar';
    this.tooltipText = this.lang === 'ar' ? 'تواصل معنا' : 'Contact us';
    this.ssr.setLocal('langApp', this.lang);
  }

  get appName(): string {
    if (!this.appData?.settings?.app_name) {
      return this.lang === 'ar' ? 'التطبيق' : 'app';
    }
    return this.lang === 'ar'
      ? this.appData.settings.app_name.ar || 'التطبيق'
      : this.appData.settings.app_name.en || 'app';
  }
}
