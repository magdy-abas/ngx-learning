import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const translateService = inject(TranslateService);
  const lang =
    translateService.currentLang || translateService.defaultLang || 'ar';

  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': lang,
    },
  });

  return next(modifiedReq);
};
