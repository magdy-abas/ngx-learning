import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICourse } from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-featured-courses-home-v2',
  standalone: true,
  imports: [TranslateModule, NgIf, NgFor],
  templateUrl: './featured-courses-home-v2.component.html',
  styleUrl: './featured-courses-home-v2.component.scss',
})
export class FeaturedCoursesHomeV2Component {
  @Input() courses: ICourse[] = [];
}
