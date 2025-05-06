import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  NgxIntlTelInputModule,
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    TranslateModule,
  ],
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
})
export class PhoneInputComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName: string = 'phone';
  @Input() label: string = 'auth.phoneNumber';
  @Input() validators: ValidatorFn[] = [Validators.required];

  separateDialCode: boolean = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

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

  value: any;
  disabled: boolean = false;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit() {
    if (this.formGroup && this.controlName && this.validators.length) {
      const control = this.formGroup.get(this.controlName);
      if (control) {
        control.setValidators(this.validators);
        control.updateValueAndValidity();
      }
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  markAsTouched(): void {
    const control = this.formGroup.get(this.controlName);
    if (control) {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    }
    this.onTouched();
  }

  onInputChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.markAsTouched();
  }

  onBlur(): void {
    this.markAsTouched();
  }
}
