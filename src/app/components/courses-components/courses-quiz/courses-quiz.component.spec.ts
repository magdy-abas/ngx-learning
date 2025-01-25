import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesQuizComponent } from './courses-quiz.component';

describe('CoursesQuizComponent', () => {
  let component: CoursesQuizComponent;
  let fixture: ComponentFixture<CoursesQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursesQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
