import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCoursesHomeV2Component } from './featured-courses-home-v2.component';

describe('FeaturedCoursesHomeV2Component', () => {
  let component: FeaturedCoursesHomeV2Component;
  let fixture: ComponentFixture<FeaturedCoursesHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCoursesHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedCoursesHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
