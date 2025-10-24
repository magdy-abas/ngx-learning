import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../core/service/shared.service';
import { Subscription } from 'rxjs';
import { DynamicHomeService } from '../../../core/service/dynamic-home.service';

@Component({
  selector: 'app-counter-home-v2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './counter-home-v2.component.html',
  styleUrl: './counter-home-v2.component.scss',
})
export class CounterHomeV2Component implements OnInit, OnDestroy {
  coursesNumber: number = 0;
  studentsNumber: number = 0;
  teachersNumber: number = 0;
  fieldsNumber: number = 0;

  coursesLabel: string | null = null;
  studentsLabel: string | null = null;
  teachersLabel: string | null = null;
  fieldsLabel: string | null = null;

  private subscription?: Subscription;

  constructor(private DynamicHomeService: DynamicHomeService) {}

  ngOnInit(): void {
    this.subscription = this.DynamicHomeService.appAttrs$.subscribe((attrs) => {
      if (attrs.length > 0) {
        this.loadCounterData();
      }
    });
  }

  private loadCounterData(): void {
    this.coursesNumber = +(
      this.DynamicHomeService.getAppAttrValue('counter', 'courses_number') || 0
    );
    this.studentsNumber = +(
      this.DynamicHomeService.getAppAttrValue('counter', 'students_number') || 0
    );
    this.teachersNumber = +(
      this.DynamicHomeService.getAppAttrValue('counter', 'teachers_number') || 0
    );
    this.fieldsNumber = +(
      this.DynamicHomeService.getAppAttrValue('counter', 'fields_number') || 0
    );

    this.coursesLabel = this.DynamicHomeService.getAppAttrValue(
      'counter',
      'courses'
    );
    this.studentsLabel = this.DynamicHomeService.getAppAttrValue(
      'counter',
      'students'
    );
    this.teachersLabel = this.DynamicHomeService.getAppAttrValue(
      'counter',
      'teachers'
    );
    this.fieldsLabel = this.DynamicHomeService.getAppAttrValue(
      'counter',
      'fields'
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
