import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  CoursesSection,
  ICourse,
} from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';
import { CoursesCardComponent } from '../../../shared/ui/courses-card/courses-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-courses-home-v2',
  standalone: true,
  imports: [TranslateModule, NgIf, CoursesCardComponent, RouterLink],
  templateUrl: './featured-courses-home-v2.component.html',
  styleUrl: './featured-courses-home-v2.component.scss',
})
export class FeaturedCoursesHomeV2Component {
  @Input() courses: CoursesSection | null = null;
}
