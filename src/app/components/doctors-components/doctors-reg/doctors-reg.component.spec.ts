import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsRegComponent } from './doctors-reg.component';

describe('DoctorsRegComponent', () => {
  let component: DoctorsRegComponent;
  let fixture: ComponentFixture<DoctorsRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsRegComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorsRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
