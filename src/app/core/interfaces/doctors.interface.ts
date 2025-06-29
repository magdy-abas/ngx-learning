export interface Doctor {
  id: number;
  bio: string;
  experience: string;
  certifications: string;
  name: string;
  courses_count: number;
  image: string;
  facebook?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  phone_number?: string | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface Links {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface DoctorsResponse {
  data: Doctor[];
  links: Links;
  meta: Meta;
  status: number;
  message: string;
}
