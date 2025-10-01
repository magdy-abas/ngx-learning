import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from './../../environment/environment.local';
import { Observable } from 'rxjs';
import { CategoriesResponse } from '../interfaces/categories.interface';
import { SKIP_GLOBAL_SPINNER } from '../../shared/utils/loading.utils';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories(
    withSubCategories: number = 0,
    id?: number,
    page: number = 1,
    showSpinner: boolean = true
  ): Observable<CategoriesResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (withSubCategories !== undefined) {
      params = params.set('with_sub_categories', withSubCategories.toString());
    }
    if (id !== undefined) {
      params = params.set('id', id.toString());
    }

    return this.http.get<CategoriesResponse>(`${baseUrl}categories`, {
      params,
      context: new HttpContext().set(SKIP_GLOBAL_SPINNER, !showSpinner),
      observe: 'body' as const,
    });
  }
}
