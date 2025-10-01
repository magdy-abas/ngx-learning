import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  CategoriesSection,
  Category,
  ICategory,
} from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/service/shared.service';

@Component({
  selector: 'app-lessons-home-v2',
  standalone: true,
  imports: [TranslateModule, NgFor, NgIf],
  templateUrl: './lessons-home-v2.component.html',
  styleUrl: './lessons-home-v2.component.scss',
})
export class LessonsHomeV2Component implements OnInit {
  @Input() categories: CategoriesSection | null = null;

  constructor(private router: Router, private sharedService: SharedService) {}
  ngOnInit(): void {}
  onCategoryClick(category: Category): void {
    // console.log(this.categories);

    if (category.has_sub_categories === 1) {
      this.router.navigate([`/category/${category.id}`]);
    } else {
      this.router.navigate([`/courses/category/${category.id}`]);
    }
  }
}
