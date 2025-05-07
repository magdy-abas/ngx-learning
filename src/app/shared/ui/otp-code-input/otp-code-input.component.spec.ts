import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpCodeInputComponent } from './otp-code-input.component';

describe('OtpCodeInputComponent', () => {
  let component: OtpCodeInputComponent;
  let fixture: ComponentFixture<OtpCodeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpCodeInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpCodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
