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

interface Event {
  id: number;
  chapter_id: number;
  title: string;
  start: string;
}

export interface MettingDateApiResponse {
  status: number;
  message: string;
  data: Event[];
}
interface Reservation {
  id: number;
  schedule_date: string;
  schedule_time: string;
  schedule_end_time: string;
  status: string;
  doctor: {
    id: number;
    name: string;
    image: string;
  };
}
export interface PrivateSession {
  id: number;
  schedule_date: string;
  schedule_time: string;
  schedule_end_time: string;
  status: string;
  doctor: {
    id: number;
    name: string;
    image: string;
  };
}

export interface Doctor {
  id: number;
  name: string;
  courses_count: number;
  bio: string;
  experience: string;
  certifications: string;
  image: string;
  facebook: string | null;
  telegram: string | null;
  whatsapp: string | null;
  phone_number: string;
}

export interface Session {
  id: number;
  doctor: Doctor;
  schedule_date: string;
  schedule_time: string;
  schedule_end_time: string;
  amount: number | null;
  status: string;
  created_at: string;
  status_title: string;
}

export interface SessionsResponse {
  status: number;
  data: {
    sessions: Session[];
  };
}
