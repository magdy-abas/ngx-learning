import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../core/service/shared.service';

@Component({
  selector: 'app-counter-home-v2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './counter-home-v2.component.html',
  styleUrl: './counter-home-v2.component.scss',
})
export class CounterHomeV2Component implements OnInit {
  coursesNumber: number = 0;
  studentsNumber: number = 0;
  teachersNumber: number = 0;
  fieldsNumber: number = 0;

  coursesLabel: string | null = null;
  studentsLabel: string | null = null;
  teachersLabel: string | null = null;
  fieldsLabel: string | null = null;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.coursesNumber = +this.sharedService.getAppAttrValue(
      'counter',
      'courses_number'
    )!;
    this.studentsNumber = +this.sharedService.getAppAttrValue(
      'counter',
      'students_number'
    )!;
    this.teachersNumber = +this.sharedService.getAppAttrValue(
      'counter',
      'teachers_number'
    )!;
    this.fieldsNumber = +this.sharedService.getAppAttrValue(
      'counter',
      'fields_number'
    )!;

    this.coursesLabel = this.sharedService.getAppAttrValue(
      'counter',
      'courses'
    );
    this.studentsLabel = this.sharedService.getAppAttrValue(
      'counter',
      'students'
    );
    this.teachersLabel = this.sharedService.getAppAttrValue(
      'counter',
      'teachers'
    );
    this.fieldsLabel = this.sharedService.getAppAttrValue('counter', 'fields');
  }
}
