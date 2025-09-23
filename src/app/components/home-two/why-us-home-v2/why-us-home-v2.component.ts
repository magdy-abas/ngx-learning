import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../core/service/shared.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-why-us-home-v2',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './why-us-home-v2.component.html',
  styleUrl: './why-us-home-v2.component.scss',
})
export class WhyUsHomeV2Component implements OnInit {
  kicker: string | null = null;
  title: string | null = null;
  text: string | null = null;
  cta: string | null = null;

  feature1Title: string | null = null;
  feature1Text: string | null = null;

  feature2Title: string | null = null;
  feature2Text: string | null = null;

  feature3Title: string | null = null;
  feature3Text: string | null = null;

  feature4Title: string | null = null;
  feature4Text: string | null = null;
  feature1Icon: string | null = null;
  feature2Icon: string | null = null;
  feature3Icon: string | null = null;
  feature4Icon: string | null = null;
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.kicker = this.sharedService.getAppAttrValue('why_us', 'kicker_title');
    this.title = this.sharedService.getAppAttrValue('why_us', 'title');
    this.text = this.sharedService.getAppAttrValue('why_us', 'text');
    this.cta = this.sharedService.getAppAttrValue('why_us', 'btn');

    this.feature1Title = this.sharedService.getAppAttrValue(
      'why_us',
      'feature1_title'
    );
    this.feature1Text = this.sharedService.getAppAttrValue(
      'why_us',
      'feature1_text'
    );

    this.feature2Title = this.sharedService.getAppAttrValue(
      'why_us',
      'feature2_title'
    );
    this.feature2Text = this.sharedService.getAppAttrValue(
      'why_us',
      'feature2_text'
    );

    this.feature3Title = this.sharedService.getAppAttrValue(
      'why_us',
      'feature3_title'
    );
    this.feature3Text = this.sharedService.getAppAttrValue(
      'why_us',
      'feature3_text'
    );

    this.feature4Title = this.sharedService.getAppAttrValue(
      'why_us',
      'feature4_title'
    );
    this.feature4Text = this.sharedService.getAppAttrValue(
      'why_us',
      'feature4_text'
    );

    this.feature1Icon =
      this.sharedService
        .getAppAttrByCategory('why_us')
        .find((attr) => attr.key === 'icon1')?.file || null;

    this.feature2Icon =
      this.sharedService
        .getAppAttrByCategory('why_us')
        .find((attr) => attr.key === 'icon2')?.file || null;

    this.feature3Icon =
      this.sharedService
        .getAppAttrByCategory('why_us')
        .find((attr) => attr.key === 'icon3')?.file || null;

    this.feature4Icon =
      this.sharedService
        .getAppAttrByCategory('why_us')
        .find((attr) => attr.key === 'icon4')?.file || null;
  }
}
