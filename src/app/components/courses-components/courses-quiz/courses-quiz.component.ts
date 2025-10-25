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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizDTO } from '../../../core/Dtos/coursesDtos';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

import {
  QuestionData,
  QuizResponse,
} from '../../../core/interfaces/courses.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
import { DarkModeService } from '../../../core/service/dark-mode.service';
import { SsrService } from '../../../core/service/ssr.service';
@Component({
  selector: 'app-courses-quiz',
  standalone: true,
  imports: [FormsModule, NgClass, TranslateModule, NgIf, RouterLink],

  templateUrl: './courses-quiz.component.html',
  styleUrl: './courses-quiz.component.scss',
})
export class CoursesQuizComponent implements AfterViewInit, OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  quizNotAvailableMessage: string | null = null;

  // ViewChild reference for options list
  @ViewChild('optionsList') optionsList!: ElementRef;
  resultAvailableTime: string | null = null;
  awaitingResult: boolean = false;

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
  courseTitle: string = '';
  quizTitle: string = '';
  slug: string = '';

  // time quiz
  remaining_seconds: number = 0;
  formattedTime: string = '';
  private timerInterval!: any;

  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute,
    private _Router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private darkModeService: DarkModeService,
    private ssr: SsrService
  ) {}

  /**
   * Initialize component and fetch quiz data
   */
  ngOnInit() {
    this.darkModeService.applyMode();
    const slug = this._route.snapshot.paramMap.get('slug');
    if (slug) this.slug = slug;

    const quizId = this._route.snapshot.paramMap.get('quizId');

    if (quizId) {
      this.quizId = +quizId;
      this.getQuiz(this.quizId);
    }

    let state: any = {};
    if (this.ssr.isBrowser()) {
      state = history.state;
    }
    // console.log(state);

    this.courseTitle = state.courseTitle || '';
    this.quizTitle = state.quizTitle || '';

    if (state.courseTitle && state.quizTitle) {
      this.courseTitle = state.courseTitle;
      this.quizTitle = state.quizTitle;

      this.ssr.setLocal(
        'quiz_meta',
        JSON.stringify({
          courseId: this.courseId,
          courseTitle: this.courseTitle,
          quizTitle: this.quizTitle,
        })
      );
    } else {
      const saved = this.ssr.getLocal('quiz_meta');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.courseId = parsed.courseId || this.courseId;
        this.courseTitle = parsed.courseTitle || '';
        this.quizTitle = parsed.quizTitle || '';
      }
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
          const quizSub = this._CoursesService.getQuiz(this.quizId).subscribe({
            next: (res) => {
              if (res.status === 1) {
                this.quizData = res.data;
                this.quizResponse = res;

                if (res.can_show_answers) {
                  this.showResult = true;
                } else {
                  this._Router.navigate([`/course-details/${this.slug}`]);
                }
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

    if (score >= 80) {
      return true;
    }
    if (score >= 60) {
      return true;
    }

    return false;
  }

  /**
   * hanle quiz time
   */

  startCountdown(seconds: number): void {
    this.remaining_seconds = seconds;
    this.updateFormattedTime();

    this.timerInterval = setInterval(() => {
      if (this.remaining_seconds > 0) {
        this.remaining_seconds--;
        this.updateFormattedTime();
      } else {
        clearInterval(this.timerInterval);

        this.backToCourse();
      }
    }, 1000);
  }

  updateFormattedTime(): void {
    const m = Math.floor(this.remaining_seconds / 60);
    const s = this.remaining_seconds % 60;

    const minuteLabel = this.translate.instant('quiz.minute');
    const secondLabel = this.translate.instant('quiz.second');

    this.formattedTime = `${m}${minuteLabel} ${s}${secondLabel}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  /**
   * Close result view and reset quiz state
   */
  closeResult(): void {
    this._Router.navigate([`/course-details/${this.slug}`]).then(() => {
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

          if (data.can_show_answers) {
            this.showIntro = false;
            this.showResult = false;
          }

          if (!data.can_show_answers && data.is_answered) {
            this.awaitingResult = true;
            this.resultAvailableTime = data.show_answers_at;
          }

          if (
            data.remaining_seconds &&
            !data.can_show_answers &&
            !data.is_answered
          ) {
            this.startCountdown(data.remaining_seconds);
          }
        }
        if (data.status === 0) {
          this.quizNotAvailableMessage = data.message;
          this.showIntro = true;
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
    clearInterval(this.timerInterval);
    unsubscribeAll(...this.subscriptions);
  }

  backToCourse(): void {
    this._Router.navigate([`/course-details/${this.slug}`]);
  }
}
