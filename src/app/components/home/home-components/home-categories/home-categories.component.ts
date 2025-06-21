import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { Category } from '../../../../core/interfaces/dynamic-home.interface';
import { NgClass, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [NgClass, NgFor, TranslateModule],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
})
export class HomeCategoriesComponent {
  @Input() categoriesData: Category[] = [];
  @Input() categoriesTitle: string = '';
  @Input() categoriesShortTitle: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onCategoryClick(category: Category): void {
    const pathPrefix = this.authService.isAuthenticated() ? '/auth' : '';

    if (category.has_sub_categories === 1) {
      this.router.navigate([`${pathPrefix}/categories/${category.id}`]);
    } else {
      this.router.navigate([`${pathPrefix}/courses/category/${category.id}`]);
    }
  }

  viewAllCategories(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/categories']);
    } else {
      this.router.navigate(['/categories']);
    }
  }
}
