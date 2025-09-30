import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../core/service/shared.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-home-v2',
  standalone: true,
  imports: [TranslateModule, NgIf, RouterLink],
  templateUrl: './hero-home-v2.component.html',
  styleUrl: './hero-home-v2.component.scss',
})
export class HeroHomeV2Component implements OnInit, OnDestroy {
  title1: string | null = null;
  title2: string | null = null;
  title3: string | null = null;
  subtitle: string | null = null;
  cta: string | null = null;

  img1: string | null = null;
  img2: string | null = null;
  img3: string | null = null;
  img4: string | null = null;

  private subscription?: Subscription;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.subscription = this.sharedService.appAttrs$.subscribe((attrs) => {
      if (attrs.length > 0) {
        this.loadHeroData();
      }
    });
  }

  private loadHeroData(): void {
    this.title1 = this.sharedService.getAppAttrValue('hero_section', 'title1');
    this.title2 = this.sharedService.getAppAttrValue('hero_section', 'title2');
    this.title3 = this.sharedService.getAppAttrValue('hero_section', 'for You');
    this.subtitle = this.sharedService.getAppAttrValue(
      'hero_section',
      'subtitle'
    );
    this.cta = this.sharedService.getAppAttrValue('hero_section', 'btn');

    const heroAttrs = this.sharedService.getAppAttrByCategory('hero_section');
    this.img1 = heroAttrs.find((attr) => attr.key === 'img1')?.file || null;
    this.img2 = heroAttrs.find((attr) => attr.key === 'img2')?.file || null;
    this.img3 = heroAttrs.find((attr) => attr.key === 'img3')?.file || null;
    this.img4 = heroAttrs.find((attr) => attr.key === 'img4')?.file || null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
