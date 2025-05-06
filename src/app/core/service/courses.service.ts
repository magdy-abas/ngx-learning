import { HttpClient } from '@angular/common/http';
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
@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  getCourses(
    searchTerms: string,
    pagination: number,
    pageNum: number
  ): Observable<CoursesResponse> {
    return this._HttpClient.get<CoursesResponse>(
      `${baseUrl}courses/lite?search=${searchTerms}&paginate_number=${pagination}&page=${pageNum}`
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
  joinMeeting(lessonId: number): Observable<any> {
    return this._HttpClient.post(`${baseUrl}lessons/join-meeting`, {
      meeting_id: lessonId,
    });
  }
}
