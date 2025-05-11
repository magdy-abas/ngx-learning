export interface MyCourse {
  id: number;
  title: string;
  rate: string;
  image: string;
  client_complete_percentage: string;
  complete_status: string | null;
  client_status: string;
  doctor: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface MyCoursesResponse {
  data: MyCourse[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
  status: number;
  message: string;
}
