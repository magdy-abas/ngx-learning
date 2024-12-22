import { Component } from '@angular/core';
import { category } from '../../../../core/service/data/data.service';
import { NgFor } from '@angular/common';
import { HomeData } from '../../data';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
})
export class HomeCategoriesComponent {
  public Category: category[] = [];

  constructor(public data: HomeData) {
    this.Category = this.data.Category;
  }
}
