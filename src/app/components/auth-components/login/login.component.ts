import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router, RouterLink } from '@angular/router';
import {
  DataService,
  welcomeLogin,
} from './../../../core/service/data/data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
import { routes } from '../../../core/service/routes/routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CarouselModule, CommonModule, FeatherIconModule, RouterLink],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public routes = routes;
  password = 'password';
  show = true;

  public welcomeLogin: welcomeLogin[] = [];

  public welcomeLoginOwlOptions: OwlOptions = {
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
    this.welcomeLogin = this.DataService.welcomeLogin;
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = false;
    } else {
      this.password = 'password';
      this.show = true;
    }
  }
  directIndex() {
    this.router.navigate(['/instructor/instructor-dashboard']);
  }
}
