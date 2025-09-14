import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroHomeV2Component } from './hero-home-v2.component';

describe('HeroHomeV2Component', () => {
  let component: HeroHomeV2Component;
  let fixture: ComponentFixture<HeroHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
