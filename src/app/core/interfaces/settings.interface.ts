export interface SettingResponse {
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
    dark_mode_logo: string | null;
    light_mode_logo: string | null;
    icon: string | null;
    application_images: (string | null)[];
    application_links: {
      app_store_url: string | null;
      google_play_url: string | null;
      huawei_url: string | null;
    };
  };
}
