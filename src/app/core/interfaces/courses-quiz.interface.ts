export interface QuizResponse {
  data: Question[];
  status: number;
  remaining_seconds: number | null;
  message: string;
  show_answers_in_date_status: number;
  show_answers_at: string | null;
  can_show_answers: boolean;
  is_answered: boolean;
}

// Question interface
export interface Question {
  id: number;
  title: string;
  image: string | null;
  Answers_count: number;
  Answers: Answer[];
  user_answer_data: UserAnswerData;
}

// Answer interface
export interface Answer {
  id: number;
  title: string;
  image: string | null;
}

// User Answer Data interface
export interface UserAnswerData {
  is_answered: number;
  user_answer: Answer | null;
  correct_answer: Answer[];
  is_true_answer: boolean;
}
