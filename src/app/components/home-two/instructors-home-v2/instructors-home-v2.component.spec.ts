import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsHomeV2Component } from './instructors-home-v2.component';

describe('InstructorsHomeV2Component', () => {
  let component: InstructorsHomeV2Component;
  let fixture: ComponentFixture<InstructorsHomeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsHomeV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructorsHomeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
