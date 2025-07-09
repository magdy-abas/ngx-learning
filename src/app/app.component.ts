import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from './core/service/shared.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { initSweetAlertTranslations } from './shared/utils/SweetAlert.utils';
import { LayoutSelectorComponent } from './layouts/layout-selector/layout-selector.component';

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
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.spinner.show();

    this.sharedService.loadSettings().then(() => {
      const settings = this.sharedService.getSettings();

      if (settings?.data) {
        this.setFavicon(settings.data.icon ?? 'assets/default-favicon.png');
        this.applySettings(settings.data);
      } else {
        console.warn('Settings were invalid. Using fallback settings.');
      }

      this.spinner.hide();
    });

    initSweetAlertTranslations(this.translate);
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
