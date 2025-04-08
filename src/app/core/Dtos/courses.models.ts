export interface CoursesResponse {
  data: Course[];
  links: PaginationLinks;
  meta: PaginationMeta;
  status: number;
  message: string;
}

export interface Course {
  id: number;
  title: string;
  rate: string;
  image: string;
  client_complete_percentage: string;
  complete_status: string | null;
  client_status: 'pending' | 'not_asked' | 'accepted';
  doctor: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
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

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
export class RequestJoinDto {
  course_id?: number;
  code?: string;
}
export class QuizDTO {
  quiz_id!: number;
  answers!: { [questionNumber: number]: number };
}

//requestjoin Response
export interface RequestJoinResponse {
  status: number;
  message: string;
  data: null | any;
}

// QuizAnswerResponse
export interface QuizAnswerResponse {
  status: number;
  message: string;
  data: any[];
}
