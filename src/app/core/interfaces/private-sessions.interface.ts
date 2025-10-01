export interface AvailableDatesResponse {
  status: number;
  message: string;
  success: boolean;
  data: string[];
}

export interface AvailableTimesResponse {
  status: number;
  message: string;
  success: boolean;
  data: any[];
}

export interface BookSessionResponse {
  status: number;
  message: string;
  data: {
    payment_url: string;
    request: {
      id: number;
      doctor: {
        id: number;
        name: string;
        courses_count?: number;
        bio?: string;
        experience?: string;
        certifications?: string;
        image?: string;
        facebook?: string | null;
        telegram?: string | null;
        whatsapp?: string | null;
        phone_number?: string | null;
      };
      schedule_date: string;
      schedule_time: string;
      amount: number;
      status: string;
      created_at: string;
    };
  };
}
