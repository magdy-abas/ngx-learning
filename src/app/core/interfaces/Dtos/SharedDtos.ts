export interface ResponseTypeVM<T> {
  message: string;
  data: T;
}

export interface PaymentResponseVM {
  payment: Payment;
}

export interface Payment {
  id: number;
  response_url: string;
  hyperPay_view_url: string;
  tran_id: string;
  amount: number;
  created_at: string;
}
export interface UserVM {
  id: number;
  first_login: boolean;
  name: string;
  phone_code: string;
  phone: string;
  email: string;
  image: string;
}

export enum NavType {
  fixed = 1,
  normal,
}

export class navItems {
  nameAr!: string;
  nameEn!: string;
  route?: string;
  childs?: navItems[];
  queryParams?: any;
  id?: string;
}
export class NavResponse {
  id!: number;
  slug!: string;
  title!: string;
  header_menu!: NavResponseTypeEnum[];
}
export enum NavResponseTypeEnum {
  home = 'as_home_page',
  nav = 'main_header',
  footer = 'url_menu_in_footer',
  aboutPage = 'about_arabciia_menu',
}
export class TransctionVM {
  amount!: string;
  created_at!: string;
  id!: number;
  tax!: string;
  tax_percentage!: number;
  type!: TransctionType;
}

export enum TransctionType {
  ticket = 'event_ticket',
  order = 'order',
  course = 'course',
}

export class TransctionFormDto {
  country!: number;
  city_name!: string;
  city_id?: number;
  street1?: string;
  state?: string;
  zip_postal_code!: string;
  transaction_id!: number;
  payment_method!: string;
  phone_code!: number;
  phone!: number;
  address?: string;
}

export interface CountryVM {
  id: number;
  title: string;
}
export interface CityVM {
  id: number;
  title: string;
  status: number;
}
