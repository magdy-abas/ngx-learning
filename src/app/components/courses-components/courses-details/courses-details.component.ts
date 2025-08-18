import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeatherIconModule } from './../../../shared/utils/feather-icons.utils';

import { AuthService } from './../../../core/service/auth.service';
import { CoursesService } from './../../../core/service/courses.service';
import * as CryptoJS from 'crypto-js';
import { RequestJoinDto } from '../../../core/Dtos/coursesDtos';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from './../../../shared/utils/unSubscribeObservable.utils';
import {
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { SweetAlertUtils } from './../../../shared/utils/SweetAlert.utils';
import { CourseDetailsResponse } from './../../../core/interfaces/courses-details.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptionService } from '../../../core/service/encryption.service';
import { HlsPlayerComponent } from '../../hls-player/hls-player.component';
import { DoctorComment } from '../../../core/interfaces/doctor-comments';
import { DarkModeService } from '../../../core/service/dark-mode.service';

@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [
    FeatherIconModule,
    NgIf,
    NgFor,
    PdfViewerComponent,
    TranslateModule,
    HlsPlayerComponent,
    DatePipe,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    RouterLink,
  ],

  templateUrl: './courses-details.component.html',
  styleUrls: ['./courses-details.component.scss'],
})
export class CoursesDetailsComponent implements OnInit, OnDestroy {
  pdfUrl = '';
  showPdfViewer = false;
  currentResourceTitle = '';
  doctorComments: DoctorComment[] = [];
  courseProgress: number = 25;
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
  public videoUrl: string = '';
  public videoLoaded: boolean = false;
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
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private encryptionService: EncryptionService,
    private DarkModeService: DarkModeService
  ) {}
  closePdfViewer(): void {
    this.pdfUrl = '';
    this.showPdfViewer = false;
    this.currentResourceTitle = '';
  }
  ngOnInit(): void {
    this.spinner.show();
    this.DarkModeService.applyMode();
    this.isAuth = this._AuthService.isAuthenticated();
    const courseId = this._route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(+courseId);

      if (this.isAuth) {
        this.getResources(+courseId);
        this.getDoctorComments(+courseId);
        this.userInfo = this._AuthService.userData;
      }

      this.courseId = +courseId;
    } else {
      this.errorMessage = 'Invalid course ID';
      this.isLoading = false;
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isClientSubscribe() {
    if (this.courseDetails?.course.client_status === 'accepted') {
      this.CourseSubscribe = true;
    }
  }
  redirectToLesson(
    id: number,
    type: string,
    chapterId: number,
    isFree: boolean
  ): void {
    const lessonType = type.toLowerCase();

    this.videoUrl = '';
    this.videoLoaded = false;
    if (!isFree && !this._AuthService.isAuthenticated()) {
      this.confirmBox();
      return;
    }

    if (!isFree && !this.CourseSubscribe) {
      return;
    }

    switch (lessonType) {
      case 'quiz':
        this._Router.navigate([`/course-quiz/${this.courseId}/${id}`]);

        break;

      case 'video':
        this.handleVideo(id, chapterId, isFree);
        break;

      case 'meeting':
        this.handleMeeting(id, chapterId, isFree);
        break;

      default:
        console.warn('Unknown lesson type:', lessonType);
    }
  }

  getDisplayIcon(lesson: any): string {
    if (lesson.is_free || this.CourseSubscribe) {
      return lesson.type; // video | quiz | meeting
    } else {
      return 'lock';
    }
  }

  isLocked(lesson: any): boolean {
    return !(lesson.is_free || this.CourseSubscribe);
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
        next: async (data) => {
          if (!data || !data.course) {
            const result = await SweetAlertUtils.showErrorAlert(
              this.translate.instant('sweetAlerts.somethingWentWrong')
            );
            if (result.isConfirmed || result.isDismissed) {
              this.redirectToCourses();
            }
            return;
          }
          this.courseDetails = data;

          this.isLoading = false;
          this.isClientSubscribe();
        },
        error: async (err) => {
          console.error(err);
          this.isLoading = false;
          const result = await SweetAlertUtils.showErrorAlert(
            this.translate.instant('sweetAlerts.somethingWentWrong')
          );
          if (result.isConfirmed || result.isDismissed) {
            this.redirectToCourses();
          }
        },
        complete: () => {
          this.spinner.hide();
        },
      });

    this.subscriptions.push(courseDetailsSub);
  }

  redirectToCourses(): void {
    this._Router.navigate(['/courses']);
  }

  getResources(courseId: any) {
    const resourcesSub = this._CoursesService.getResources(courseId).subscribe({
      next: (data: any) => {
        if (data.data) {
          this.resources = data.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.push(resourcesSub);
  }

  getDoctorComments(courseId: number): void {
    const commentsSub = this._CoursesService
      .getDoctorComments(courseId)
      .subscribe({
        next: (response) => {
          if (response.status === 1 && response.data) {
            this.doctorComments = response.data;
          }
        },
        error: (err) => {
          console.error('Error loading doctor comments:', err);
        },
      });

    this.subscriptions.push(commentsSub);
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
                this.translate.instant('sweetAlerts.requestSuccess')
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
              this.translate.instant('sweetAlerts.codeSuccess')
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

  startFirstLesson(): void {
    if (
      !this.courseDetails ||
      !this.courseDetails.data ||
      this.courseDetails.data.length === 0
    ) {
      return;
    }

    const firstChapter = this.courseDetails.data[0];
    if (!firstChapter.lessons || firstChapter.lessons.length === 0) {
      return;
    }

    const firstLesson = firstChapter.lessons[0];

    this.redirectToLesson(
      firstLesson.id,
      firstLesson.type,
      firstChapter.id,
      firstLesson.is_free
    );
  }

  sendData(buyWith: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._CoursesService.makeRequest(this.reqData).subscribe({
        next: (res) => {
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

  //vedio
  private handleVideo(
    lessonId: number,
    chapterId: number,
    isFree: boolean
  ): void {
    const videoSub = this._CoursesService.getVideo(lessonId).subscribe({
      next: (response) => {
        if (response.status === 1 && response.data?.file_data) {
          const decryptedUrl = isFree
            ? response.data.file_data
            : this.encryptionService.decryptData(
                response.data.file_data,
                this.userInfo?.id || 0,
                chapterId,
                lessonId,
                this.userInfo?.name || 'Guest'
              );

          console.log('Decrypted Video URL:', decryptedUrl);

          this.videoUrl = decryptedUrl;
          this.videoLoaded = true;
        }
      },
      error: (err) => console.error('Error fetching video:', err),
    });
    this.subscriptions.push(videoSub);
  }

  private handleMeeting(
    lessonId: number,
    chapterId: number,
    isFree: boolean
  ): void {
    const leaveUrl = `${window.location.origin}/course-details/${this.courseId}`;

    const meetingSub = this._CoursesService
      .joinMeeting(lessonId, leaveUrl)
      .subscribe({
        next: (data) => {
          if (data.status === 1 && data.data?.join_url) {
            const decryptedJoinUrl = isFree
              ? data.data.join_url
              : this.encryptionService.decryptData(
                  data.data.join_url,
                  this.userInfo?.id,
                  chapterId,
                  lessonId,
                  this.userInfo?.name
                );

            window.open(decryptedJoinUrl, '_blank');
          }
        },
        error: (err) => console.error('Error joining meeting:', err),
      });
    this.subscriptions.push(meetingSub);
  }

  //resourses
  handleResourceClick(
    chapterId: number,
    resourceId: number,
    encryptedUrl: string,
    resourceTitle: string,
    isFree: boolean
  ): void {
    console.log('work');

    const decryptedUrl = isFree
      ? encryptedUrl
      : this.encryptionService.decryptData(
          encryptedUrl,
          this.userInfo?.id || 0,
          chapterId,
          resourceId,
          this.userInfo?.name || 'Guest'
        );
    console.log(decryptedUrl);
    if (decryptedUrl) {
      this.pdfUrl = decryptedUrl;
      this.currentResourceTitle = resourceTitle;
      this.showPdfViewer = true;
      this.scrollToTop();
    }
  }

  onQualityChanged(quality: string) {
    console.log('Quality changed to:', quality);
  }

  onPlayerReady() {
    console.log('Player is ready');
  }

  onPlayerError(error: any) {
    console.error('Player error:', error);
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
