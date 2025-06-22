import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DataService,
  Lang,
  WelcomeSlideView,
} from '../../../core/service/data/data.service';
import { routes } from '../../../core/service/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
import {
  NgxIntlTelInputModule,
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { AlertErrorComponent } from '../../../shared/ui/alert-error/alert-error.component';
import { AuthService } from '../../../core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDto } from '../../../core/Dtos/AuthDtos';
import { scrollToTop } from '../../../shared/utils/ui-utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  AuthResponse,
  ErrorAuthData,
  ErrorAuthResponse,
} from '../../../core/interfaces/auth.interface';
import { PhoneInputComponent } from '../../../shared/ui/phone-input/phone-input.component';
import { DarkModeService } from '../../../core/service/dark-mode.service';
type passwordResponce = {
  passwordResponceText?: string;
  passwordResponceImage?: string;
  passwordResponceKey?: string;
};
export
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
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    AlertErrorComponent,
    TranslateModule,
    PhoneInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
class RegisterComponent {
  public routes = routes;
  RegisterDto: RegisterDto = new RegisterDto();
  public passwordResponce: passwordResponce = {};
  msgError: string = '';
  isLoading: boolean = false;
  public logoUrl: string = '';
  public welcomeLogin: WelcomeSlideView[] = [];

  separateDialCode: boolean = true;
  preferredCountries: CountryISO[] = [
    CountryISO.SaudiArabia,
    CountryISO.UnitedArabEmirates,
    CountryISO.Kuwait,
    CountryISO.Bahrain,
    CountryISO.Oman,
    CountryISO.Qatar,
    CountryISO.Egypt,
    CountryISO.Iraq,
    CountryISO.Jordan,
    CountryISO.Lebanon,
    CountryISO.Libya,
    CountryISO.Algeria,
    CountryISO.Yemen,
    CountryISO.Comoros,
    CountryISO.Mauritania,
    CountryISO.Morocco,
    CountryISO.Palestine,
    CountryISO.Sudan,
    CountryISO.Syria,
    CountryISO.Tunisia,
    CountryISO.Djibouti,
    CountryISO.Somalia,
  ];
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  password = 'password';
  show = true;

  public registerOwlOptions: OwlOptions = {
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
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.darkModeService.applyMode();

    const settingsString = localStorage.getItem('appSettings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      this.logoUrl = this.darkModeService.getLogo(settings);
      const lang = (localStorage.getItem('lang') || 'en') as Lang;
      this.welcomeLogin = this.DataService.getWelcomeSlides(
        settings.data.app_name[lang],
        lang
      );
    }
  }
  regForm: FormGroup = this._FormBuilder.group(
    {
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null],
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

  onChangePassword() {
    const password = this.regForm.get('password')?.value;
    if (!password) {
      this.resetPasswordResponse();
      return;
    }

    if (password.match(/^$|\s+/)) {
      this.setPasswordResponse('whitespaces are not allowed', '', '');
      return;
    }

    const validations = [
      {
        condition: password.length < 8,
        message: 'Weak. Must contain at least 8 characters',
        image: 'assets/img/icon/angry.svg',
        key: '0',
      },
      {
        condition: !/[a-z]/.test(password),
        message: 'Average. Must contain at least 1 upper case and number',
        image: 'assets/img/icon/anguish.svg',
        key: '1',
      },
      {
        condition: !/[A-Z]/.test(password),
        message: 'Average. Must contain at least 1 upper case and number',
        image: 'assets/img/icon/anguish.svg',
        key: '1',
      },
      {
        condition: !/[0-9]/.test(password),
        message: 'Average. Must contain at least 1 upper case and number',
        image: 'assets/img/icon/anguish.svg',
        key: '1',
      },
      {
        condition: !/(?=.*?[#?!@$%^&*-])/.test(password),
        message: 'Almost. Must contain special symbol',
        image: 'assets/img/icon/smile.svg',
        key: '2',
      },
    ];

    const validation = validations.find((v) => v.condition);

    if (validation) {
      this.setPasswordResponse(
        validation.message,
        validation.image,
        validation.key
      );
    } else {
      this.setPasswordResponse(
        'Awesome! You have a secure password.',
        'assets/img/icon/smile.svg',
        '3'
      );
    }
  }

  private setPasswordResponse(text: string, image: string, key: string) {
    this.passwordResponce.passwordResponceText = text;
    this.passwordResponce.passwordResponceImage = image;
    this.passwordResponce.passwordResponceKey = key;
  }

  private resetPasswordResponse() {
    this.setPasswordResponse('', '', '');
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.regForm.get(fieldName);
    return !!(!field?.errors && (field?.dirty || field?.touched));
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.regForm.get(fieldName);
    return !!(field?.errors && (field?.dirty || field?.touched));
  }

  onSubmit() {
    if (this.regForm.valid) {
      const phoneControl = this.regForm.get('phone');
      const formData = this.regForm.value;

      this.RegisterDto.name = formData.name;
      this.RegisterDto.email = formData.email;
      this.RegisterDto.phone = phoneControl?.value?.number || '';
      this.RegisterDto.password = formData.password;
      this.RegisterDto.password_confirmation = formData.password;
      this.RegisterDto.token = '123';
      this.RegisterDto.serial_number = '123';
      this.RegisterDto.os = 'ios';

      console.log(this.RegisterDto);
      this._AuthService.register(this.RegisterDto).subscribe({
        next: (res: AuthResponse) => {
          if (res.status === 1) {
            console.log(res);
            this._AuthService.saveToken(res.data.token);
            console.log(res.data.user);
            this._AuthService.saveUserData(res.data.user);
            this._Router.navigate(['/auth/home']);
          } else {
            const errorData = res.data as ErrorAuthData;
            console.log(res.message);
            this.msgError = res.message;
            if (errorData.email?.length) {
              this.regForm
                .get('email')
                ?.setErrors({ serverError: errorData.email[0] });
            }
            scrollToTop();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.message;
        },
      });
    } else {
      this.regForm.markAllAsTouched();
    }
  }
}
