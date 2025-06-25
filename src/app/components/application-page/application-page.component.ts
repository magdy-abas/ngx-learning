import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-page',
  standalone: true,
  imports: [NgIf, NgStyle, NgClass],
  templateUrl: './application-page.component.html',
  styleUrl: './application-page.component.scss',
})
export class ApplicationPageComponent implements OnInit {
  appData: any;
  tooltipText = 'تواصل معنا';
  whatsappNumber: string | null = null;
  lang: 'en' | 'ar' = 'ar';
  ngOnInit() {
    const storedLang = localStorage.getItem('langApp');
    this.lang =
      storedLang === 'ar' || storedLang === 'en'
        ? (storedLang as 'ar' | 'en')
        : 'ar';

    this.tooltipText = this.lang === 'ar' ? 'تواصل معنا' : 'Contact us';

    setTimeout(() => {
      const storedData = localStorage.getItem('errorData');
      console.log(storedData);

      if (storedData) this.appData = JSON.parse(storedData);
      this.whatsappNumber =
        this.appData?.settings?.contact_us?.whatsapp || null;
    }, 500);
  }

  openWhatsApp(): void {
    if (this.whatsappNumber) {
      const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=اهلا`;
      window.open(whatsappUrl, '_blank');
    }
  }

  switchLang() {
    this.lang = this.lang === 'ar' ? 'en' : 'ar';
    this.tooltipText = this.lang === 'ar' ? 'تواصل معنا' : 'Contact us';
    localStorage.setItem('langApp', this.lang);
  }

  get appName(): string {
    if (!this.appData?.settings?.app_name) {
      return this.lang === 'ar' ? 'توتال' : 'Total';
    }
    return this.lang === 'ar'
      ? this.appData.settings.app_name.ar || 'فريدة'
      : this.appData.settings.app_name.en || 'Farida';
  }
}
