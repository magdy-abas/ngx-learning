import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsHomeV2Component } from './lessons-home-v2.component';

describe('LessonsHomeV2Component', () => {
  let component: LessonsHomeV2Component;
  let fixture: ComponentFixture<LessonsHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonsHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
