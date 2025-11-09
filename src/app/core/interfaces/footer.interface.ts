export interface PagesListResponse {
  data: PageItem[];
  status: number;
  message: string;
}
export interface PageResponse {
  data: PageItem;
  status: number;
  message: string;
}
export interface PageItem {
  id: number;
  title: string;
  slug: string;
  description: string;
}
