



export class routes {
  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }
  public static get instructor(): string {
    return this.baseUrl + '/instructor/';
  }
  public static get students(): string {
    return this.baseUrl + '/student/';
  }
  public static get pages(): string {
    return this.baseUrl + '/pages/';
  }
  public static get blog(): string {
    return this.baseUrl + '/blog/';
  }
  public static get auth(): string {
    return this.baseUrl + '/auth/';
  }
  public static get error(): string {
    return this.baseUrl + '/error/';
  }
  public static get home(): string {
    return this.baseUrl + '/home';
  }
  public static get home2(): string {
    return this.baseUrl + '/home-two';
  }
  public static get home3(): string {
    return this.baseUrl + '/home-three';
  }
  public static get home4(): string {
    return this.baseUrl + '/home-four';
  }
  // Instructor Routings
  public static get instructor_dashboard(): string {
    return this.instructor + 'instructor-dashboard';
  }
  public static get dashboard_instructor(): string {
    return this.instructor + 'dashboard-instructor';
  }
  public static get instructor_chat(): string {
    return this.instructor + 'instructor-chat';
  }
  public static get instructor_deposit_dashboard(): string {
    return this.instructor + 'deposit-instructor-dashboard';
  }
  public static get instructor_list(): string {
    return this.instructor + 'instructor-view/instructor-list';
  }
  public static get instructor_grid(): string {
    return this.instructor + 'instructor-view/instructor-grid';
  }
  public static get instructor_course(): string {
    return this.instructor + 'instructor-course';
  }
  public static get instructor_reviews(): string {
    return this.instructor + 'instructor-reviews';
  }
  public static get instructor_student_grid(): string {
    return this.instructor + 'instructor-student-grid';
  }
  public static get instructor_student_list(): string {
    return this.instructor + 'instructor-student-list';
  }
  public static get instructor_earnings(): string {
    return this.instructor + 'instructor-earnings';
  }
  public static get instructor_orders(): string {
    return this.instructor + 'instructor-orders';
  }
  public static get instructor_payouts(): string {
    return this.instructor + 'instructor-payouts';
  }
  public static get instructor_new_tickets(): string {
    return this.instructor + 'instructor-new-tickets';
  }
  public static get instructor_tickets(): string {
    return this.instructor + 'instructor-tickets';
  }
  public static get instructor_edit_profile(): string {
    return this.instructor + 'instructor-edit-profile';
  }
  public static get instructor_security(): string {
    return this.instructor + 'instructor-security';
  }
  public static get instructor_social_profiles(): string {
    return this.instructor + 'instructor-social-profiles';
  }
  public static get instructor_notification(): string {
    return this.instructor + 'instructor-notification';
  }
  public static get instructor_profile_privacy(): string {
    return this.instructor + 'instructor-profile-privacy';
  }
  public static get instructor_delete_profile(): string {
    return this.instructor + 'instructor-delete-profile';
  }
  public static get instructor_linked_account(): string {
    return this.instructor + 'instructor-linked-account';
  }
  public static get instructor_instructor_profile(): string {
    return this.instructor + 'instructor-profile';
  }
  public static get instructor_withdrawal_instructor(): string {
    return this.instructor + 'withdrawal-instructor';
  }
  public static get instructor_deposit_instructor(): string {
    return this.instructor + 'deposit-instructor';
  }
  public static get instructor_transactions_instructor(): string {
    return this.instructor + 'transactions-instructor';
  }
  // Student Routings

  public static get students_list(): string {
    return this.students + 'student-view/students-list';
  }
  public static get students_grid(): string {
    return this.students + 'student-view/students-grid';
  }
  public static get students_edit_profile(): string {
    return this.students + 'setting-edit-profile';
  }
  public static get students_profile(): string {
    return this.students + 'student-profile';
  }
  public static get deposit_student_dashboard(): string {
    return this.students + 'deposit-student-dashboard';
  }  
  public static get deposit_student(): string {
    return this.students + 'deposit-student';
  }  
  public static get course_student(): string {
    return this.students + 'course-student';
  }
  public static get view_invoice_student(): string {
    return this.students + 'view-invoice';
  }
  public static get transactions_student(): string {
    return this.students + 'transactions-student';
  }
  public static get students_security(): string {
    return this.students + 'setting-student-security';
  }
  public static get students_social_profile(): string {
    return this.students + 'setting-student-social-profile';
  }
  public static get students_notification(): string {
    return this.students + 'setting-student-notification';
  }
  public static get students_privacy(): string {
    return this.students + 'setting-student-privacy';
  }
  public static get students_delete(): string {
    return this.students + 'setting-student-delete-profile';
  }
  public static get students_accounts(): string {
    return this.students + 'setting-student-accounts';
  }
  public static get students_referral(): string {
    return this.students + 'setting-student-referral';
  }
  public static get students_subscription(): string {
    return this.students + 'setting-student-subscription';
  }
  public static get students_billing(): string {
    return this.students + 'setting-student-billing';
  }
  public static get students_payments(): string {
    return this.students + 'setting-student-payment';
  }
  public static get students_invoice(): string {
    return this.students + 'setting-student-invoice';
  }
  public static get students_tickets(): string {
    return this.students + 'setting-support-tickets';
  }

  // Pages Routing

  public static get page_notifications(): string {
    return this.pages + 'notifications';
  }
  public static get page_pricing_plan(): string {
    return this.pages + 'pricing-plan';
  }
  public static get page_wishlist(): string {
    return this.pages + 'wishlist';
  }
  public static get page_faq(): string {
    return this.pages + 'faq';
  }
  public static get page_support(): string {
    return this.pages + 'support';
  }
  public static get page_job_category(): string {
    return this.pages + 'job-category';
  }
  public static get page_cart(): string {
    return this.pages + 'cart';
  }
  public static get page_checkout(): string {
    return this.pages + 'checkout';
  }
  public static get page_purchase_history(): string {
    return this.pages + 'purchase-history';
  }
  public static get page_course_details(): string {
    return this.pages + 'course/course-details';
  }
  public static get page_course_message(): string {
    return this.pages + 'course/course-message';
  }
  public static get page_course_course_lesson(): string {
    return this.pages + 'course/course-lesson';
  }
  public static get page_course_grid(): string {
    return this.pages + 'course/course-grid';
  }
  public static get page_course_course_wishlist(): string {
    return this.pages + 'course/course-wishlist';
  }
  public static get page_course_list(): string {
    return this.pages + 'course/course-list';
  }
  public static get page_add_course(): string {
    return this.pages + 'course/add-course';
  }
  public static get page_term_condition(): string {
    return this.pages + 'term-condition';
  }
  public static get page_privacy_policy(): string {
    return this.pages + 'privacy-policy';
  }
  public static get page_verification_code(): string {
    return this.pages + 'verification-code';
  }

  // Auth Routes

  public static get forgot_password(): string {
    return this.auth + 'forgot-password';
  }
  public static get login(): string {
    return this.auth + 'login';
  }
  public static get register(): string {
    return this.auth + 'register-page/register';
  }
  public static get register3(): string {
    return this.auth + 'register-page/register-step-three';
  }
  public static get register2(): string {
    return this.auth + 'register-page/register-step-two';
  }
  public static get register5(): string {
    return this.auth + 'register-page/register-step-five';
  }
  public static get register1(): string {
    return this.auth + 'register-page/register-step-one';
  }

  // Error

  public static get under_construction(): string {
    return this.error + 'under-construction';
  }
  public static get error_five(): string {
    return this.error + '500';
  }
  public static get comming_soon(): string {
    return this.error + 'come-soon';
  }
  public static get error_fof(): string {
    return this.error + '404';
  }

  // Blog

  public static get blog_details(): string {
    return this.blog + 'blog-details';
  }
  public static get blog_modern(): string {
    return this.blog + 'blog-modern';
  }
  public static get blog_masonry(): string {
    return this.blog + 'blog-masonry';
  }
  public static get blog_grid(): string {
    return this.blog + 'blog-grid';
  }
  public static get blog_list(): string {
    return this.blog + 'blog-list';
  }
}
