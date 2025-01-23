import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { baseUrl } from '../../environment/environment.local';
import { Observable, throwError } from 'rxjs';
import { retryWhen, delay, take, tap, switchMap } from 'rxjs/operators';
import { SharedService } from '../service/shared.service';

export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const sharedService = inject(SharedService);

  if (req.url === `${baseUrl}mobile-versions/last-version`) {
    return next(req);
  }

  // Skip security check if already initialized and secure
  if (sharedService.isInitialized() && sharedService.getSecurityStatus()) {
    return next(req);
  }

  return sharedService.initialized$.pipe(
    take(1), // Only take first emission

    tap((initialized) => {
      if (!initialized) {
        throw new Error('Waiting for initialization');
      }
    }),
    retryWhen((errors) =>
      errors.pipe(
        delay(100),
        take(20) // Reduced retry attempts
      )
    ),
    switchMap(() => {
      if (sharedService.getSecurityStatus()) {
        return next(req);
      }
      return throwError(() => new Error('Security check failed'));
    })
  );
};
