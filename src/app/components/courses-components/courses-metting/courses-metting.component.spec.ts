import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesMettingComponent } from './courses-metting.component';

describe('CoursesMettingComponent', () => {
  let component: CoursesMettingComponent;
  let fixture: ComponentFixture<CoursesMettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesMettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursesMettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
