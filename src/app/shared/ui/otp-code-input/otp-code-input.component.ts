import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './otp-code-input.component.html',
  styleUrls: ['./otp-code-input.component.scss'],
})
export class OtpInputComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  @Output() otpCompleted = new EventEmitter<string>();

  @Input() length: number = 4;
  @Input() label?: string;
  @Input() showError: boolean = false;
  @Input() errorMessage: string = '';

  @Output() otpChange = new EventEmitter<string>();
  @Output() resendOtp = new EventEmitter<void>();

  countdown: number = 60;
  canResend: boolean = false;
  timerSubscription?: Subscription;

  ngOnInit(): void {
    this.startResendTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^\d*$/.test(value)) {
      input.value = '';
      return;
    }

    if (value && index < this.length - 1) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }

    this.emitOtpValue();
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.otpInputs.get(index - 1)?.nativeElement.focus();
    }
  }

  private emitOtpValue(): void {
    const otpValue = this.otpInputs
      .toArray()
      .map((input) => input.nativeElement.value)
      .join('');

    this.otpChange.emit(otpValue);
  }

  clear(): void {
    this.otpInputs.forEach((input) => {
      input.nativeElement.value = '';
    });
    this.emitOtpValue();
  }

  startResendTimer(): void {
    this.countdown = 60;
    this.canResend = false;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.countdown > 0))
      .subscribe(() => {
        this.countdown--;
        if (this.countdown === 0) {
          this.canResend = true;
        }
      });
  }

  onResendClick(): void {
    if (this.canResend) {
      this.resendOtp.emit();
      this.startResendTimer();
      this.clear();
    }
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  onPaste(event: ClipboardEvent): void {
    const pasteData = event.clipboardData?.getData('text') ?? '';
    const digits = pasteData.replace(/\D/g, '').slice(0, this.length).split('');

    digits.forEach((digit, i) => {
      const input = this.otpInputs.get(i);
      if (input) input.nativeElement.value = digit;
    });

    this.emitOtpValue();

    const nextInput = this.otpInputs.get(digits.length);
    if (nextInput) nextInput.nativeElement.focus();

    event.preventDefault();
  }
}
