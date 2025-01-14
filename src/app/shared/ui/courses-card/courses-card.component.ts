import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../utils/feather-icons.utils';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
import Swal from 'sweetalert2';
import { CoursesService } from '../../../core/service/courses.service';
import { RequestJoinDto } from '../../../core/interfaces/courses.interface';
@Component({
  selector: 'app-courses-card',
  standalone: true,
  imports: [RouterLink, FeatherIconModule, NgFor, NgClass, CurrencyPipe],

  templateUrl: './courses-card.component.html',
  styleUrl: './courses-card.component.scss',
})
export class CoursesCardComponent implements OnInit {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _CoursesService: CoursesService
  ) {}
  @Input() coursesData: any[] = [];
  @Input() fromHome: boolean = true;
  isAuth!: boolean;
  reqData: RequestJoinDto = new RequestJoinDto();

  getFloorValue(value: number): number {
    return Math.floor(value);
  }

  ngOnInit(): void {
    this.isAuth = this._AuthService.isAuthenticated();
  }
  buyCourse(event: MouseEvent, courseId: any, buyWith: string): void {
    event.stopPropagation();

    // Check if the user is authenticated
    if (!this.isAuth) {
      this.confirmBox();
      return;
    }

    console.log(courseId, buyWith);

    if (buyWith === 'by_request_course') {
      //logic for requset course
    } else if (buyWith === 'by_code') {
      //logic for by code
      this.reqData.course_id = courseId;
    }
  }

  confirmBox(): void {
    Swal.fire({
      title: 'Please Login to Buy the Course',

      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Go to Login',
      cancelButtonText: 'Cancel',
      width: '450px',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button',
        icon: 'custom-swal-icon',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Navigate to the login page using Angular Router
        this._Router.navigate(['/login']); // Replace '/login' with your actual login route
      }
    });
  }

  sendData() {
    this._CoursesService.makeRequest(this.reqData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
