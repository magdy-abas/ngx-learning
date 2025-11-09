import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SharedService } from '../../../core/service/shared.service';
import { Subscription } from 'rxjs';
import { DynamicHomeService } from '../../../core/service/dynamic-home.service';
import { FooterService } from '../../../core/service/footer.service';
import {
  PageItem,
  PagesListResponse,
} from '../../../core/interfaces/footer.interface';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-home-v2',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, TranslateModule],
  templateUrl: './footer-home-v2.component.html',
  styleUrl: './footer-home-v2.component.scss',
})
export class FooterHomeV2Component implements OnInit, OnDestroy {
  footerLogo: string | null = null;
  footerContactTitle: string | null = null;
  footerPhoneLabel: string | null = null;
  footerWhatsappLabel: string | null = null;
  bottomFooter: string | null = null;

  contactNumber: string | null = null;
  whatsappNumber: string | null = null;
  pages: PageItem[] = [];

  private subscription?: Subscription;

  constructor(
    private DynamicHomeService: DynamicHomeService,
    private SharedService: SharedService,
    private footerService: FooterService
  ) {}

  ngOnInit(): void {
    this.subscription = this.DynamicHomeService.appAttrs$.subscribe((attrs) => {
      if (attrs.length > 0) {
        this.loadFooterData();
      }
    });
  }

  private loadFooterData(): void {
    const footerAttrs = this.DynamicHomeService.getAppAttrByCategory('footer');
    const contactAttrs =
      this.DynamicHomeService.getAppAttrByCategory('contact');
    const bottomFooterAttrs =
      this.DynamicHomeService.getAppAttrByCategory('bottom_footer');

    this.footerLogo =
      footerAttrs.find((attr) => attr.key === 'big_logo')?.file || null;

    this.footerContactTitle =
      footerAttrs.find((attr) => attr.key === 'contact')?.value || null;
    this.footerPhoneLabel =
      footerAttrs.find((attr) => attr.key === 'phone')?.value || null;
    this.footerWhatsappLabel =
      contactAttrs.find((attr) => attr.key === 'whatsapp')?.value || null;

    this.contactNumber =
      this.SharedService.getSettings()?.data?.contact_us?.call_number || null;
    this.whatsappNumber =
      this.SharedService.getSettings()?.data?.contact_us?.whatsapp || null;

    this.bottomFooter =
      bottomFooterAttrs.find((attr) => attr.key === 'Rights')?.value || null;

    this.loadPages();
  }
  private loadPages(): void {
    this.footerService.getPagesList().subscribe((res) => {
      this.pages = res.data || null;

      console.log('Footer Pages:', res);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
