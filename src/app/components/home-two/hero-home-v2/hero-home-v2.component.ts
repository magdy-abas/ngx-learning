import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../core/service/shared.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-home-v2',
  standalone: true,
  imports: [TranslateModule, NgIf, RouterLink],
  templateUrl: './hero-home-v2.component.html',
  styleUrl: './hero-home-v2.component.scss',
})
export class HeroHomeV2Component implements OnInit {
  title1: string | null = null;
  title2: string | null = null;
  title3: string | null = null;
  subtitle: string | null = null;
  cta: string | null = null;

  img1: string | null = null;
  img2: string | null = null;
  img3: string | null = null;
  img4: string | null = null;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.title1 = this.sharedService.getAppAttrValue('hero_section', 'title1');
    this.title2 = this.sharedService.getAppAttrValue('hero_section', 'title2');
    this.title3 = this.sharedService.getAppAttrValue('hero_section', 'for You');
    this.subtitle = this.sharedService.getAppAttrValue(
      'hero_section',
      'subtitle'
    );
    this.cta = this.sharedService.getAppAttrValue('hero_section', 'btn');

    this.img1 =
      this.sharedService
        .getAppAttrByCategory('hero_section')
        .find((attr) => attr.key === 'img1')?.file || null;

    this.img2 =
      this.sharedService
        .getAppAttrByCategory('hero_section')
        .find((attr) => attr.key === 'img2')?.file || null;

    this.img3 =
      this.sharedService
        .getAppAttrByCategory('hero_section')
        .find((attr) => attr.key === 'img3')?.file || null;

    this.img4 =
      this.sharedService
        .getAppAttrByCategory('hero_section')
        .find((attr) => attr.key === 'img4')?.file || null;
  }
}
