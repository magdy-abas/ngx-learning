import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-best-selling-home-v2',
  standalone: true,
  imports: [TranslateModule, CarouselModule],
  templateUrl: './best-selling-home-v2.component.html',
  styleUrl: './best-selling-home-v2.component.scss',
})
export class BestSellingHomeV2Component {
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
      1200: { items: 3 },
    },
  };
}
