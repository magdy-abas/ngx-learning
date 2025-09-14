import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellingHomeV2Component } from './best-selling-home-v2.component';

describe('BestSellingHomeV2Component', () => {
  let component: BestSellingHomeV2Component;
  let fixture: ComponentFixture<BestSellingHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSellingHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BestSellingHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
