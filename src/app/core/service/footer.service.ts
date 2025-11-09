import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';
import {
  PageResponse,
  PagesListResponse,
} from '../interfaces/footer.interface';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  constructor(private http: HttpClient) {}

  getPage(slug: string): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${baseUrl}pages/${slug}`);
  }
  getPagesList(): Observable<PagesListResponse> {
    return this.http.get<PagesListResponse>(`${baseUrl}pages`);
  }
}
