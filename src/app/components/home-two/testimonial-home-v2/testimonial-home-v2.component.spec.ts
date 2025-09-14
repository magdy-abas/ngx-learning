import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialHomeV2Component } from './testimonial-home-v2.component';

describe('TestimonialHomeV2Component', () => {
  let component: TestimonialHomeV2Component;
  let fixture: ComponentFixture<TestimonialHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestimonialHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
