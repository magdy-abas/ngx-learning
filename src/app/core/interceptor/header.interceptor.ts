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
  const lang =
    translateService.currentLang || translateService.defaultLang || 'ar';
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return next(req);
  }

  const modifiedReq = req.clone({
    setHeaders: {
      Accept: 'application/json',
      'Accept-Language': lang,
      'Accept-Browser': 'angular_website',
    },
  });

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
