import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from './../../environment/environment.local';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories(withSubCategories: number, id: number): Observable<any> {
    return this.http.get(
      `${baseUrl}categories?with_sub_categories=${withSubCategories}&id=${id}`
    );
  }
}
