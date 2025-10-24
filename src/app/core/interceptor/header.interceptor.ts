import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, PLATFORM_ID, Inject, Optional } from '@angular/core';
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

  // ✅ نحاول نقرأ اللغة اللي السيرفر مررها وقت SSR (لو فيه)
  let ssrLang: string | null = null;
  try {
    ssrLang = inject('SSR_LANG' as any);
  } catch {
    ssrLang = null;
  }

  // ✅ نحدد اللغة المناسبة
  const lang =
    ssrLang ||
    translateService.currentLang ||
    translateService.defaultLang ||
    'ar';

  // ✅ لو السيرفر، نضيف الهيدر ونكمل
  if (isPlatformServer(platformId)) {
    const modifiedReq = req.clone({
      setHeaders: {
        Accept: 'application/json',
        'Accept-Language': lang,
        'Accept-Browser': 'angular_website',
      },
    });
    return next(modifiedReq);
  }

  // ✅ لو في المتصفح، نضيف نفس الهيدر عادي
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
