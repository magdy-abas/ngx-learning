import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { CoursesService } from '../../../core/service/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  QuestionData,
  QuizDTO,
  QuizResponse,
} from '../../../core/interfaces/courses.interface';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-courses-quiz',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './courses-quiz.component.html',
  styleUrl: './courses-quiz.component.scss',
})
export class CoursesQuizComponent implements AfterViewInit {
  // ViewChild reference for options list
  @ViewChild('optionsList') optionsList!: ElementRef;

  // Properties for quiz state and data
  question: QuizDTO = new QuizDTO();
  quizResponse!: QuizResponse;
  quizData: QuestionData[] = [];
  currentQuestion: number = 1;
  selectedAnswer: number | null = null;
  quizId: number = 0;
  courseId: number = 0;
  showResult: boolean = false;
  rate: boolean = true;
  showIntro: boolean = true;

  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute,
    private _Router: Router
  ) {}

  /**
   * Initialize component and fetch quiz data
   */
  ngOnInit() {
    const quizId = this._route.snapshot.paramMap.get('quizId');
    const courseId = this._route.snapshot.paramMap.get('courseId');

    courseId ? (this.courseId = +courseId) : courseId;
    if (quizId) {
      this.quizId = +quizId;
    }
  }
  startQuiz(): void {
    this.showIntro = false;
    this.getQuiz(this.quizId); // Only fetch quiz when user starts
  }
  ngAfterViewInit(): void {}

  /**
   * Check if an answer is the correct one
   */
  isCorrectAnswer(answerId: number): boolean {
    const currentQuestion = this.quizData[this.currentQuestion - 1];
    if (!currentQuestion.user_answer_data?.correct_answer) return false;

    return currentQuestion.user_answer_data.correct_answer.some(
      (answer) => answer.id === answerId
    );
  }

  /**
   * Check if an answer is wrong and was selected by user
   */
  isWrongAnswer(answerId: number): boolean {
    const currentQuestion = this.quizData[this.currentQuestion - 1];
    if (!currentQuestion.user_answer_data) return false;

    return (
      currentQuestion.user_answer_data.user_answer?.['id'] === answerId &&
      !currentQuestion.user_answer_data.is_true_answer
    );
  }

  /**
   * Check if user can proceed to next question
   */
  canProceed(): boolean {
    return this.quizResponse.can_show_answers || !!this.selectedAnswer;
  }

  /**
   * Check if current question is the last one
   */
  isLastQuestion(): boolean {
    return this.currentQuestion === this.quizData.length;
  }

  /**
   * Navigate to previous question
   */
  previousQuestion(): void {
    if (this.currentQuestion > 1) {
      this.currentQuestion--;
      this.selectedAnswer = null;
    }
  }

  /**
   * Handle next question navigation or quiz completion
   */
  nextQuestion(): void {
    if (this.quizResponse.can_show_answers) {
      if (this.currentQuestion < this.quizData.length) {
        this.currentQuestion++;
        this.selectedAnswer = null;
      } else {
        this.showResults();
      }
    } else {
      if (this.selectedAnswer) {
        this.question.quiz_id = this.quizId;
        this.question.answers = {
          [this.quizData[this.currentQuestion - 1].id]: this.selectedAnswer,
        };

        if (this.isLastQuestion()) {
          this.submitLastQuestion();
        } else {
          this.answerQuestion(this.question);
        }
      }
    }
  }

  /**
   * Submit final question and show results
   */
  submitLastQuestion(): void {
    this._CoursesService.answerQuiz(this.question).subscribe({
      next: (data) => {
        if (data.status === 1) {
          // Fetch updated quiz data with correct answers
          this._CoursesService.getQuiz(this.quizId).subscribe({
            next: (quizData) => {
              if (quizData.status === 1) {
                this.quizData = quizData.data;
                this.quizResponse = quizData;
                this.showResult = true; // Show results immediately
              }
            },
            error: (err) => console.error(err),
          });
        }
      },
      error: (err) => console.error(err),
    });
  }

  /**
   * Calculate number of correct answers
   */
  getCorrectAnswersCount(): number {
    return this.quizData.filter(
      (question) => question.user_answer_data?.is_true_answer
    ).length;
  }

  /**
   * Calculate score as percentage
   */
  getScorePercentage(): number {
    const correctAnswers = this.getCorrectAnswersCount();
    return Math.round((correctAnswers / this.quizData.length) * 100);
  }

  /**
   * Get CSS class based on score
   */
  getResultClass(): string {
    const score = this.getScorePercentage();
    if (score >= 80) return 'excellent-result';
    if (score >= 60) return 'good-result';
    return 'bad-result';
  }

  /**
   * Get feedback message based on score
   */
  getResultMessage(): string {
    const score = this.getScorePercentage();
    if (score >= 80) return 'عمل ممتاز! لقد أتقنت هذا الموضوع!';
    if (score >= 60) return 'عمل جيد! استمر في التدريب لتحسين مستواك أكثر.';
    return 'واصل التدريب! ستتحسن في المرة القادمة.';
  }

  getResulimoji(): boolean {
    const score = this.getScorePercentage();
    console.log(score);
    if (score >= 80) {
      return true;
    }
    if (score >= 60) {
      return true;
    }

    return false;
  }

  /**
   * Close result view and reset quiz state
   */
  closeResult(): void {
    this.showResult = false;
    this.currentQuestion = 1;
    this.selectedAnswer = null;
    this._Router.navigate([`auth/course-details/${this.courseId}`]);
  }

  /**
   * Show quiz results
   */
  showResults(): void {
    this.showResult = true;
  }

  /**
   * Fetch quiz data from server
   */
  getQuiz(quizId: number): void {
    this._CoursesService.getQuiz(quizId).subscribe({
      next: (data) => {
        if (data.status === 1) {
          this.quizData = data.data;
          this.quizResponse = data;

          console.log(this.quizResponse);
        }
      },
      error: (err) => console.error(err),
    });
  }

  /**
   * Submit answer to server
   */
  answerQuestion(question: QuizDTO): void {
    this._CoursesService.answerQuiz(question).subscribe({
      next: (data) => {
        if (data.status === 1) {
          this.currentQuestion++;
          this.selectedAnswer = null;
        }
      },
      error: (err) => console.error(err),
    });
  }
}
