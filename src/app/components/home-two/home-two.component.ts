import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import Aos from 'aos';
import { CountUp } from 'countup.js';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [CarouselModule, TranslateModule],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss',
})
export class HomeTwoComponent implements AfterViewInit, OnInit {
  ngOnInit(): void {
    Aos.init({
      offset: 20,
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
    });
  }

  ngAfterViewInit(): void {
    const counters = [
      { id: 'stat-courses', endVal: 50 },
      { id: 'stat-students', endVal: 2000 },
      { id: 'stat-teachers', endVal: 150 },
      { id: 'stat-fields', endVal: 10 },
    ];

    const options = { duration: 2 };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.id;
            const counter = counters.find((c) => c.id === targetId);
            if (counter) {
              new CountUp(counter.id, counter.endVal, options).start();
              obs.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) {
        observer.observe(el);
      }
    });
  }

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
