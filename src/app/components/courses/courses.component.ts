import { Component, HostListener } from '@angular/core';
import { FeatherIconModule } from '../../shared/utils/feather-icons.utils';
import { courseGrid, DataService } from '../../core/service/data/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { routes } from '../../core/service/routes/routes';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../core/service/courses.service';
import { ICourse } from '../../core/interfaces/courses.interface';
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
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  searchValue: string = '';
  pagination: number = 9;
  pageNum: number = 1;
  coursesData: ICourse[] = [];
  isLoading: boolean = false;
  allDataLoaded: boolean = false;
  public routes = routes;
  public searchDataValue = '';
  dataSource!: MatTableDataSource<courseGrid>;

  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  public courseGrid: courseGrid[] = [];
  selected = '1';
  constructor(
    private data: DataService,
    private _CoursesService: CoursesService
  ) {
    // this.courseGrid = this.DataService.courseGrid;
  }
  ngOnInit(): void {
    this.getcourseGrid();
    this.getCourses();
  }
  private getcourseGrid(): void {
    this.courseGrid = [];
    this.serialNumberArray = [];

    this.data.gridCourseList().subscribe((res: courseGrid) => {
      this.totalData = res.totalData;
      res.data.map((res: courseGrid, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.totalData = serialNumber;
          this.courseGrid.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<courseGrid>(this.courseGrid);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }
  public sortData(sort: Sort) {
    const data = this.courseGrid.slice();

    if (!sort.active || sort.direction === '') {
      this.courseGrid = data;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.courseGrid = data.sort((a: any, b: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.courseGrid = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getcourseGrid();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getcourseGrid();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getcourseGrid();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getcourseGrid();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  toggleClass(data: data) {
    data.active = !data.active;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 10; // Trigger when 10px from the bottom

    if (scrollPosition >= threshold) {
      this.getCourses();
    }
  }
  ClearSearch() {
    this.searchValue = '';
    this.getCourses();
  }

  getCourses() {
    if (this.isLoading || this.allDataLoaded) {
      return;
    }
    this.isLoading = true;

    this._CoursesService
      .getCourses(this.searchValue, this.pagination, this.pageNum)
      .subscribe({
        next: (res) => {
          console.log(res.meta.total);

          if (res.data.length === 0) {
            this.allDataLoaded = true; // No more data to load
          } else {
            this.coursesData = [...this.coursesData, ...res.data]; // add new data
            this.pageNum++;
            console.log(this.coursesData.length);
          }
          this.isLoading = false;
          console.log(res.data);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }
}

export interface pageSelection {
  skip: number;
  limit: number;
}
