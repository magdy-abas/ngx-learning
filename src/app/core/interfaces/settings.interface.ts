export interface SettingsResponse {
  status: number;
  message: string;
  success: boolean;
  data: {
    app_name: {
      en: string | null;
      ar: string | null;
    };
    contact_us: {
      email: string | null;
      whatsapp: string | null;
      call_number: string | null;
    };
    social: {
      facebook: string | null;
      twitter: string | null;
      instagram: string | null;
      linkedin: string | null;
      youtube: string | null;
      snapchat: string | null;
    };
    logo: string | null;
  };
}
