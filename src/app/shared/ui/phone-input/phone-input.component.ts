import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  NgxMaterialIntlTelInputComponent,
  TextLabels,
} from 'ngx-material-intl-tel-input';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaterialIntlTelInputComponent,
  ],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PhoneInputComponent implements OnInit {
  @Input() control!: FormControl;

  textLabels: TextLabels = {} as TextLabels;

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.translateLabels();
  }

  translateLabels() {
    this.translate.get('phone_input.labels').subscribe((labels) => {
      this.textLabels = {
        mainLabel: '',
        codePlaceholder: labels.code,
        searchPlaceholderLabel: labels.search,
        noEntriesFoundLabel: labels.no_results,
        nationalNumberLabel: labels.number,
        hintLabel: labels.hint,
        requiredError: labels.required,
        invalidNumberError: labels.invalid,
      };
    });
  }

  public PereferdCountries: string[] = [
    'EG',
    'SA',
    'AE',
    'KW',
    'QA',
    'OM',
    'BH',
    'JO',
    'LB',
    'MA',
    'TN',
    'DZ',
    'LY',
    'IQ',
    'YE',
    'SD',
    'SY',
    'PS',
    'MR',
    'DJ',
    'SO',
    'KM',
  ];
}
