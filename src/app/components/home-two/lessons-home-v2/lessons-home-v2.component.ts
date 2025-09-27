import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Category,
  ICategory,
} from '../../../core/interfaces/dynamic-home.interface';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/service/shared.service';

@Component({
  selector: 'app-lessons-home-v2',
  standalone: true,
  imports: [TranslateModule, NgFor],
  templateUrl: './lessons-home-v2.component.html',
  styleUrl: './lessons-home-v2.component.scss',
})
export class LessonsHomeV2Component implements OnInit {
  @Input() categories: ICategory[] = [];
  lessonsTitle: string | null = null;
  lessonsSubtitle: string | null = null;
  constructor(private router: Router, private sharedService: SharedService) {}
  ngOnInit(): void {
    this.lessonsTitle = this.sharedService.getAppAttrValue('lessons', 'title');
    this.lessonsSubtitle = this.sharedService.getAppAttrValue(
      'lessons',
      'subtitle'
    );
  }
  onCategoryClick(category: Category): void {
    // console.log(this.categories);

    if (category.has_sub_categories === 1) {
      this.router.navigate([`/category/${category.id}`]);
    } else {
      this.router.navigate([`/courses/category/${category.id}`]);
    }
  }
}
