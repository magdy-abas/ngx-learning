import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DoctorsService } from '../../../core/service/doctors.service';
import { Doctor } from '../../../core/interfaces/doctors.interface';
import { NgIf } from '@angular/common';
import { CoursesCardComponent } from '../../../shared/ui/courses-card/courses-card.component';
import { CoursesService } from '../../../core/service/courses.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
import { SweetAlertUtils } from '../../../shared/utils/SweetAlert.utils';
import { AuthService } from '../../../core/service/auth.service';
import { SsrService } from '../../../core/service/ssr.service';

@Component({
  selector: 'app-doctors-details',
  standalone: true,
  imports: [NgIf, CoursesCardComponent, TranslateModule],
  templateUrl: './doctors-details.component.html',
  styleUrl: './doctors-details.component.scss',
})
export class DoctorsDetailsComponent implements OnInit, OnDestroy {
  isBooked: boolean = false;
  subscriptions: Subscription[] = [];
  doctor!: Doctor;
  courses: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  allDataLoaded: boolean = false;
  private doctorId!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorsService: DoctorsService,
    private CoursesService: CoursesService,
    private translate: TranslateService,
    public authService: AuthService,
    private ssr: SsrService
  ) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.courses = [];
    this.allDataLoaded = false;
    const stateDoctor = history.state['doctor'];

    if (stateDoctor) {
      this.doctor = stateDoctor;
      this.getDoctorCourses(this.doctor.id, this.currentPage);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadDoctor(+id);
      } else {
        console.error('No doctor data found in state or route params.');
      }
    }
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

        if (page === 1) {
          this.courses = res.data;
        } else {
          this.courses.push(...res.data);
        }

        this.totalPages = +res.meta.last_page || 1;
        this.currentPage = +res.meta.current_page || page;
        this.isLoading = false;

        if (this.currentPage >= this.totalPages) {
          this.allDataLoaded = true;
        }
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

    const win = this.ssr.getWindow();
    const doc = this.ssr.getDocument();

    if (!win || !doc) return;

    const scrollPosition = win.innerHeight + win.pageYOffset;
    const pageHeight = doc.documentElement.offsetHeight;

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
    // SweetAlertUtils.showAppointmentConfirmation(this.doctor.name).then(
    //   (result) => {
    //     if (result.isConfirmed) {
    //       this.doctorsService.BookPrivateAppointment(this.doctor.id).subscribe({
    //         next: (res) => {
    //           if (res.status === 1) {
    //             this.isBooked = true;
    //             SweetAlertUtils.showSuccessAlert(
    //               this.translate.instant('sweetalert.appointment_success')
    //             );
    //           } else {
    //             SweetAlertUtils.showBookingFailureAlert(res.message);
    //           }
    //         },
    //         error: (err) => {
    //           console.error(err);
    //           SweetAlertUtils.showErrorAlert(err.message);
    //         },
    //       });
    //     }
    //   }
    // );

    this.router.navigate(['/booking'], {
      state: { doctor: this.doctor },
    });
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
