export interface ICourse {
  id: number;
  title: string;
  description: string;
  intro_video: string | null;
  rate: number;
  image: string;
  buy_with_code: boolean;
  way_to_by_course_in_app: string;
  price: string | null;
  is_reviewed: number;
  is_fav: number;
  client_complete_percentage: string;
  videos_count: number;
  complete_status: string | null;
  quiz_count: number;
  chapters_count: number;
  client_status: string;
  scope_content: any[];
  doctor: string;
  subscriptions_count: number;
  doctor_image: string;
  whatsapp_group: string | null;
  telegram_group: string | null;
  category: {
    id: number;
    title: string;
    image: string;
    has_sub_categories: number;
  } | null;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface CourseResponse {
  data: ICourse[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: Meta;
  status: number;
  message: string;
}

//courses details

export interface CourseContent {
  data: Chapter[];
  links: PaginationLinks;
  meta: MetaData;
  status: number;
  message: string;
  course: CourseDetails;
  watch_settings: any;
  client_code: any;
  protection: ProtectionSettings;
  client_name: string | null;
  client_phone: string | null;
  doctor_comments: string[];
  course_whatsapp_group: string | null;
  course_telegram_group: string | null;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  type: 'video' | 'quiz';
  title: string;
  description: string;
  is_free: boolean;
  video_info: VideoInfo;
  quiz_info: QuizInfo;
  meeting_info: MeetingInfo;
}

interface VideoInfo {
  created_at: string | null;
  is_completed: boolean;
  can_show: boolean;
  showed: number;
  url: string | null;
  watch_settings: any | null;
  type: string;
  video_show_type: string;
  player: string;
}

interface QuizInfo {
  questions_count: number;
  is_answered: number;
  total_mark: string;
  correct_answers: string;
}

interface MeetingInfo {
  start_at: string | null;
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface MetaData {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  intro_video: string;
  rate: string;
  image: string;
  buy_with_code: boolean;
  way_to_by_course_in_app: string;
  price: string;
  is_reviewed: number;
  is_fav: number;
  client_complete_percentage: string;
  videos_count: number;
  complete_status: string | null;
  quiz_count: number;
  chapters_count: number;
  client_status: string;
  scope_content: any[];
  doctor: string;
  subscriptions_count: number;
  doctor_image: string;
  whatsapp_group: string | null;
  telegram_group: string | null;
  category: string | null;
}

interface ProtectionSettings {
  show_on_video: boolean;
  show_on_quiz: boolean;
  show_student_name: boolean;
  show_student_phone: boolean;
  show_student_data_moving: boolean;
  text_position: string;
  font_size: number;
  font_color: string;
  quiz_show_student_name: boolean;
  quiz_show_student_phone: boolean;
  quiz_font_size: number | null;
  quiz_font_color: string;
  quiz_degree_of_clarity: number | null;
  quiz_whatermark_repeat_number: number | null;
  quiz_whatermark_rotate: number | null;
  meeting_show_student_name: boolean;
  meeting_show_student_phone: boolean;
  meeting_font_size: number | null;
  meeting_font_color: string;
  meeting_degree_of_clarity: number | null;
  meeting_whatermark_repeat_number: number | null;
  meeting_whatermark_rotate: number | null;
  show_data_duration_by_second: number;
  tts_status: boolean;
  sound_repetition_duration_by_second: number;
  sound_repetition_power: number;
  pdf_show_student_name: boolean;
  pdf_show_student_phone: boolean;
  pdf_degree_of_clarity: number | null;
  pdf_show_new_way: boolean;
}

export interface QuizResponse {
  can_show_answers: boolean;
  data: QuestionData[];
  is_answered: boolean;
  message: string;
  remaining_seconds: number | null;
  show_answers_at: string | null;
  show_answers_in_date_status: number;
  status: any;
}

export interface QuestionData {
  id: number;
  title: string;
  image: string | null;
  Answers_count: number;
  Answers: Answer[];
  user_answer_data: UserAnswerData;
}

export interface Answer {
  id: number;
  title: string;
  image: string | null;
}

export interface UserAnswerData {
  is_answered: number;
  user_answer: Record<string, unknown>;
  correct_answer: any[];
  is_true_answer: boolean;
}
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
