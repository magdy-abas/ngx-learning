import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { CoursesService } from '../../../core/service/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDTO } from '../../../core/Dtos/coursesDtos';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import {
  QuestionData,
  QuizResponse,
} from '../../../core/interfaces/courses.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
@Component({
  selector: 'app-courses-quiz',
  standalone: true,
  imports: [FormsModule, NgClass, TranslateModule],

  templateUrl: './courses-quiz.component.html',
  styleUrl: './courses-quiz.component.scss',
})
export class CoursesQuizComponent implements AfterViewInit, OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

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
    private _Router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
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

      this.getQuiz(this.quizId);
    }
  }

  startQuiz(): void {
    this.showIntro = false;
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
    const finalSub = this._CoursesService.answerQuiz(this.question).subscribe({
      next: (data) => {
        if (data.status === 1) {
          console.log('first' + data);
          console.log(data);

          // Fetch updated quiz data with correct answers
          const quizSub = this._CoursesService.getQuiz(this.quizId).subscribe({
            next: (res) => {
              if (res.status === 1) {
                this.quizData = res.data;
                this.quizResponse = res;
                this.showResult = true; // Show results
              }
            },
            error: (err) => console.error(err),
          });
          this.subscriptions.push(quizSub);
        }
      },
      error: (err) => console.error(err),
    });
    this.subscriptions.push(finalSub);
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
    if (score >= 80) {
      return this.translate.instant('quiz.result.excellent');
    }
    if (score >= 60) {
      return this.translate.instant('quiz.result.good');
    }
    return this.translate.instant('quiz.result.bad');
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
    this._Router.navigate([`/course-details/${this.courseId}`]).then(() => {
      this.resetQuiz();
    });
  }
  resetQuiz(): void {
    this.showResult = false;
    this.showIntro = true;
    this.currentQuestion = 1;
    this.selectedAnswer = null;
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
    this.spinner.show();
    const getQuizSub = this._CoursesService.getQuiz(quizId).subscribe({
      next: (data) => {
        if (data.status === 1) {
          this.quizData = data.data;
          this.quizResponse = data;

          if (this.quizResponse.can_show_answers) {
            this.showIntro = false;
          }
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
    });
    this.subscriptions.push(getQuizSub);
  }

  /**
   * Submit answer to server
   */
  answerQuestion(question: QuizDTO): void {
    const answerSub = this._CoursesService.answerQuiz(question).subscribe({
      next: (data) => {
        console.log('sec' + data);
        console.log(data);

        if (data.status === 1) {
          this.currentQuestion++;
          this.selectedAnswer = null;
        }
      },
      error: (err) => console.error(err),
    });
    this.subscriptions.push(answerSub);
  }
  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
