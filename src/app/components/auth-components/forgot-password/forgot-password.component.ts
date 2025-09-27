import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router, RouterLink } from '@angular/router';
import Aos from 'aos';

import { AuthService } from '../../../core/service/auth.service';
import {
  DataService,
  Lang,
  WelcomeSlideView,
} from '../../../core/service/data/data.service';

import { AlertErrorComponent } from '../../../shared/ui/alert-error/alert-error.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DarkModeService } from '../../../core/service/dark-mode.service';
import { OtpInputComponent } from '../../../shared/ui/otp-code-input/otp-code-input.component';
import { SsrService } from '../../../core/service/ssr.service';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CarouselModule,
    CommonModule,
    RouterLink,

    ReactiveFormsModule,
    AlertErrorComponent,
    TranslateModule,
    OtpInputComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPassword: WelcomeSlideView[] = [];
  public logoUrl: string = '';
  public appName: string = '';

  public forgotStep: number = 1;
  errMsg: string = '';

  // FormGroups
  public emailForm: FormGroup;
  public resetPasswordForm: FormGroup;

  // Owl carousel options
  public forgotPasswordOwlOptions: OwlOptions = {
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
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private router: Router,
    private DataService: DataService,
    private darkModeService: DarkModeService,
    private translate: TranslateService,
    private ssr: SsrService
  ) {
    // Forms Initialization
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.fb.group(
      {
        code: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(4),
          ],
        ],
        password: [
          '',
          [Validators.required, Validators.pattern('^(?=.*[A-Z]).{6,}$')],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  ngOnInit(): void {
    Aos.init();
    this.darkModeService.applyMode();

    const settingsString = this.ssr.getLocal('appSettings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      this.logoUrl = this.darkModeService.getLogo(settings);

      const lang = (this.translate.currentLang || 'en') as Lang;
      this.appName = settings.data.app_name?.[lang] || '';

      this.forgotPassword = this.DataService.getWelcomeSlides(
        this.appName,
        lang
      );
    }
  }

  private passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  public directLogin(): void {
    if (this.forgotStep === 1) {
      if (this.emailForm.invalid) {
        this.markFormGroupTouched(this.emailForm);
        return;
      }

      this._AuthService.sendPinCode(this.emailForm.value).subscribe({
        next: (res) => {
          if (res.status === 1) {
            this.errMsg = '';
            this.forgotStep++;
          } else {
            this.errMsg = res.message;
          }
        },
        error: (err) => {
          console.error('Error sending verification email:', err);
        },
      });
    } else if (this.forgotStep === 2) {
      if (this.resetPasswordForm.invalid) {
        this.markFormGroupTouched(this.resetPasswordForm);
        return;
      }

      // Prepare payload
      const payload = {
        email: this.emailForm.get('email')?.value,
        pin_code: this.resetPasswordForm.get('code')?.value,
        password: this.resetPasswordForm.get('password')?.value,
        password_confirmation:
          this.resetPasswordForm.get('confirmPassword')?.value,
      };

      // Reset password
      this._AuthService.resetPassword(payload).subscribe({
        next: (res) => {
          if (res.status === 1) {
            this.router.navigate(['/login']);
          } else {
            this.errMsg = res.message;
          }
        },
        error: (err) => {
          console.error('Error resetting password:', err);
        },
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  public onCodeCompleted(code: string): void {
    this.resetPasswordForm.patchValue({ code });
  }

  getOtpErrorMessage(): string {
    const codeControl = this.resetPasswordForm.get('code');

    if (codeControl?.errors?.['required']) {
      return 'كود التفعيل مطلوب';
    }

    if (
      codeControl?.errors?.['minlength'] ||
      codeControl?.errors?.['maxlength']
    ) {
      return 'كود التفعيل يجب أن يكون 4 أرقام';
    }

    return '';
  }
  resendCode() {
    if (this.emailForm.valid) {
      this._AuthService.sendPinCode(this.emailForm.value).subscribe({
        next: (res) => {
          if (res.status === 1) {
            this.errMsg = '';
          } else {
            this.errMsg = res.message;
          }
        },
        error: (err) => {
          console.error('Error resending code:', err);
        },
      });
    }
  }
}
