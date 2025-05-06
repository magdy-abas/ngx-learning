import { UserVM } from './SharedDtos';

export class RegisterDto {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  token?: string;
  serial_number?: string;
  os?: string;
}
export class LoginDto {
  email?: string;
  password?: string;
  token?: string;
  serial_number?: string;
  os?: string;
}

export interface loginVM {
  token: string;
  user: UserVM;
}

export interface RegisterVM {
  token: string;
  user: UserVM;
}

export interface UserData {
  id: number;
  first_login: boolean;
  name: string;
  phone_code: string;
  phone: string;
  email: string;
  image: string;
  categories: any[];
}
export class ResetPasswordDto {
  email?: string;
  pin_code?: string;
  password?: string;
  password_confirmation?: string;
}
export class sendPinCodeDto {
  email?: string;
}

// with watsapp Dtos

export class WatsLoginDto {
  phone_code?: string;
  mobile?: string;
  otp?: string;
  token?: string;
  serial_number?: string;
  os?: string;
}
export class SendOtpDto {
  phone_code?: string;
  mobile?: string;
  serial_number?: string;
  os?: string;
}
