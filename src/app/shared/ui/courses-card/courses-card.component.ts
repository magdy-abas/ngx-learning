import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../utils/feather-icons.utils';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
import Swal from 'sweetalert2';
import { CoursesService } from '../../../core/service/courses.service';
import { ICourse } from '../../../core/interfaces/courses.interface';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SweetAlertUtils } from './../../utils/SweetAlert.utils';
import { TranslateModule } from '@ngx-translate/core';
import { RequestJoinDto } from './../../../core/Dtos/coursesDtos';
import { SharedService } from '../../../core/service/shared.service';
@Component({
  selector: 'app-courses-card',
  standalone: true,
  imports: [
    FeatherIconModule,
    NgFor,
    NgClass,
    CurrencyPipe,
    MatProgressBarModule,
    TranslateModule,
    NgIf,
  ],

  templateUrl: './courses-card.component.html',
  styleUrl: './courses-card.component.scss',
})
export class CoursesCardComponent implements OnInit {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _CoursesService: CoursesService,
    private _ChangeDetectorRef: ChangeDetectorRef,
    private sharedService: SharedService
  ) {}
  @Input() coursesData: any[] = [];
  @Input() fromHome: boolean = true;
  @Input() bestSelling?: boolean = false;
  @Input() version: 'v1' | 'v2' = 'v1';

  isItPending: boolean = false;

  isAuth!: boolean;
  reqData: RequestJoinDto = new RequestJoinDto();

  getFloorValue(value: number): number {
    return Math.floor(value);
  }

  ngOnInit(): void {
    this.isAuth = this._AuthService.isAuthenticated();
    this.version = this.sharedService.getHomeVersion();
  }

  goToCourse(course: any): void {
    this._Router.navigate(['/course-details', course.slug], {
      state: { id: course.id },
    });
  }

  // async buyCourse(
  //   event: MouseEvent,
  //   courseId: number,
  //   buyWith: string,
  //   client_status: string
  // ): Promise<void> {
  //   event.stopPropagation();

  //   if (!this.isAuth) {
  //     this.confirmBox();
  //     return;
  //   }

  //   if (buyWith === 'by_request_course') {
  //     const course = this.coursesData.find((c) => c.id === courseId);
  //     if (client_status === 'not_asked') {
  //       const { isConfirmed } =
  //         await SweetAlertUtils.showPurchaseConfirmation();

  //       if (isConfirmed) {
  //         this.reqData.course_id = courseId;
  //         try {
  //           const result = await this.sendData(buyWith);
  //           if (result) {
  //             course.client_status = 'pending';
  //             await SweetAlertUtils.showSuccessAlert(
  //               'Course request sent successfully'
  //             );
  //           }
  //         } catch (error) {
  //           await SweetAlertUtils.showErrorAlert(error as string);
  //         }
  //       }
  //     }
  //   } else if (buyWith === 'by_code') {
  //     const { value: code, isConfirmed } =
  //       await SweetAlertUtils.showCodeInputDialog();

  //     if (isConfirmed && code) {
  //       this.reqData.course_id = courseId;
  //       this.reqData.code = code;

  //       try {
  //         const result = await this.sendData(buyWith);
  //         if (result) {
  //           const course = this.coursesData.find((c) => c.id === courseId);
  //           course.client_status = 'pending';
  //           await SweetAlertUtils.showSuccessAlert(
  //             'Course code verified successfully'
  //           );
  //         }
  //       } catch (error) {
  //         await SweetAlertUtils.showErrorAlert(error as string);
  //       }
  //     }
  //   }
  // }

  // confirmBox(): void {
  //   SweetAlertUtils.showLoginRequired().then((result) => {
  //     if (result.isConfirmed) {
  //       this._Router.navigate(['/login']);
  //     }
  //   });
  // }

  // ngAfterViewChecked(): void {
  //   this._ChangeDetectorRef.detectChanges();
  // }

  // sendData(buyWith: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this._CoursesService.makeRequest(this.reqData).subscribe({
  //       next: (res) => {
  //         if (res.status === 1) {
  //           resolve(true);
  //         } else {
  //           reject(res.message as string);
  //         }
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         // reject(false);
  //         reject('Something went wrong');
  //       },
  //     });
  //   });
  // }
}
