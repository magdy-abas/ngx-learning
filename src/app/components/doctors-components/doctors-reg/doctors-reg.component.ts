import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PhoneInputComponent } from '../../../shared/ui/phone-input/phone-input.component';
import { NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DoctorsService } from '../../../core/service/doctors.service';

@Component({
  selector: 'app-doctors-reg',
  standalone: true,
  imports: [ReactiveFormsModule, PhoneInputComponent, NgIf, TranslateModule],
  templateUrl: './doctors-reg.component.html',
  styleUrl: './doctors-reg.component.scss',
})
export class DoctorsRegComponent {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private _DoctorsService: DoctorsService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: new FormControl(null, Validators.required),
      courses: ['', Validators.required],
      notes: [''],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;

    this._DoctorsService.doctorRegister(formData).subscribe({
      next: (res) => {
        if (res.status === 1) {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('sweetalert.requestSentTitle'),
            text: this.translate.instant('sweetalert.requestSentBody'),
            confirmButtonText: this.translate.instant('sweetalert.ok'),
          });

          this.registerForm.reset();
          this.submitted = false;
        } else {
          Swal.fire({
            text: res.message,
            confirmButtonText: this.translate.instant('sweetalert.ok'),
          });
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message;
      },
    });
  }

  get phoneControl(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }
}
