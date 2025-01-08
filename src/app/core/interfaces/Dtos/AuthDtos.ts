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
