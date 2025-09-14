import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterHomeV2Component } from './counter-home-v2.component';

describe('CounterHomeV2Component', () => {
  let component: CounterHomeV2Component;
  let fixture: ComponentFixture<CounterHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounterHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
