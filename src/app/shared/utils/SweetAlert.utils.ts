import Swal from 'sweetalert2';

// Common custom classes object
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
      title: 'Please Login to Buy the Course',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Go to Login',
      cancelButtonText: 'Cancel',
      width: '450px',
      customClass: {
        ...commonCustomClasses,
        htmlContainer: 'custom-swal-text',
        icon: 'custom-swal-icon',
      },
    });
  },

  // Course purchase related alerts
  showPurchaseConfirmation() {
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
  },

  showCodeInputDialog() {
    return Swal.fire({
      title: 'Enter Course Code',
      input: 'text',
      inputPlaceholder: 'Enter your code here',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a code!';
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
      title: 'Success!',
      text: message,
      icon: 'success',
      customClass: commonCustomClasses,
    });
  },

  // Error alerts
  showErrorAlert(errorMessage: string) {
    return Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error',
      customClass: commonCustomClasses,
    });
  },
};
