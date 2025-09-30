import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FeatherIconModule } from '../../../shared/utils/feather-icons.utils';
import { DataService } from '../../../core/service/data/data.service';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../../core/service/courses.service';
import { ICourse } from '../../../core/interfaces/courses.interface';
import { CoursesCardComponent } from '../../../shared/ui/courses-card/courses-card.component';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '../../../core/interfaces/courses.interface';
import { SsrService } from '../../../core/service/ssr.service';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';

interface data {
  active?: boolean;
}
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    FeatherIconModule,
    RouterLink,
    CommonModule,
    MatSelectModule,
    FormsModule,
    CoursesCardComponent,
    TranslateModule,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit, OnDestroy {
  searchValue: string = '';
  pagination: number = 9;
  pageNum: number = 1;
  coursesData: Course[] = [];
  categoryId: string | null = null;
  doctorId: string | null = null;
  isLoading: boolean = false;
  allDataLoaded: boolean = false;
  totalCourses: number = 0;
  currentlyShowing: number = 0;
  private subscriptions: Subscription[] = [];
  private ssr = inject(SsrService);

  constructor(
    private data: DataService,
    private _CoursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    private globalTranslate: GlobalTranslateService
  ) {}
  ngOnInit(): void {
    const langSub = this.globalTranslate.language$.subscribe((lang) => {
      this.resetAndLoad();
    });

    this.subscriptions.push(langSub);

    const querySub = this.route.queryParams.subscribe((queryParams) => {
      this.searchValue = queryParams['search'] || '';

      const paramSub = this.route.paramMap.subscribe((params) => {
        this.categoryId = params.get('categoryId');
        this.doctorId = params.get('doctorId');

        this.pageNum = 1;
        this.coursesData = [];
        this.allDataLoaded = false;

        this.getCourses();
      });

      this.subscriptions.push(paramSub);
    });

    this.subscriptions.push(querySub);
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
  clearSearchParam() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.ssr.isBrowser()) return;

    const win = this.ssr.getWindow();
    const doc = this.ssr.getDocument();

    if (!win || !doc) return;

    const scrollPosition = win.innerHeight + win.pageYOffset;
    const threshold = doc.documentElement.scrollHeight - 50;

    if (scrollPosition >= threshold) {
      this.getCourses();
    }
  }

  searchCourses(): void {
    this.pageNum = 1;
    this.coursesData = [];
    this.allDataLoaded = false;

    this.getCourses();
  }

  ClearSearch() {
    this.searchValue = '';
    this.clearSearchParam();
    this.searchCourses();
  }

  getCourses() {
    if (this.isLoading || this.allDataLoaded) {
      return;
    }

    this.isLoading = true;

    const coursesSub = this._CoursesService
      .getCourses(
        this.searchValue,
        this.pagination,
        this.pageNum,
        this.categoryId,
        this.doctorId
      )
      .subscribe({
        next: (res) => {
          // console.log(res);

          if (res.data.length === 0) {
            this.allDataLoaded = true;
          } else {
            this.coursesData = [...this.coursesData, ...res.data];
            this.pageNum++;
            this.totalCourses = res.meta.total;

            this.currentlyShowing = this.coursesData.length;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching courses:', err);
          this.isLoading = false;
        },
      });

    this.subscriptions.push(coursesSub);
  }

  private resetAndLoad() {
    this.pageNum = 1;
    this.coursesData = [];
    this.allDataLoaded = false;
    this.getCourses();
  }
}
