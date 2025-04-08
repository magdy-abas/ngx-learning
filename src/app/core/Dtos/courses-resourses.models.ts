export interface ChapterResourcesResponse {
  data: Chapter[];
  links: PaginationLinks;
  meta: PaginationMeta;
  status: number;
  message: string;
  print_student_data_in_pdf: number;
}

// Chapter interface
export interface Chapter {
  id: number;
  title: string;
  can_download_pdf: number;
  resources: Resource[];
}

// Resource interface
export interface Resource {
  id: number;
  title: string;
  is_free: boolean;
  path: string;
  created_at: string;
}

// Pagination Links
export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

// Pagination Meta
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

// Pagination Link
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
