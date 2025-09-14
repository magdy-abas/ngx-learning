import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss',
})
export class HomeTwoComponent {
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
