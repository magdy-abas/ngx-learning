import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppAccessService } from '../service/app-access.service';
import { SsrService } from '../service/ssr.service';
import { isPlatformServer } from '@angular/common';

export const headerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const translateService = inject(TranslateService);
  const appAccessService = inject(AppAccessService);
  const router = inject(Router);
  const ssr = inject(SsrService);
  const platformId = inject(PLATFORM_ID);

  let ssrLang: string | null = null;
  let ssrToken: string | null = null;

  if (isPlatformServer(platformId)) {
    try {
      ssrLang = inject('SSR_LANG' as any);
      ssrToken = inject('SSR_TOKEN' as any);
    } catch {
      ssrLang = null;
      ssrToken = null;
    }
  }

  const lang =
    ssrLang ||
    translateService.currentLang ||
    translateService.defaultLang ||
    'ar';

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': lang,
    'Accept-Browser': 'angular_website',
  };

  if (ssrToken) {
    headers['Authorization'] = `Bearer ${ssrToken}`;
  } else {
    const token = ssr.getLocal('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const modifiedReq = req.clone({ setHeaders: headers });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        ssr.setLocal('errorData', JSON.stringify(error.error));
        appAccessService.setAccess(true);
      }
      return throwError(() => error);
    })
  );
};
