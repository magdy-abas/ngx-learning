import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SKIP_GLOBAL_SPINNER } from '../../shared/utils/loading.utils';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  if (req.context.get(SKIP_GLOBAL_SPINNER)) {
    return next(req);
  }

  if (activeRequests === 0) {
    spinner.show();
  }
  activeRequests++;

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        spinner.hide();
      }
    })
  );
};
