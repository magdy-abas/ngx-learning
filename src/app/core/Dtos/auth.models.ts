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
