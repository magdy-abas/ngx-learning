import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';

export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: headers,
  });

  return next(modifiedReq);
};
