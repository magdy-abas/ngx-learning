import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from './core/service/seo.service';
import { SharedService } from './core/service/shared.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { initSweetAlertTranslations } from './shared/utils/SweetAlert.utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'e-learning';
  tooltipText = 'تواصل معنا';
  whatsappNumber: string = '';
  showWhatsApp: boolean = true;
  constructor(
    private seoService: SeoService,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.spinner.show();

    this.loadSetting();

    initSweetAlertTranslations(this.translate);

    this.seoService.updateMeta(
      'ELearning - Enhance Your Skills Online',
      'Explore our eLearning platform to enhance your skills with a wide variety of courses designed for learners at every level.',
      'eLearning, online learning, online courses, skill enhancement, education',
      'https:.com/og-image.jpg'
    );
  }

  openWhatsApp(): void {
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=اهلا`;
    window.open(whatsappUrl, '_blank');
  }

  applySettings(settingsData: any): void {
    if (settingsData.contact_us && settingsData.contact_us.whatsapp) {
      this.whatsappNumber = settingsData.contact_us.whatsapp;
    }
  }

  loadSetting() {
    this.sharedService.settings().subscribe({
      next: (response) => {
        if (response.success) {
          console.log(response);
          this.sharedService.saveSettingsToLocalStorage(response);

          this.applySettings(response.data);
          if (response.data.icon) {
            this.setFavicon(response.data.icon);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching settings:', err);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },
    });
  }

  setFavicon(iconUrl: string) {
    document
      .querySelectorAll("link[rel~='icon']")
      .forEach((link) => link.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = iconUrl + '?v=' + new Date().getTime();
    document.head.appendChild(link);
  }
}
