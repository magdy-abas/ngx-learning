import {
  Component,
  inject,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CategoriesService } from '../../core/service/categories.service';
import {
  Category,
  CategoriesResponse,
} from '../../core/interfaces/categories.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../shared/utils/unSubscribeObservable.utils';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private routeSub?: Subscription;
  private subscriptions: Subscription[] = [];
  categories: Category[] = [];
  subCategories: Category[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  isLoading: boolean = false;
  isSubCategoryView: boolean = false;
  categoryId: number | null = null;
  firstLoad = true;
  private _CategoriesService = inject(CategoriesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('categoryId')
        ? parseInt(params.get('categoryId')!, 10)
        : null;

      if (this.categoryId) {
        this.getCategories(1, this.categoryId);
      } else {
        this.getCategories(0);
      }
    });
  }

  getCategories(
    withSubCategories: number = 0,
    id?: number,
    page: number = this.currentPage
  ): void {
    if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;

    this._CategoriesService
      .getCategories(withSubCategories, id, page, this.firstLoad)
      .subscribe((res: CategoriesResponse) => {
        if (withSubCategories === 1) {
          this.subCategories = res.data[0]?.sub_categories || [];
          this.isSubCategoryView = true;
        } else {
          this.categories.push(...res.data);
        }

        this.lastPage = res.meta.last_page;
        this.currentPage++;
        this.isLoading = false;
        this.firstLoad = false;
      });
  }

  onCategoryClick(category: Category): void {
    this.currentPage = 1;

    if (category.has_sub_categories === 1) {
      this.isSubCategoryView = true;
      this.getCategories(1, category.id);
    } else {
      this.router.navigate([`/courses/category/${category.id}`]);
    }
  }

  onSubCategoryClick(subCategory: Category): void {
    if (subCategory.has_sub_categories === 1) {
      this.subCategories = subCategory.sub_categories || [];
      this.isSubCategoryView = true;
    } else {
      this.router.navigate([`/courses/category/${subCategory.id}`]);
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      !this.isSubCategoryView &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      this.getCategories();
    }
  }

  backToCategories(): void {
    this.isSubCategoryView = false;
    this.subCategories = [];
    this.currentPage = 1;
    this.getCategories(0);
  }
  ngOnDestroy(): void {
    unsubscribeAll(this.routeSub!);
  }
}
