import { Component, Input } from '@angular/core';
import { category } from '../../../../core/service/data/data.service';
import { NgClass, NgFor } from '@angular/common';
import { HomeData } from '../../data';

import { Category } from '../../../../core/interfaces/dynamic-home.interface';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
})
export class HomeCategoriesComponent {
  public Category: category[] = [];
  @Input() categoriesData: Category[] = [];
  @Input() categoriesTitle: string = '';
  @Input() categoriesShortTitle: string = '';
  constructor(public data: HomeData) {
    this.Category = this.data.Category;
  }
}
