import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';
import {
  DataService,
  Mainregister,
  passwordResponce,
  register,
} from '../../../core/service/data/data.service';
import { routes } from '../../../core/service/routes/routes';
import { RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    CarouselModule,
    FormsModule,
    RouterLink,
    FeatherIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public routes = routes;
  public registerForm: Mainregister = {
    img: undefined,
    content1: undefined,
    content2: undefined,
    paragraph: undefined,
    password: undefined,
  };
  public passwordResponce: passwordResponce = {};

  public register: register[] = [];

  password = 'password';
  show = true;

  public registerOwlOptions: OwlOptions = {
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

  constructor(private DataService: DataService) {
    this.register = this.DataService.register;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onChangePassword(password: any) {
    if (password.match(/^$|\s+/)) {
      this.passwordResponce.passwordResponceText =
        'whitespaces are not allowed';
      this.passwordResponce.passwordResponceImage = '';
      this.passwordResponce.passwordResponceKey = '';
      return;
    }
    if (password.length == 0) {
      this.passwordResponce.passwordResponceText = '';
      this.passwordResponce.passwordResponceImage = '';
      this.passwordResponce.passwordResponceKey = '';
      return;
    }
    if (password.length < 8) {
      this.passwordResponce.passwordResponceText =
        'Weak. Must contain at least 8 characters';
      this.passwordResponce.passwordResponceImage = 'assets/img/icon/angry.svg';
      this.passwordResponce.passwordResponceKey = '0';
    } else if (password.search(/[a-z]/) < 0) {
      this.passwordResponce.passwordResponceText =
        'Average. Must contain at least 1 upper case and number';
      this.passwordResponce.passwordResponceImage =
        'assets/img/icon/anguish.svg';
      this.passwordResponce.passwordResponceKey = '1';
    } else if (password.search(/[A-Z]/) < 0) {
      this.passwordResponce.passwordResponceText =
        'Average. Must contain at least 1 upper case and number';
      this.passwordResponce.passwordResponceImage =
        'assets/img/icon/anguish.svg';
      this.passwordResponce.passwordResponceKey = '1';
    } else if (password.search(/[0-9]/) < 0) {
      this.passwordResponce.passwordResponceText =
        'Average. Must contain at least 1 upper case and number';
      this.passwordResponce.passwordResponceImage =
        'assets/img/icon/anguish.svg';
      this.passwordResponce.passwordResponceKey = '1';
    } else if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
      this.passwordResponce.passwordResponceText =
        'Almost. Must contain special symbol';
      this.passwordResponce.passwordResponceImage = 'assets/img/icon/smile.svg';
      this.passwordResponce.passwordResponceKey = '2';
    } else {
      this.passwordResponce.passwordResponceText =
        'Awesome! You have a secure password.';
      this.passwordResponce.passwordResponceImage = 'assets/img/icon/smile.svg';
      this.passwordResponce.passwordResponceKey = '3';
    }
  }
}
