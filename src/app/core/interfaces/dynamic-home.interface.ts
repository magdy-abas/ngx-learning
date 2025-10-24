export interface DynamicHomeResponse {
  data: HomeSection[];
  links: PaginationLinks;
  meta: PaginationMeta;
  status: number;
  message: string;
  contact_us: ContactUs;
  client_user_is_verified: number;
  last_version_data: LastVersionData;
}

export interface HomeSection {
  id: number;
  title: string;
  short_title: string;
  description: string;
  display_type: 'carousel' | 'grid';
  grid_columns_count: number;
  type: 'sliders' | 'doctors' | 'categories' | 'courses' | 'banar';
  data: Slider[] | Doctor[] | Category[] | Course[] | Banner[];
}

export interface Slider {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Doctor {
  id: number;
  name: string;
  courses_count: number;
  image: string;

  facebook?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  phone_number?: string | null;
}

export interface Category {
  id: number;
  slug: string;

  title: string;
  image: string;
  has_sub_categories: number;
}

export interface Course {
  id: number;
  title: string;
  rate: string;
  image: string;
  client_complete_percentage: string;
  complete_status: string | null;
  client_status: string;
  doctor: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  image: string;
  video: string | null;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ContactUs {
  email: string | null;
  whatsapp: string | null;
  call_number: string | null;
}

export interface IHomeSection {
  id: number;
  title: string;
  short_title: string;
  description: string;
  display_type: string;
  grid_columns_count: number;
  type: 'sliders' | 'courses' | 'doctors' | 'banar' | 'categories';
  data: ISlider[] | ICourse[] | IDoctor[] | ICategory[] | IBanner[];
}

export interface ISlider {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface ICourse {
  id: number;
  title: string;
  price: string;
  description: string;
  rate: string;
  image: string;
  client_complete_percentage: string;
  complete_status: string | null;
  client_status: string;
  doctor: string;
  doctor_image: string;
}

export interface IDoctor {
  id: number;
  name: string;
  courses_count: number;
  job_title: string;
  image: string;
  facebook: string | null;
  telegram: string | null;
  whatsapp: string | null;
  phone_number: string | null;
}

export interface ICategory {
  id: number;
  slug: string;

  title: string;
  image: string;
  has_sub_categories: number;
}

export interface IBanner {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  image: string;
  video: string | null;
}
// ============== V2 Interfaces ==============

export interface HomeSectionBase<T> {
  id: number;
  title: string;
  short_title: string;
  description: string;
  display_type: 'carousel' | 'grid';
  grid_columns_count: number;
  type: 'sliders' | 'doctors' | 'categories' | 'courses' | 'banar';
  data: T[];
}

// Specialized sections
export type SliderSection = HomeSectionBase<ISlider>;
export type DoctorSection = HomeSectionBase<IDoctor>;
export type CategorySection = HomeSectionBase<ICategory>;
export type BannerSection = HomeSectionBase<IBanner>;
export type CourseSection = HomeSectionBase<ICourse>;

//  response
export interface DynamicHomeResponseV2 {
  data: (
    | SliderSection
    | DoctorSection
    | CategorySection
    | BannerSection
    | CourseSection
  )[];
  links: PaginationLinks;
  meta: PaginationMeta;
  status: number;
  message: string;
  contact_us: ContactUs;
  client_user_is_verified: number;
}
export interface CoursesSection {
  data: ICourse[];
  title: string;
  short_title: string;
  description: string;
}
export interface CategoriesSection {
  title: string;
  short_title?: string;
  description?: string;
  data: ICategory[];
}
export interface DoctorsSection {
  title: string;
  short_title?: string;
  description?: string;
  data: IDoctor[];
}
export interface LastVersionData {
  version: string;
  force_update: number;
  settings: VersionSettings;
  device_checks: DeviceCheck[];
  app_styles: AppStyles;
  app_attrs: AppAttribute[];
  cookies: any | null;
  ecommerce_status: boolean;
  select_category_in_register: boolean;
  pbk: string;
  custom_code: CustomCode;
}

export interface VersionSettings {
  open_in_tab: boolean;
  open_in_ipad: boolean;
  ios_auth_login_with: string;
  android_auth_login_with: string;
  auth_login_with: string;
  ws_ready_to_use: boolean;
  all_verified: boolean;
}

export interface DeviceCheck {
  key: string;
  operator: string;
  value: string;
}

export interface AppStyles {
  [key: string]: string;
  primary_color: string;
  secondery_color: string;
}

export interface AppAttribute {
  category: string;
  key: string;
  value: string | null;
  file: string | null;
}

export interface CustomCode {
  css: string;
  js: string;
}
