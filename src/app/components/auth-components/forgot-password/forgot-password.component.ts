import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {
  DataService,
  forgotPassword,
} from '../../../core/service/data/data.service';
import { Router, RouterLink } from '@angular/router';
import Aos from 'aos';
import { routes } from '../../../core/service/routes/routes';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CarouselModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  public routes = routes;
  public forgotPassword: forgotPassword[] = [];

  public forgotPasswordOwlOptions: OwlOptions = {
    margin: 25,
    nav: true,
    loop: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 3,
      },
      1170: {
        items: 4,
      },
    },
  };

  constructor(private DataService: DataService, public router: Router) {
    this.forgotPassword = this.DataService.forgotPassword;
  }

  ngOnInit() {
    Aos.init();
  }
  directLogin() {
    this.router.navigate(['/auth/login']);
  }
}
