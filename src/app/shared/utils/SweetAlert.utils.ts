import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

let translateService: TranslateService;

export function initSweetAlertTranslations(translate: TranslateService) {
  translateService = translate;
}

const commonCustomClasses = {
  popup: 'custom-swal-popup',
  title: 'custom-swal-title',
  confirmButton: 'custom-swal-confirm-button',
  cancelButton: 'custom-swal-cancel-button',
};

export const SweetAlertUtils = {
  // Auth related alerts
  showLoginRequired() {
    return Swal.fire({
      title: translateService.instant('sweetalert.login.title'),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: translateService.instant('sweetalert.login.confirm'),
      cancelButtonText: translateService.instant('sweetalert.login.cancel'),
      width: '450px',
      customClass: {
        ...commonCustomClasses,
        htmlContainer: 'custom-swal-text',
        icon: 'custom-swal-icon',
      },
    });
  },

  showPurchaseConfirmation() {
    if (!translateService) {
      console.error('TranslateService not initialized in SweetAlert utils');

      return Swal.fire({
        title: 'Confirm Purchase',
        text: 'Are you sure you want to buy this course?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Buy it!',
        cancelButtonText: 'Cancel',
        width: '450px',
        customClass: commonCustomClasses,
      });
    }

    return Swal.fire({
      title: translateService.instant('sweetalert.purchase.title'),
      text: translateService.instant('sweetalert.purchase.text'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: translateService.instant(
        'sweetalert.purchase.confirm'
      ),
      cancelButtonText: translateService.instant('sweetalert.purchase.cancel'),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showCodeInputDialog() {
    return Swal.fire({
      title: translateService.instant('sweetalert.code.title'),
      input: 'text',
      inputPlaceholder: translateService.instant('sweetalert.code.placeholder'),
      showCancelButton: true,
      confirmButtonText: translateService.instant('sweetalert.code.confirm'),
      cancelButtonText: translateService.instant('sweetalert.code.cancel'),
      inputValidator: (value) => {
        if (!value) {
          return translateService.instant('sweetalert.code.error');
        }
        return null;
      },
      width: '450px',
      customClass: {
        ...commonCustomClasses,
        input: 'custom-swal-input',
      },
    });
  },

  // Success alerts
  showSuccessAlert(message: string) {
    return Swal.fire({
      title: translateService.instant('sweetalert.success.title'),
      text: message,
      icon: 'success',
      customClass: commonCustomClasses,
    });
  },

  // Error alerts
  showErrorAlert(errorMessage: string) {
    return Swal.fire({
      title: translateService.instant('sweetalert.error.title'),
      text: errorMessage,
      icon: 'error',
      confirmButtonText: translateService.instant('sweetalert.error.confirm'),
      customClass: commonCustomClasses,
    });
  },

  showSearchDialog() {
    return Swal.fire({
      title: translateService.instant('sweetAlerts.search.title'),
      input: 'text',
      inputPlaceholder: translateService.instant(
        'sweetAlerts.search.placeholder'
      ),
      showCancelButton: true,
      confirmButtonText: translateService.instant('sweetAlerts.search.confirm'),
      cancelButtonText: translateService.instant('sweetAlerts.search.cancel'),
      inputValidator: (value) => {
        if (!value) {
          return translateService.instant('sweetAlerts.search.error');
        }
        return null;
      },
      width: '450px',
      customClass: {
        ...commonCustomClasses,
        input: 'custom-swal-input',
      },
    });
  },

  showAppointmentConfirmation(doctorName: string) {
    return Swal.fire({
      title: translateService.instant('sweetalert.appointment.title', {
        doctor: doctorName,
      }),
      text: translateService.instant('sweetalert.appointment.text'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: translateService.instant(
        'sweetalert.appointment.confirm'
      ),
      cancelButtonText: translateService.instant(
        'sweetalert.appointment.cancel'
      ),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showBookingFailureAlert(message: string) {
    return Swal.fire({
      text: message,
      icon: 'info',
      confirmButtonText: translateService.instant('sweetalert.error.confirm'),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showSubmissionSuccess(message: string) {
    return Swal.fire({
      icon: 'success',
      title: translateService.instant('sweetalert.success.title'),
      text: message,
      confirmButtonText: translateService.instant('sweetalert.ok'),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showCoursePurchaseRequired() {
    return Swal.fire({
      title: translateService.instant(
        'sweetalert.coursePurchaseRequired.title'
      ),
      text: translateService.instant('sweetalert.coursePurchaseRequired.text'),
      icon: 'warning',
      confirmButtonText: translateService.instant(
        'sweetalert.coursePurchaseRequired.confirm'
      ),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showFreeContentLoginRequired() {
    return Swal.fire({
      title: translateService.instant('sweetalert.freeLogin.title'),
      text: translateService.instant('sweetalert.freeLogin.text'),
      icon: 'info',
      confirmButtonText: translateService.instant(
        'sweetalert.freeLogin.confirm'
      ),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showContentUnavailable() {
    return Swal.fire({
      title:
        translateService.instant('contentUnavailable.title') ||
        'المحتوى غير متاح',
      text:
        translateService.instant('contentUnavailable.text') ||
        'عذرًا، لم نتمكن من عرض هذا المحتوى حاليًا. يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.',
      icon: 'error',
      confirmButtonText:
        translateService.instant('contentUnavailable.confirm') || 'حسنًا',
      width: '450px',
      customClass: commonCustomClasses,
    });
  },

  showBookingSuccess(request: any) {
    return Swal.fire({
      icon: 'success',
      title: translateService.instant('sweetalert.success.title'),
      html: `
      <p>${translateService.instant('sweetalert.bookingSuccess', {
        doctor: request.doctor.name,
      })}</p>
      <p><strong>${request.schedule_date}</strong> - ${
        request.schedule_time
      }</p>
      <p class="mt-2 text-muted">${translateService.instant(
        'sweetalert.amount'
      )}: ${request.amount}</p>
    `,
      confirmButtonText: translateService.instant('sweetalert.ok'),
      width: '500px',
      customClass: commonCustomClasses,
    });
  },

  showAlert({
    title,
    message,
    type = 'info',
  }: {
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning' | 'question';
  }) {
    return Swal.fire({
      text: message,
      icon: type,
      confirmButtonText: translateService.instant('sweetalert.ok'),
      width: '450px',
      customClass: commonCustomClasses,
    });
  },
};
