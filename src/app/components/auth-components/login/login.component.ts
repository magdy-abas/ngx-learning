import { Component, OnInit } from '@angular/core';
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
import {
  LoginDto,
  SendOtpDto,
  WatsLoginDto,
} from '../../../core/Dtos/AuthDtos';
import { TranslateModule } from '@ngx-translate/core';
import {
  AuthResponse,
  ErrorAuthData,
} from '../../../core/interfaces/auth.interface';
import { PhoneInputComponent } from '../../../shared/ui/phone-input/phone-input.component';
import { CodeInputModule } from 'angular-code-input';

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
    TranslateModule,
    PhoneInputComponent,

    CodeInputModule,
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  watsStep: number = 1;
  loginWithWats: boolean = false;
  loading: boolean = false;
  SendOtpDto: SendOtpDto = new SendOtpDto();
  loginDto: LoginDto = new LoginDto();
  watsLoginDto: WatsLoginDto = new WatsLoginDto();
  public routes = routes;
  password = 'password';
  show = true;
  msgError: string = '';
  public welcomeLogin: welcomeLogin[] = [];

  public welcomeLoginOwlOptions: OwlOptions = {
    margin: 25,
    nav: true,
    loop: true,
    rtl: true,
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

  ngOnInit(): void {
    this._AuthService.checkLoginMethod().subscribe({
      next: (res) => {
        console.log(res);

        if (res.status === 1) {
          this.loading = true;
          if (res.data.settings.auth_login_with === 'mobile_whatsapp') {
            this.loginWithWats = true;
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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
  loginWatsForm: FormGroup = this._FormBuilder.group(
    {
      phone: [null],
    },
    {}
  );
  sendCode: FormGroup = this._FormBuilder.group(
    {
      code: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
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
      this.loginDto.email = this.loginForm.get('email')?.value || '';
      this.loginDto.password = this.loginForm.get('password')?.value || '';
      this.loginDto.token = '123';
      this.loginDto.serial_number = '1234';
      this.loginDto.os = 'desktop';

      this._AuthService.login(this.loginDto).subscribe({
        next: (res: AuthResponse) => {
          console.log(res);

          if (res.status === 1) {
            this._AuthService.saveToken(res.data.token);
            this._AuthService.saveUserData(res.data.user);
            console.log(res);
            this._Router.navigate(['/auth']);
          } else {
            const errorData = res.data as ErrorAuthData;
            this.msgError = res.message;
            console.log(res);

            // Set email error if present
            if (errorData.email?.length) {
              this.loginForm
                .get('email')
                ?.setErrors({ serverError: errorData.email[0] });
            }
            // Set password error if present
            if (errorData.password?.length) {
              this.loginForm
                .get('password')
                ?.setErrors({ serverError: errorData.password[0] });
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

  onSubmitWats() {
    if (this.loginWatsForm.invalid) {
      this.loginWatsForm.markAllAsTouched();
      return;
    }
    console.log(this.loginWatsForm.value);

    const dialCode = this.loginWatsForm.get('phone')?.value.dialCode;
    this.SendOtpDto.phone_code = dialCode ? dialCode.replace('+', '') : '';
    this.SendOtpDto.mobile = this.loginWatsForm.get('phone')?.value.number;
    if (this.SendOtpDto.mobile && this.SendOtpDto.phone_code) {
      localStorage.setItem('phone_code', this.SendOtpDto?.phone_code);
      localStorage.setItem('mobile', this.SendOtpDto?.mobile);
    }

    this._AuthService.sendOtpCode(this.SendOtpDto).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 1) {
          this.watsStep = 2;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loginWithWatsApp() {
    this.watsLoginDto.otp = this.sendCode.get('code')?.value;
    this.watsLoginDto.mobile = localStorage.getItem('mobile') || '';
    this.watsLoginDto.phone_code = localStorage.getItem('phone_code') || '';
    this._AuthService.watsLogin(this.watsLoginDto).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 1) {
          this._AuthService.saveToken(res.data.token);
          this._AuthService.saveUserData(res.data.user);
          this._Router.navigate(['/auth']);
        } else {
          console.log(res);
        }
      },
    });
  }
  public onCodeCompleted(code: string): void {
    this.sendCode.patchValue({ code });
    console.log(this.sendCode.value);
  }
}
