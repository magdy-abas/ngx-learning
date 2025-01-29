import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { CoursesService } from '../../../core/service/courses.service';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild('optionsList', { static: false }) optionsList!: ElementRef;
  @ViewChild('questionRightItem', { static: false })
  questionRightItem!: ElementRef;
  question: QuizDTO = new QuizDTO();
  quizResponse!: QuizResponse;
  quizData: QuestionData[] = [];
  currentQuestion: number = 1;
  selectedAnswer: number | null = null;
  quizId: number = 0;
  constructor(
    private _AuthService: AuthService,
    private _CoursesService: CoursesService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get course ID from route
    const quizeId = this._route.snapshot.paramMap.get('id');
    if (quizeId) {
      this.getQuiz(+quizeId);
      this.quizId = +quizeId;
    }
  }

  ngAfterViewInit(): void {
    if (this.questionRightItem) {
      this.optionsList.nativeElement.classList.add('hide-content');
    }
  }

  nextQuestion(): void {
    if (this.quizResponse.can_show_answers) {
      this.currentQuestion++;
    } else {
      if (this.selectedAnswer) {
        this.question.quiz_id = this.quizId;
        this.question.answers = {
          [+this.quizData[this.currentQuestion - 1].id]: this.selectedAnswer,
        };
        this.answerQuestion(this.question);
      }
    }
  }
  getQuiz(quizId: number): void {
    const courseQuizSub = this._CoursesService.getQuiz(quizId).subscribe({
      next: (data) => {
        if (data.status === 1) {
          this.quizData = data.data;
          console.log(this.quizData);

          this.quizResponse = data;
          console.log(this.quizResponse);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  answerQuestion(question: QuizDTO): void {
    const courseAnswerSub = this._CoursesService
      .answerQuiz(question)
      .subscribe({
        next: (data) => {
          console.log(data);
          if (data.status === 1) {
            this.currentQuestion++;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
