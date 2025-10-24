import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedService } from '../../../core/service/shared.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { DynamicHomeService } from '../../../core/service/dynamic-home.service';

interface Avatar {
  file: string;
  position: string;
}

interface Testimonial {
  text: string;
  main: string | null;
  avatars: Avatar[];
}

@Component({
  selector: 'app-testimonial-home-v2',
  standalone: true,
  imports: [TranslateModule, CarouselModule, NgIf, NgFor, NgClass],
  templateUrl: './testimonial-home-v2.component.html',
  styleUrl: './testimonial-home-v2.component.scss',
})
export class TestimonialHomeV2Component implements OnInit, OnDestroy {
  kicker: string | null = null;
  title: string | null = null;
  testimonials: Testimonial[] = [];

  private subscription?: Subscription;

  customOptionsTsSlider = {
    loop: true,
    rtl: true,
    items: 1,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 800,
    dots: false,
    nav: false,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1200: { items: 1 },
    },
  };

  constructor(private DynamicHomeService: DynamicHomeService) {}

  ngOnInit(): void {
    this.subscription = this.DynamicHomeService.appAttrs$.subscribe((attrs) => {
      if (attrs.length > 0) {
        this.loadTestimonialData();
      }
    });
  }

  private loadTestimonialData(): void {
    this.kicker = this.DynamicHomeService.getAppAttrValue(
      'testimonials',
      'kicker_title'
    );
    this.title = this.DynamicHomeService.getAppAttrValue(
      'testimonials',
      'title'
    );

    this.testimonials = [];

    [1, 2, 3].forEach((i) => {
      const text = this.DynamicHomeService.getAppAttrValue(
        'testimonials',
        `quote${i}`
      );

      if (text) {
        // main avatar
        const main =
          this.DynamicHomeService.getAppAttrByCategory('testimonials').find(
            (attr) => attr.key === `quote${i}_main1`
          )?.file || null;

        // floating avatars
        const avatars = this.DynamicHomeService.getAppAttrByCategory(
          'testimonials'
        )
          .filter((attr) => attr.key.startsWith(`quote${i}_avatar`))
          .map((attr) => {
            let position = '';
            if (attr.key.endsWith('2')) position = 'left top';
            if (attr.key.endsWith('3')) position = 'left bottom';
            if (attr.key.endsWith('4')) position = 'right top';
            if (attr.key.endsWith('5')) position = 'right bottom';
            return { file: attr.file, position };
          });

        this.testimonials.push({ text, main, avatars });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
