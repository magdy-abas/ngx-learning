export interface DeviceCheck {
  key: string;
  operator: '==' | 'contain' | 'start_with';
  value: string;
}

export interface AppAttr {
  category: string;
  key: string;
  value: string;
}

export interface Settings {
  open_in_tab: boolean;
  open_in_ipad: boolean;
  ios_auth_login_with: string;
  android_auth_login_with: string;
  auth_login_with: string;
  ws_ready_to_use: boolean;
  all_verified: boolean;
}

export interface CheckSecurityPointData {
  version: string;
  force_update: number;
  settings: Settings;
  device_checks: DeviceCheck[];
  custom_code: CustomCode;
  app_styles: any;
  app_attrs: AppAttr[];
  ecommerce_status: boolean;
  select_category_in_register: boolean;
}
export interface CustomCode {
  css: string | null;
  js: string | null;
}
export interface CheckSecurityPointResponse {
  status: number;
  message: string;
  success: boolean;
  data: CheckSecurityPointData;
}
