export type AuthResponse = SuccessAuthResponse | ErrorAuthResponse;

export interface SuccessAuthResponse {
  status: 1;
  message: string;
  data: AuthData;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface User {
  id: number;
  first_login: boolean;
  name: string;
  phone_code: string;
  phone: string;
  email: string;
  image: string;
  categories: any[];
}

export interface ErrorAuthResponse {
  status: 0;
  message: string;
  data: ErrorAuthData;
}

export interface ErrorAuthData {
  name?: string[];
  email?: string[];
  password?: string[];
  token?: string[];
  serial_number?: string[];
  os?: string[];
  [key: string]: string[] | undefined;
}

export interface SendPinCodeSuccessResponse {
  status: 1;
  message: string;
  data: null;
}
export interface ResetPasswordSuccessResponse {
  status: 1;
  message: string;
  data: null;
}

//check

interface Settings {
  open_in_tab: boolean;
  open_in_ipad: boolean;
  ios_auth_login_with: string;
  android_auth_login_with: string;
  auth_login_with: string;
  ws_ready_to_use: boolean;
  all_verified: boolean;
}

interface Data {
  version: string;
  force_update: number;
  settings: Settings;
  app_styles: null | any;
  app_attrs: any[];
  ecommerce_status: boolean;
  select_category_in_register: boolean;
}

export interface CheckResponse {
  status: number;
  message: string;
  success: boolean;
  data: Data;
}

interface Data {
  accepted_sender_numbers: string[];
  token: string;
  user: User;
}

export interface OtpResponse {
  status: number;
  message: string;
  success: boolean;
  data: Data;
}

interface UserData {
  token: string;
  user: User;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: UserData;
}
