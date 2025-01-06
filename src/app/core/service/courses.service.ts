import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';

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
}
