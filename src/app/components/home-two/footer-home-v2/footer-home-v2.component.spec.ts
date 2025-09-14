import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterHomeV2Component } from './footer-home-v2.component';

describe('FooterHomeV2Component', () => {
  let component: FooterHomeV2Component;
  let fixture: ComponentFixture<FooterHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
