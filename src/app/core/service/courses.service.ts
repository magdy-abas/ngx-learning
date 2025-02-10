import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { baseUrl, headers } from '../../environment/environment.local';
import { QuizDTO, RequestJoinDto } from '../interfaces/courses.interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  getCourses(
    searchTerms: string,
    pagination: number,
    pageNum: number
  ): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}courses?search=${searchTerms}&paginate_number=${pagination}&page=${pageNum}`
    );
  }

  getCoursesDetails(courseId: number): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}chapters/v2/unsubscribed-course-content?course_id=${courseId}`
    );
  }

  makeRequest(data: RequestJoinDto): Observable<any> {
    return this._HttpClient.post(`${baseUrl}courses/request-join`, data, {
      headers: headers,
    });
  }

  //quiz

  getQuiz(quizId: number): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}v1.0.1/lessons/questions?quiz_id=${quizId}`
    );
  }
  answerQuiz(answers: QuizDTO): Observable<any> {
    return this._HttpClient.post(`${baseUrl}v1.0.1/lessons/questions`, answers);
  }

  //metting
  joinMeeting(lessonId: number): Observable<any> {
    return this._HttpClient.post(`${baseUrl}lessons/join-meeting`, {
      meeting_id: lessonId,
    });
  }

  getResources(courseId: any): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}chapters/resources?course_id=${courseId}`
    );
  }
}
