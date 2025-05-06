import { Component, Input } from '@angular/core';

import { routes } from '../../../../core/service/routes/routes';
import { DataService } from '../../../../core/service/data/data.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import Aos from 'aos';
import {
  IHomeSection,
  ISlider,
} from '../../../../core/Dtos/dynamic-home.models';
import { Slider } from '../../../../core/Dtos/dynamic-home.models';
interface data {
  active?: boolean;
}
@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.scss',
})
export class HomeSliderComponent {
  ngOnInit(): void {
    console.log(this.sliderData);
  }
  public routes = routes;
  @Input() sliderData: Slider[] = [];
  @Input() sliderTitle: string = '';
  @Input() sliderShortTitle: string = '';
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    rtl: true,
    dots: true,
    navSpeed: 700,
    items: 1,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: false,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
    },
    dotsData: true,
  };
}
