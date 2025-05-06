export class RequestJoinDto {
  course_id?: number;
  code?: string;
}

export class QuizDTO {
  quiz_id!: number;
  answers!: { [questionNumber: number]: number };
}
