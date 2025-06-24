import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const headerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const translateService = inject(TranslateService);
  const router = inject(Router);

  const lang =
    translateService.currentLang || translateService.defaultLang || 'ar';

  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': lang,
      'Accept-Browser': 'angular_website',
    },
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        router.navigate(['/app']);
      }
      return throwError(() => error);
    })
  );
};
