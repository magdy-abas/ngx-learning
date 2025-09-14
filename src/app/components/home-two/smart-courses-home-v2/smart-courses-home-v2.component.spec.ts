import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartCoursesHomeV2Component } from './smart-courses-home-v2.component';

describe('SmartCoursesHomeV2Component', () => {
  let component: SmartCoursesHomeV2Component;
  let fixture: ComponentFixture<SmartCoursesHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartCoursesHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartCoursesHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
