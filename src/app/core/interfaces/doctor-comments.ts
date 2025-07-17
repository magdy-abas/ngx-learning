export interface DoctorComment {
  id: number;
  comment: string;
  created_at: string;
}

export interface DoctorCommentsLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface DoctorCommentsMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface DoctorCommentsMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: DoctorCommentsMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface DoctorCommentsResponse {
  data: DoctorComment[];
  links: DoctorCommentsLinks;
  meta: DoctorCommentsMeta;
  status: number;
  message: string;
}
