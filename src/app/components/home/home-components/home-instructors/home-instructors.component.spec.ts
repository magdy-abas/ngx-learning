import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInstructorsComponent } from './home-instructors.component';

describe('CoursesMettingComponent', () => {
  let component: HomeInstructorsComponent;
  let fixture: ComponentFixture<HomeInstructorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeInstructorsComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeInstructorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
