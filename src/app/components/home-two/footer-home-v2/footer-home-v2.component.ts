import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SharedService } from '../../../core/service/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer-home-v2',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './footer-home-v2.component.html',
  styleUrl: './footer-home-v2.component.scss',
})
export class FooterHomeV2Component implements OnInit, OnDestroy {
  footerLogo: string | null = null;
  footerLinks: string[] = [];
  footerContactTitle: string | null = null;
  footerPhoneLabel: string | null = null;
  footerWhatsappLabel: string | null = null;
  bottomFooter: string | null = null;

  contactNumber: string | null = null;
  whatsappNumber: string | null = null;

  private subscription?: Subscription;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.subscription = this.sharedService.appAttrs$.subscribe((attrs) => {
      if (attrs.length > 0) {
        this.loadFooterData();
      }
    });
  }

  private loadFooterData(): void {
    const footerAttrs = this.sharedService.getAppAttrByCategory('footer');
    const contactAttrs = this.sharedService.getAppAttrByCategory('contact');
    const bottomFooterAttrs =
      this.sharedService.getAppAttrByCategory('bottom_footer');

    this.footerLogo =
      footerAttrs.find((attr) => attr.key === 'big_logo')?.file || null;

    this.footerLinks = footerAttrs
      .filter((attr) => attr.key === 'links')
      .map((attr) => attr.value);

    this.footerContactTitle =
      footerAttrs.find((attr) => attr.key === 'contact')?.value || null;
    this.footerPhoneLabel =
      footerAttrs.find((attr) => attr.key === 'phone')?.value || null;
    this.footerWhatsappLabel =
      contactAttrs.find((attr) => attr.key === 'whatsapp')?.value || null;

    this.contactNumber =
      this.sharedService.getSettings()?.data?.contact_us?.call_number || null;
    this.whatsappNumber =
      this.sharedService.getSettings()?.data?.contact_us?.whatsapp || null;

    this.bottomFooter =
      bottomFooterAttrs.find((attr) => attr.key === 'Rights')?.value || null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
