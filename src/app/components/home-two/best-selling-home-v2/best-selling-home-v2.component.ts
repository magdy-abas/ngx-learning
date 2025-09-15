import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { IDoctor } from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-best-selling-home-v2',
  standalone: true,
  imports: [TranslateModule, CarouselModule, NgFor],
  templateUrl: './best-selling-home-v2.component.html',
  styleUrl: './best-selling-home-v2.component.scss',
})
export class BestSellingHomeV2Component {
  @Input() doctors: IDoctor[] = [];
  customOptionsCrSlider = {
    loop: true,
    margin: 20,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 800,
    dots: false,
    nav: false,
    responsive: {
      0: { items: 1 },
      768: { items: 3 },
    },
  };
}
