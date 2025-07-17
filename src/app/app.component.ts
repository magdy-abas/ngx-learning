import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from './core/service/shared.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { initSweetAlertTranslations } from './shared/utils/SweetAlert.utils';
import { AppAccessService } from './core/service/app-access.service';
import { setupDynamicRoutes } from './shared/utils/router.utils';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'e-learning';

  private router = inject(Router);
  private appAccessService = inject(AppAccessService);

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
      } else {
        console.warn('Settings were invalid. Using fallback settings.');
      }

      this.spinner.hide();
    });

    initSweetAlertTranslations(this.translate);

    setupDynamicRoutes(this.router, this.appAccessService);
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
