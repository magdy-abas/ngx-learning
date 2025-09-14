import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesHomeV2Component } from './courses-home-v2.component';

describe('CoursesHomeV2Component', () => {
  let component: CoursesHomeV2Component;
  let fixture: ComponentFixture<CoursesHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursesHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
