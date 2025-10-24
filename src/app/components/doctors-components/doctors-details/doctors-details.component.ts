import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorsService } from '../../../core/service/doctors.service';
import { Doctor } from '../../../core/interfaces/doctors.interface';
import { NgIf } from '@angular/common';
import { CoursesCardComponent } from '../../../shared/ui/courses-card/courses-card.component';
import { CoursesService } from '../../../core/service/courses.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
import { SweetAlertUtils } from '../../../shared/utils/SweetAlert.utils';
import { AuthService } from '../../../core/service/auth.service';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';
import { SsrService } from '../../../core/service/ssr.service';

@Component({
  selector: 'app-doctors-details',
  standalone: true,
  imports: [NgIf, CoursesCardComponent, TranslateModule],
  templateUrl: './doctors-details.component.html',
  styleUrl: './doctors-details.component.scss',
})
export class DoctorsDetailsComponent implements OnInit, OnDestroy {
  isBooked = false;
  subscriptions: Subscription[] = [];
  doctor!: Doctor;
  courses: any[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  allDataLoaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorsService: DoctorsService,
    private CoursesService: CoursesService,
    public authService: AuthService,
    private globalTranslate: GlobalTranslateService,
    private ssr: SsrService
  ) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.courses = [];
    this.allDataLoaded = false;

    const win = this.ssr.getWindow();

    if (win) {
      const stateDoctor = win.history?.state?.['doctor'];

      if (stateDoctor) {
        this.doctor = stateDoctor;
        this.getDoctorCourses(this.doctor.id, this.currentPage);
      } else {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.loadDoctor(+id);
        else console.error('No doctor data found in state or route params.');
      }
    } else {
      // SSR
      const id = this.route.snapshot.paramMap.get('id');
      if (id) this.loadDoctor(+id);
    }

    //  language reload
    let firstLangChange = true;
    const langSub = this.globalTranslate.language$.subscribe((lang) => {
      if (firstLangChange) {
        firstLangChange = false;
        return;
      }
      this.resetAndReload();
    });

    this.subscriptions.push(langSub);
  }

  loadDoctor(id: number) {
    const doctorSub = this.doctorsService.getDoctors(1, id).subscribe({
      next: (data) => {
        this.doctor = data.data[0];
        this.ssr.setLocal('currentDoctor', JSON.stringify(this.doctor));

        if (this.doctor?.id) {
          this.getDoctorCourses(this.doctor.id, this.currentPage);
        } else {
          console.warn('Doctor loaded but has no ID.');
        }
      },
      error: (err) => {
        console.error('Failed to load doctor data', err);
      },
    });
    this.subscriptions.push(doctorSub);
  }

  getDoctorCourses(doctorId: number, page: number): void {
    if (this.isLoading || this.allDataLoaded) return;

    this.isLoading = true;

    const coursesSub = this.CoursesService.getCourses(
      '',
      10,
      page,
      null,
      doctorId.toString()
    ).subscribe({
      next: (res) => {
        if (res.data.length === 0 || page > res.meta.last_page) {
          this.allDataLoaded = true;
          this.isLoading = false;
          return;
        }

        if (page === 1) this.courses = res.data;
        else this.courses.push(...res.data);

        this.totalPages = +res.meta.last_page || 1;
        this.currentPage = +res.meta.current_page || page;
        this.isLoading = false;

        if (this.currentPage >= this.totalPages) this.allDataLoaded = true;
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        this.isLoading = false;
      },
    });
    this.subscriptions.push(coursesSub);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.ssr.isBrowser()) return;

    const scrollPosition = window.innerHeight + window.pageYOffset;
    const pageHeight = document.documentElement.offsetHeight;

    if (
      scrollPosition >= pageHeight - 100 &&
      !this.isLoading &&
      !this.allDataLoaded
    ) {
      this.currentPage++;
      this.getDoctorCourses(this.doctor.id, this.currentPage);
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.getDoctorCourses(this.doctor.id, this.currentPage);
  }

  onBookPrivateAppointment() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/booking'], {
        state: { doctor: this.doctor },
      });
    } else {
      SweetAlertUtils.showLoginRequired().then((result) => {
        if (result.isConfirmed) this.router.navigate(['/login']);
      });
    }
  }

  private resetAndReload(): void {
    this.courses = [];
    this.currentPage = 1;
    this.allDataLoaded = false;

    const id = this.doctor?.id || this.route.snapshot.paramMap.get('id');
    if (id) this.loadDoctor(+id);
    else console.error('❌ No doctor ID found for reload.');
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
