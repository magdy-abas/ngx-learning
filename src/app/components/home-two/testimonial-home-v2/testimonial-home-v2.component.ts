import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonial-home-v2',
  standalone: true,
  imports: [TranslateModule, CarouselModule],
  templateUrl: './testimonial-home-v2.component.html',
  styleUrl: './testimonial-home-v2.component.scss',
})
export class TestimonialHomeV2Component {
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
}
