export interface CourseDetailsResponse {
  data: Chapter[];
  links: PaginationLinks;
  meta: PaginationMeta;
  status: number;
  message: string;
  course: Course;
  watch_settings: WatchSettings;
  client_code: string;
  protection: ProtectionSettings;
  client_name: string;
  client_phone: string;
  alert_data: AlertData;
  video_player_type: any[];
}

export interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  type: 'video' | 'quiz' | 'meeting';
  title: string;
  description: string;
  is_free: boolean;
  video_info: VideoInfo;
  quiz_info: QuizInfo;
  meeting_info: MeetingInfo;
}

// Video Info
export interface VideoInfo {
  created_at: string | null;
  is_completed: boolean;
  can_show: boolean;
  showed: number;
  url: string | null;
  watch_settings: VideoWatchSettings;
  type: string;
  video_show_type: string;
}

// Video Watch Settings
export interface VideoWatchSettings {
  watch_percentage: number;
  earbuds_only: number;
}

// Quiz Info
export interface QuizInfo {
  questions_count: number;
  is_answered: number;
  total_mark: string | number;
  correct_answers: string | number;
}

export interface MeetingInfo {
  start_at: string | null;
}

// Course Info
export interface Course {
  id: number;
  slug: string;

  title: string;
  description: string;
  way_to_by_course_in_app: string;
  price: string;
  is_reviewed: number;
  is_fav: number;
  videos_count: number;
  quiz_count: number;
  client_status: string;
  doctor: string;
  doctor_image: string;
  subscriptions_count: number;
  whatsapp_group: string | null;
  telegram_group: string | null;
  meta_keywords: any;
  meta_description: any;
}

// Watch Settings
export interface WatchSettings {
  watch_status: number;
  max_watchs_counts: number;
  watch_percentage: number;
  earbuds_only: number;
}

// Protection Settings
export interface ProtectionSettings {
  show_on_video: boolean;
  show_on_quiz: boolean;
  show_student_name: boolean;
  show_student_phone: boolean;
  show_student_data_moving: boolean;
  text_position: string;
  font_size: number | null;
  font_color: string;
  quiz_show_student_name: boolean;
  quiz_show_student_phone: boolean;
  quiz_font_size: number | null;
  quiz_font_color: string;
  quiz_degree_of_clarity: string | null;
  quiz_whatermark_repeat_number: string | null;
  quiz_whatermark_rotate: string | null;
  meeting_show_student_name: boolean;
  meeting_show_student_phone: boolean;
  meeting_font_size: number | null;
  meeting_font_color: string;
  meeting_degree_of_clarity: string | null;
  meeting_whatermark_repeat_number: string | null;
  meeting_whatermark_rotate: string | null;
  show_data_duration_by_second: number;
  tts_status: boolean;
  sound_repetition_duration_by_second: number;
  sound_repetition_power: number;
  pdf_show_student_name: boolean;
  pdf_show_student_phone: boolean;
  pdf_degree_of_clarity: string | null;
  pdf_show_new_way: boolean;
}

export interface AlertData {
  must_alert: boolean;
  alert_status: string;
  alert_message: string;
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
