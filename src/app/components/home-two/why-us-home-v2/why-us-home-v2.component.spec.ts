import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyUsHomeV2Component } from './why-us-home-v2.component';

describe('WhyUsHomeV2Component', () => {
  let component: WhyUsHomeV2Component;
  let fixture: ComponentFixture<WhyUsHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyUsHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhyUsHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
