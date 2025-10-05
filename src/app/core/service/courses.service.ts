import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';
import { CourseDetailsResponse } from '../interfaces/courses-details.interface';
import { QuizResponse } from '../interfaces/courses.interface';
import { ChapterResourcesResponse } from '../interfaces/courses-resourses.interface';
import {
  QuizAnswerResponse,
  CoursesResponse,
  RequestJoinResponse,
} from '../interfaces/courses.interface';
import { RequestJoinDto, QuizDTO } from './../Dtos/coursesDtos';
import { MyCoursesResponse } from '../interfaces/my-courses.interface';
import { DoctorCommentsResponse } from '../interfaces/doctor-comments';
import { SKIP_GLOBAL_SPINNER } from '../../shared/utils/loading.utils';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  getCourses(
    searchTerms: string,
    pagination: number,
    pageNum: number,
    category_id: string | null,
    doctor_id: string | null,
    showSpinner: boolean = true
  ): Observable<CoursesResponse> {
    let url = `${baseUrl}courses/lite?search=${searchTerms}&paginate_number=${pagination}&page=${pageNum}`;

    if (category_id) {
      url += `&category_id=${category_id}`;
    }

    if (doctor_id) {
      url += `&doctor_id=${doctor_id}`;
    }

    return this._HttpClient.get<CoursesResponse>(url, {
      context: new HttpContext().set(SKIP_GLOBAL_SPINNER, !showSpinner),
      observe: 'body' as const,
    });
    {
    }
  }

  getMyCourses(
    search?: string,
    status: string = 'all',
    paginateNumber: number = 10,
    complete_status?: string
  ): Observable<MyCoursesResponse> {
    let params = new HttpParams()
      .set('status', status)
      .set('paginate_number', paginateNumber.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (complete_status) {
      params = params.set('complete_status', complete_status);
    }

    return this._HttpClient.get<MyCoursesResponse>(
      `${baseUrl}courses/lite/my-courses/`,
      { params }
    );
  }

  getCoursesDetails(courseId: number): Observable<CourseDetailsResponse> {
    return this._HttpClient.get<CourseDetailsResponse>(
      `${baseUrl}chapters/v2/unsubscribed-course-content?course_id=${courseId}`
    );
  }
  makeRequest(data: RequestJoinDto): Observable<RequestJoinResponse> {
    return this._HttpClient.post<RequestJoinResponse>(
      `${baseUrl}courses/request-join`,
      data
    );
  }
  //quiz

  getQuiz(quizId: number): Observable<QuizResponse> {
    return this._HttpClient.get<QuizResponse>(
      `${baseUrl}v1.0.1/lessons/questions?quiz_id=${quizId}`
    );
  }

  getResources(courseId: any): Observable<ChapterResourcesResponse> {
    return this._HttpClient.get<ChapterResourcesResponse>(
      `${baseUrl}chapters/resources?course_id=${courseId}`
    );
  }

  answerQuiz(answers: QuizDTO): Observable<QuizAnswerResponse> {
    return this._HttpClient.post<QuizAnswerResponse>(
      `${baseUrl}v1.0.1/lessons/questions`,
      answers
    );
  }

  //metting
  joinMeeting(lessonId: number, leaveUrl: string): Observable<any> {
    return this._HttpClient.post(`${baseUrl}lessons/join-meeting`, {
      meeting_id: lessonId,
      leave_url: leaveUrl,
    });
  }

  //video

  getVideo(lesson_id: number): Observable<any> {
    return this._HttpClient.post(`${baseUrl}lessons/show`, {
      lesson_id: lesson_id,
      type: 'iframe',
    });
  }

  //doctor-comments
  getDoctorComments(courseId: number): Observable<DoctorCommentsResponse> {
    return this._HttpClient.get<DoctorCommentsResponse>(
      `${baseUrl}chapters/doctor-comments?course_id=${courseId}`
    );
  }
}
