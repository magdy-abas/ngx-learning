interface UserData {
  id: number;
  first_login: boolean;
  name: string;
  phone_code: string;
  phone: string;
  email: null | string;
  image: string;
  categories: any[];
}

export interface UpdateInfoResponse {
  readonly status: number;
  message: string;
  data: UserData;
}
