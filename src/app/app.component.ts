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

  constructor(
    private seoService: SeoService,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Initialize SweetAlert translations
    initSweetAlertTranslations(this.translate);

    // Show spinner immediately
    this.spinner.show();

    // Update SEO meta tags
    this.seoService.updateMeta(
      'ELearning - Enhance Your Skills Online',
      'Explore our eLearning platform to enhance your skills with a wide variety of courses designed for learners at every level.',
      'eLearning, online learning, online courses, skill enhancement, education',
      'https://yourwebsite.com/og-image.jpg'
    );

    this.sharedService.initialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    });
  }
}
