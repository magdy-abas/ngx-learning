import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-code-input',
  standalone: true,
  imports: [CommonModule, CodeInputModule, TranslateModule],
  templateUrl: './otp-code-input.component.html',
  styleUrls: ['./otp-code-input.component.scss'],
})
export class OtpCodeInputComponent {
  @Input() codeLength: number = 4;
  @Input() isCodeHidden: boolean = false;
  @Input() countdown: number = 60;
  @Output() codeCompleted = new EventEmitter<string>();
  @Output() resendClicked = new EventEmitter<void>();

  public timeLeft: number = 0;
  public intervalId: any;
  public canResend: boolean = false;

  ngOnInit() {
    this.startTimer();
  }

  private startTimer() {
    this.timeLeft = this.countdown;
    this.canResend = false;
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.intervalId);
        this.canResend = true;
      }
    }, 1000);
  }

  onResend() {
    this.resendClicked.emit();
    this.startTimer();
  }

  onCodeCompleted(code: string) {
    this.codeCompleted.emit(code);
  }
}
