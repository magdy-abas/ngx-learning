import { Component, Input, AfterViewInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Category,
  ICategory,
} from '../../../core/interfaces/dynamic-home.interface';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lessons-home-v2',
  standalone: true,
  imports: [TranslateModule, NgFor],
  templateUrl: './lessons-home-v2.component.html',
  styleUrl: './lessons-home-v2.component.scss',
})
export class LessonsHomeV2Component {
  @Input() categories: ICategory[] = [];
  constructor(private router: Router) {}

  onCategoryClick(category: Category): void {
    if (category.has_sub_categories === 1) {
      this.router.navigate([`/category/${category.id}`]);
    } else {
      this.router.navigate([`/courses/category/${category.id}`]);
    }
  }
}
