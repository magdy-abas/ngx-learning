import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {
  FormBuilder,
  FormControl,
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

import { Router, RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
// import {
//   NgxIntlTelInputModule,
//   SearchCountryField,
//   CountryISO,
//   PhoneNumberFormat,
// } from 'ngx-intl-tel-input';
import { AlertErrorComponent } from '../../../shared/ui/alert-error/alert-error.component';
import { AuthService } from '../../../core/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDto } from '../../../core/Dtos/AuthDtos';
import { scrollToTop } from '../../../shared/utils/ui-utils';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AuthResponse,
  ErrorAuthData,
  ErrorAuthResponse,
} from '../../../core/interfaces/auth.interface';
import { PhoneInputComponent } from '../../../shared/ui/phone-input/phone-input.component';
import { DarkModeService } from '../../../core/service/dark-mode.service';
import { SharedService } from '../../../core/service/shared.service';
import { Subscription } from 'rxjs';
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

    ReactiveFormsModule,
    AlertErrorComponent,
    TranslateModule,
    PhoneInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
class RegisterComponent implements OnInit, OnDestroy {
  private settingsSub?: Subscription;

  RegisterDto: RegisterDto = new RegisterDto();
  public passwordResponce: passwordResponce = {};
  msgError: string = '';
  isLoading: boolean = false;
  public logoUrl: string = '';
  public welcomeLogin: WelcomeSlideView[] = [];

  separateDialCode: boolean = true;

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
    private darkModeService: DarkModeService,
    private sharedService: SharedService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.darkModeService.applyMode();

    this.settingsSub = this.sharedService.settings$.subscribe((settings) => {
      if (settings?.data) {
        this.logoUrl = this.darkModeService.getLogo(settings);
        const lang = (this.translate.currentLang || 'en') as Lang;
        this.welcomeLogin = this.DataService.getWelcomeSlides(
          settings.data.app_name?.[lang] ?? 'App Name',
          lang
        );
      } else {
        console.log('setting error ');
      }
    });
  }
  regForm: FormGroup = this._FormBuilder.group(
    {
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null],
      password: [null, [Validators.required, Validators.minLength(6)]],
    },
    {}
  );

  get phoneControl(): FormControl {
    return this.regForm.get('phone') as FormControl;
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
    const phoneControl = this.phoneControl;

    // Step 1: Check if  form valid
    if (this.regForm.invalid || phoneControl.invalid) {
      this.regForm.markAllAsTouched();
      phoneControl.markAsTouched();
      return;
    }

    //: Extract the  phone num
    const rawPhone: string = phoneControl.value;

    // Extract dial code and mobile number
    const dialCodeMatch = rawPhone.match(/^\+(\d{1,4})/);
    const dialCode = dialCodeMatch ? dialCodeMatch[1] : '';
    const mobile = rawPhone
      .replace(/^\+\d{1,4}/, '')
      .trim()
      .replace(/\s+/g, '');

    // if valid
    if (!dialCode || !mobile) {
      phoneControl.setErrors({ invalid: true });
      return;
    }

    //  DTO
    const formData = this.regForm.value;
    this.RegisterDto.name = formData.name;
    this.RegisterDto.email = formData.email;
    this.RegisterDto.phone = mobile;
    this.RegisterDto.password = formData.password;
    this.RegisterDto.password_confirmation = formData.password;

    this.RegisterDto.token = '123';
    this.RegisterDto.serial_number = '123';
    this.RegisterDto.os = 'ios';

    // send data
    this._AuthService.register(this.RegisterDto).subscribe({
      next: (res: AuthResponse) => {
        if (res.status === 1) {
          this._AuthService.saveToken(res.data.token);
          this._AuthService.saveUserData(res.data.user);
          this._Router.navigate(['/']);
        } else {
          const errorData = res.data as ErrorAuthData;
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
  }

  ngOnDestroy(): void {
    this.settingsSub?.unsubscribe();
  }
}
