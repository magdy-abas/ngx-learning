export interface Category {
  id: number;
  title: string;
  image: string;
  has_sub_categories: number;
  sub_categories?: Category[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface CategoriesResponse {
  data: Category[];
  links: Links;
  meta: Meta;
  status: number;
  message: string;
}
