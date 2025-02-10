import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { CoursesService } from '../../../core/service/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-courses-metting',
  standalone: true,
  imports: [],
  templateUrl: './courses-metting.component.html',
  styleUrl: './courses-metting.component.scss',
})
export class CoursesMettingComponent {
  courseId!: number;
  lessonId!: number;
  joinUrl: string = '';
  leaveUrl: string = '';
  userInfo!: any;
  shapterId!: number;
  VIDEO_ENCRYPTION_KEY =
    'ar95ZqLTMkHUXBNj6qjP-dI4Fk6NHtWXDDgUknzCw-O9A7DsHLjWZzIbqEherP';
  VIDEO_ENCRYPTION_IV =
    'ItSSsudAXFSz2UVfORI4-dICms5cVBNNzrx9E7AZt-adKUG1cc30f7iEeG88Yv';

  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute,
    private _Router: Router
  ) {}

  ngAfterViewInit(): void {
    console.log(this.getResourceUrl());
  }
  ngOnInit() {
    const mettingId = this._route.snapshot.paramMap.get('mettingId');
    const courseId = this._route.snapshot.paramMap.get('courseId');
    const shapterId = this._route.snapshot.paramMap.get('shapterId');

    courseId ? (this.courseId = +courseId) : courseId;
    shapterId ? (this.shapterId = +shapterId) : shapterId;
    if (mettingId) {
      this.lessonId = +mettingId;
    }

    this.userInfo = this._AuthService.userData;
    console.log(this._AuthService.userData);

    this.joinMeeting();
  }

  getResourceUrl(): string {
    try {
      const Utf8 = CryptoJS.enc.Utf8;

      const secretKey = `${this.userInfo.id}-${this.shapterId}-${this.VIDEO_ENCRYPTION_KEY}-${this.lessonId}-${this.userInfo.name}`;
      const secretIv = `${this.userInfo.id}-${this.shapterId}-${this.VIDEO_ENCRYPTION_IV}-${this.lessonId}-${this.userInfo.name}`;

      const key = CryptoJS.SHA256(secretKey)
        .toString(CryptoJS.enc.Hex)
        .substring(0, 32);
      const iv = CryptoJS.SHA256(secretIv)
        .toString(CryptoJS.enc.Hex)
        .substring(0, 16);

      const encryptedText =
        'f7ooGQS3AvfV9S8g/XCgrkmsclG9mUVmh9KNWhLpmLrH2hOlNd211QscOkzpREPQ/zEUughyjLieWe4P6wnTQW/Z51HMbgeYqmHV4/N5Inh8T0QbOzqEn+Yvnb/pZ7JlMqxpfIrX8Krfc12+JHqgfsSEtYWYKG2KUbAvkT0582wI151oFtuZ+kkzywwjDI3EylECY4D/ewh+idfm9n394Q=='; // النص المشفر الفعلي

      const bytes = CryptoJS.AES.decrypt(
        encryptedText,
        CryptoJS.enc.Utf8.parse(key),
        {
          iv: CryptoJS.enc.Utf8.parse(iv),
        }
      );

      const decryptedText = bytes.toString(Utf8);

      return decryptedText;
    } catch (error) {
      console.error('Error decrypting resource URL:', error);
      return '';
    }
  }

  joinMeeting(): void {
    this._CoursesService.joinMeeting(this.lessonId).subscribe({
      next: (data) => {
        if (data.status === 1) {
          console.log(data);
          this.joinUrl = data.join_url;
          this.leaveUrl = data.leave_url;
        }
      },
      error: (err) => console.error(err),
    });
  }
}
