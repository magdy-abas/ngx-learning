import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const getTranslation = (key: string, fallback: string) => {
        const translated = translate.instant(key);
        return translated && translated !== key ? translated : fallback;
      };

      const okBtn = getTranslation('errors.ok', 'حسناً');
      const cancelBtn = getTranslation('errors.cancel', 'إلغاء');

      if (!navigator.onLine) {
        Swal.fire({
          icon: 'error',
          title: getTranslation(
            'errors.noInternetTitle',
            'لا يوجد اتصال بالإنترنت'
          ),
          text: getTranslation(
            'errors.noInternetText',
            'تأكد من اتصالك وحاول مرة أخرى'
          ),
          confirmButtonText: okBtn,
        });
      } else if (error.status === 0) {
        Swal.fire({
          icon: 'error',
          title: getTranslation(
            'errors.serverUnavailableTitle',
            'الخادم غير متاح'
          ),
          text: getTranslation(
            'errors.serverUnavailableText',
            'يرجى المحاولة لاحقًا'
          ),
          confirmButtonText: okBtn,
        });
      } else if (error.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: getTranslation('errors.unauthorizedTitle', 'تم رفض الوصول'),
          text:
            error.error?.message ||
            getTranslation(
              'errors.unauthorizedText',
              'صلاحيتك غير كافية أو انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.'
            ),
          confirmButtonText: okBtn,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: getTranslation('errors.defaultTitle', 'خطأ'),
          text:
            error.error?.message ||
            getTranslation('errors.defaultText', 'حدث خطأ غير متوقع'),
          confirmButtonText: okBtn,
          showCancelButton: true,
          cancelButtonText: cancelBtn,
        });
      }

      return throwError(() => error);
    })
  );
};
