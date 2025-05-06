import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatherIconModule } from './../../../shared/utils/feather-icons.utils';

import { routes } from './../../../core/service/routes/routes';
import { AuthService } from './../../../core/service/auth.service';
import { CoursesService } from './../../../core/service/courses.service';
import * as CryptoJS from 'crypto-js';
import {
  CourseContent,
  RequestJoinDto,
} from '../../../core/Dtos/courses.interface';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from './../../../shared/utils/unSubscribeObservable.utils';
import { NgFor, NgIf } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { SweetAlertUtils } from './../../../shared/utils/SweetAlert.utils';
import { CourseDetailsResponse } from '../../../core/Dtos/courses-details.models';
@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [FeatherIconModule, NgIf, NgFor, PdfViewerComponent],

  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss'],
})
export class CoursesDetailsComponent implements OnInit, OnDestroy {
  pdfUrl = '';
  showPdfViewer = false;
  currentResourceTitle = '';
  public routes = routes;
  courseDetails?: CourseDetailsResponse;
  public isLoading: boolean = true;
  public errorMessage: string = '';
  courseId!: number;
  subscriptions: Subscription[] = [];
  shapterId!: number;
  CourseSubscribe: boolean = false;
  userInfo!: any;
  resourceId!: number;
  chapterId!: number;
  public resources: any[] = [];
  isAuth!: boolean;
  reqData: RequestJoinDto = new RequestJoinDto();
  VIDEO_ENCRYPTION_KEY: string =
    'ar95ZqLTMkHUXBNj6qjP-dI4Fk6NHtWXDDgUknzCw-O9A7DsHLjWZzIbqEherP';
  VIDEO_ENCRYPTION_IV: string =
    'ItSSsudAXFSz2UVfORI4-dICms5cVBNNzrx9E7AZt-adKUG1cc30f7iEeG88Yv';

  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute,
    private _Router: Router,
    private sanitizer: DomSanitizer
  ) {}
  closePdfViewer(): void {
    this.pdfUrl = '';
    this.showPdfViewer = false;
    this.currentResourceTitle = '';
  }
  ngOnInit(): void {
    // Get course ID from route parameters
    this.isAuth = this._AuthService.isAuthenticated();
    const courseId = this._route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(+courseId);
      this.getResources(+courseId);
      this.courseId = +courseId;
      this.userInfo = this._AuthService.userData;
    } else {
      this.errorMessage = 'Invalid course ID';
      this.isLoading = false;
    }
  }
  handleResourceClick(
    chapterId: number,
    resourceId: number,
    encryptedUrl: string,
    resourceTitle: string
  ): void {
    // Set the IDs needed for decryption
    this.chapterId = chapterId;
    this.resourceId = resourceId;

    // Get and log the decrypted URL
    const decryptedUrl = this.getResourceUrl(encryptedUrl);

    if (decryptedUrl) {
      this.pdfUrl = String(decryptedUrl);
      this.currentResourceTitle = resourceTitle;
      this.showPdfViewer = true;

      // Scroll to the top
      this.scrollToTop();
    }
  }
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getResourceUrl(encryptedText: string): string {
    if (!encryptedText) return '';

    const $secret_key = `${this.userInfo.id}-${this.chapterId}-${this.VIDEO_ENCRYPTION_KEY}-${this.resourceId}-${this.userInfo.name}`;
    const $secret_iv = `${this.userInfo.id}-${this.chapterId}-${this.VIDEO_ENCRYPTION_IV}-${this.resourceId}-${this.userInfo.name}`;

    const key = CryptoJS.SHA256($secret_key)
      .toString(CryptoJS.enc.Hex)
      .substring(0, 32);
    const iv = CryptoJS.SHA256($secret_iv)
      .toString(CryptoJS.enc.Hex)
      .substring(0, 16);

    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedText,
        CryptoJS.enc.Utf8.parse(key),
        {
          iv: CryptoJS.enc.Utf8.parse(iv),
        }
      ).toString(CryptoJS.enc.Utf8);

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }

  isClientSubscribe() {
    if (this.courseDetails?.course.client_status === 'accepted') {
      this.CourseSubscribe = true;
    }
  }
  redirectToLesson(id: number, type: string, shapterId: number): void {
    if (type === 'quiz') {
      if (this._AuthService.isAuthenticated() && this.CourseSubscribe) {
        this._Router.navigate([`/auth/course-quiz/${this.courseId}/${id}`]);
      }
    }
    if (type === 'meeting') {
      if (this._AuthService.isAuthenticated() && this.CourseSubscribe) {
        this._Router.navigate([
          `/auth/course-metting/${this.courseId}/${id}/${shapterId}`,
        ]);
      }
    }
    if (type === 'video') {
    }
  }
  getDisplayIcon(lesson: any): string {
    // For free lessons,
    if (lesson.is_free) {
      return this.getLessonTypeIcon(lesson.type);
    }

    // For non-free lessons
    if (this.CourseSubscribe) {
      // If user bought the course
      return this.getLessonTypeIcon(lesson.type);
    } else {
      // If user hasn't bought the course, show lock icon
      return 'assets/img/icon/lock.svg';
    }
  }

  getLessonTypeIcon(type: string): string {
    switch (type) {
      case 'video':
        return 'assets/img/icon/play-icon.svg';
      case 'quiz':
        return 'assets/img/icon/quiz.svg';
      case 'meeting':
        return 'assets/img/icon/google-meet.svg';
      default:
        return 'assets/img/icon/lock.svg';
    }
  }
  getTotalLessons(): number {
    if (!this.courseDetails?.data) {
      return 0;
    }
    return this.courseDetails.data.reduce(
      (total, chapter) => total + (chapter.lessons?.length || 0),
      0
    );
  }

  fetchCourseDetails(courseId: number): void {
    const courseDetailsSub = this._CoursesService
      .getCoursesDetails(courseId)
      .subscribe({
        next: (data) => {
          this.courseDetails = data;

          this.isLoading = false;
          this.isClientSubscribe();
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch course details.';
          console.error(err);
          this.isLoading = false;
        },
      });

    this.subscriptions.push(courseDetailsSub);
  }

  getResources(courseId: any) {
    this._CoursesService.getResources(courseId).subscribe({
      next: (data: any) => {
        if (data.data) {
          this.resources = data.data;
          console.log('Resources loaded:', this.resources);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async buyCourse(
    event: MouseEvent,
    courseId: number | undefined,
    buyWith: string | undefined,
    client_status: string | undefined
  ): Promise<void> {
    event.stopPropagation();

    if (!this.isAuth) {
      this.confirmBox();
      return;
    }

    if (buyWith === 'by_request_course') {
      if (client_status === 'not_asked') {
        const { isConfirmed } =
          await SweetAlertUtils.showPurchaseConfirmation();

        if (isConfirmed) {
          this.reqData.course_id = courseId;
          try {
            const result = await this.sendData(buyWith);
            if (result) {
              if (this.courseDetails) {
                this.courseDetails.course.client_status = 'pending';
              }
              await SweetAlertUtils.showSuccessAlert(
                'Course request sent successfully'
              );
            }
          } catch (error) {
            await SweetAlertUtils.showErrorAlert(error as string);
          }
        }
      }
    } else if (buyWith === 'by_code') {
      const { value: code, isConfirmed } =
        await SweetAlertUtils.showCodeInputDialog();

      if (isConfirmed && code) {
        this.reqData.course_id = courseId;
        this.reqData.code = code;

        try {
          const result = await this.sendData(buyWith);
          if (result) {
            if (this.courseDetails) {
              this.courseDetails.course.client_status = 'pending';
            }
            await SweetAlertUtils.showSuccessAlert(
              'Course code verified successfully'
            );
          }
        } catch (error) {
          await SweetAlertUtils.showErrorAlert(error as string);
        }
      }
    }
  }
  confirmBox(): void {
    SweetAlertUtils.showLoginRequired().then((result) => {
      if (result.isConfirmed) {
        this._Router.navigate(['/login']);
      }
    });
  }

  sendData(buyWith: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._CoursesService.makeRequest(this.reqData).subscribe({
        next: (res) => {
          console.log(res);

          if (res.status === 1) {
            resolve(true);
          } else {
            reject(res.message as string);
          }
        },
        error: (err) => {
          console.error(err);
          // reject(false);
          reject('Something went wrong');
        },
      });
    });
  }
}
