import { Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router, RouterLink } from '@angular/router';
import {
  DataService,
  Lang,
  WelcomeSlideView,
} from './../../../core/service/data/data.service';
import { CommonModule } from '@angular/common';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';

import {
  FormBuilder,
  FormControl,
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AuthResponse,
  ErrorAuthData,
} from '../../../core/interfaces/auth.interface';
import { PhoneInputComponent } from '../../../shared/ui/phone-input/phone-input.component';

import { OtpInputComponent } from '../../../shared/ui/otp-code-input/otp-code-input.component';
import { DarkModeService } from '../../../core/service/dark-mode.service';
import { SharedService } from '../../../core/service/shared.service';
import { filter, Subscription, take } from 'rxjs';

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
    OtpInputComponent,
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private settingsSub?: Subscription;

  watsStep: number = 1;
  loginWithWats: boolean = false;
  loading: boolean = false;
  SendOtpDto: SendOtpDto = new SendOtpDto();
  loginDto: LoginDto = new LoginDto();
  watsLoginDto: WatsLoginDto = new WatsLoginDto();

  password = 'password';
  show = true;
  msgError: string = '';

  public logoUrl: string = '';
  public appName: string = '';
  public welcomeLogin: WelcomeSlideView[] = [];

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
    private _FormBuilder: FormBuilder,
    private darkModeService: DarkModeService,
    private translate: TranslateService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.translate.get('phone_input.labels').subscribe((labels) => {});
    this.darkModeService.applyMode();
    this.sharedService.initialized$.pipe(take(1)).subscribe((initialized) => {
      if (initialized) {
        const method = this.sharedService.getLoginMethod();

        this.loginWithWats = method === 'mobile_whatsapp';
      }
    });
    this.settingsSub = this.sharedService.settings$.subscribe((settings) => {
      if (settings?.data) {
        this.logoUrl = this.darkModeService.getLogo(settings);

        const lang = (this.translate.currentLang || 'en') as Lang;
        this.appName = settings.data.app_name?.[lang] || 'App Name';

        this.welcomeLogin = this.DataService.getWelcomeSlides(
          this.appName,
          lang
        );
      }
    });
  }
  get phoneControl(): FormControl {
    return this.loginWatsForm.get('phone') as FormControl;
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
  loginWatsForm: FormGroup = this._FormBuilder.group({
    phone: new FormControl(null),
  });

  sendCode: FormGroup = this._FormBuilder.group(
    {
      code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
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
          if (res.status === 1) {
            this._AuthService.saveToken(res.data.token);
            this._AuthService.saveUserData(res.data.user);

            this._Router.navigate(['/']);
          } else {
            const errorData = res.data as ErrorAuthData;
            this.msgError = res.message;

            if (errorData.email?.length) {
              this.loginForm
                .get('email')
                ?.setErrors({ serverError: errorData.email[0] });
            }

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
    const control = this.phoneControl;

    if (control.invalid) {
      control.markAsTouched();
      return;
    }

    const rawValue = control.value as string;

    const dialCodeMatch = rawValue.match(/^\+(\d{1,4})/);
    const dialCode = dialCodeMatch ? dialCodeMatch[1] : '';
    const mobileNumber = rawValue
      .replace(/^\+\d{1,4}/, '')
      .trim()
      .replace(/\s+/g, '');

    if (!dialCode || !mobileNumber) {
      control.setErrors({ invalid: true });
      return;
    }

    this.SendOtpDto.phone_code = dialCode;
    this.SendOtpDto.mobile = mobileNumber;

    localStorage.setItem('phone_code', dialCode);
    localStorage.setItem('mobile', mobileNumber);

    this._AuthService.sendOtpCode(this.SendOtpDto).subscribe({
      next: (res) => {
        if (res.status === 1) {
          this.watsStep = 2;
        }
      },
      error: (err) => {
        console.error('Send OTP Error:', err);
      },
    });
  }

  onResendCode() {
    this.onSubmitWats();
  }

  loginWithWatsApp() {
    const code = this.sendCode.get('code')?.value;

    if (this.sendCode.invalid) {
      this.sendCode.markAllAsTouched();
      return;
    }

    this.watsLoginDto.otp = code;
    this.watsLoginDto.mobile = localStorage.getItem('mobile') || '';
    this.watsLoginDto.phone_code = localStorage.getItem('phone_code') || '';

    this._AuthService.watsLogin(this.watsLoginDto).subscribe({
      next: (res) => {
        if (res.status === 1) {
          this._AuthService.saveToken(res.data.token);
          this._AuthService.saveUserData(res.data.user);
          this._Router.navigate(['/']);
        } else {
          if (
            res.status === 0 &&
            (res.message.includes('كود التاكيد') ||
              res.message.includes('Invalid OTP'))
          ) {
            const codeControl = this.sendCode.get('code');
            codeControl?.setErrors({ serverMessage: res.message });
            codeControl?.markAsTouched();
          }
        }
      },
    });
  }

  public onCodeCompleted(code: string): void {
    this.sendCode.get('code')?.setValue(code);
    this.sendCode.get('code')?.markAsTouched();
  }

  getOtpErrorMessage(): string {
    const codeControl = this.sendCode.get('code');

    if (codeControl?.errors?.['required']) {
      return this.translate.instant('auth.codeRequired');
    }

    if (codeControl?.errors?.['pattern']) {
      return this.translate.instant('auth.codeRequired');
    }

    if (codeControl?.errors?.['invalidOtp']) {
      return this.translate.instant('auth.codeInvalid');
    }

    if (codeControl?.errors?.['serverMessage']) {
      return codeControl.errors['serverMessage'];
    }

    return '';
  }

  ngOnDestroy(): void {
    this.settingsSub?.unsubscribe();
  }
}
