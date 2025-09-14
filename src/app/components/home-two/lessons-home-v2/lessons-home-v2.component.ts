import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICategory } from '../../../core/interfaces/dynamic-home.interface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-lessons-home-v2',
  standalone: true,
  imports: [TranslateModule, NgFor],
  templateUrl: './lessons-home-v2.component.html',
  styleUrl: './lessons-home-v2.component.scss',
})
export class LessonsHomeV2Component {
  @Input() categories: ICategory[] = [];
}
