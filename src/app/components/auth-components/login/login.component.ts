import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router, RouterLink } from '@angular/router';
import {
  DataService,
  Mainlogin,
  welcomeLogin,
} from './../../../core/service/data/data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
import { routes } from '../../../core/service/routes/routes';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { AlertErrorComponent } from '../../../shared/ui/alert-error/alert-error.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginDto } from '../../../shared/Dtos/AuthDtos';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CarouselModule,
    CommonModule,
    FeatherIconModule,
    RouterLink,
    ReactiveFormsModule,
    AlertErrorComponent,
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginDto: LoginDto = new LoginDto();
  public routes = routes;
  password = 'password';
  show = true;
  msgError: string = '';
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

  constructor(
    private DataService: DataService,
    public _Router: Router,
    private _AuthService: AuthService,
    private _FormBuilder: FormBuilder
  ) {
    this.welcomeLogin = this.DataService.welcomeLogin;
  }

  loginForm: FormGroup = this._FormBuilder.group(
    {
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern('^(?=.*[A-Z]).{6,}$'), ,],
      ],
    },
    {}
  );

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = false;
    } else {
      this.password = 'password';
      this.show = true;
    }
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(!field?.errors && (field?.dirty || field?.touched));
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.errors && (field?.dirty || field?.touched));
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loginDto.email = this.loginForm.get('email')?.value;
      this.loginDto.password = this.loginForm.get('password')?.value;
      this.loginDto.token = '123';
      this.loginDto.serial_number = '1234';
      this.loginDto.os = 'desktop';

      console.log(this.loginDto);

      this._AuthService.login(this.loginDto).subscribe({
        next: (res) => {
          if (res.status === 1) {
            console.log(res);
            this._Router.navigate(['/auth/home']);
          } else {
            this.msgError = res.message;
            console.log(res);
            if (res.message.includes('email')) {
              this.loginForm
                .get('email')
                ?.setErrors({ serverError: res.data.email[0] });
            } else {
              this.loginForm
                .get('password')
                ?.setErrors({ serverError: res.data.password[0] });
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.message;

          console.log(err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
