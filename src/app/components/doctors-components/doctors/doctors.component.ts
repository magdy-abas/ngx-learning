import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DoctorsService } from './../../../core/service/doctors.service';
import {
  Doctor,
  DoctorsResponse,
} from './../../../core/interfaces/doctors.interface';

import Aos from 'aos';
import { HomeInstructorsComponent } from '../../home/home-components/home-instructors/home-instructors.component';
import { Subscription } from 'rxjs';
import { unsubscribeAll } from '../../../shared/utils/unSubscribeObservable.utils';
import { NgIf } from '@angular/common';
import { GlobalTranslateService } from '../../../core/service/global-translate.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [HomeInstructorsComponent, NgIf],

  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
})
export class DoctorsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  doctors: Doctor[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  isLoading: boolean = false;
  firstLoad = true;
  private globalTranslate = inject(GlobalTranslateService);

  private _doctorsService = inject(DoctorsService);

  ngOnInit(): void {
    this.getDoctors();
    let firstLangChange = true;

    const langSub = this.globalTranslate.language$.subscribe((lang) => {
      if (firstLangChange) {
        firstLangChange = false;
        return;
      }

      this.resetAndLoad();
    });

    this.subscriptions.push(langSub);

    Aos.init({
      duration: 1200,
      once: true,
    });
  }

  getDoctors(page: number = this.currentPage): void {
    if (this.isLoading || this.currentPage > this.lastPage) return;

    this.isLoading = true;

    const doctorSub = this._doctorsService
      .getDoctors(page, undefined, this.firstLoad)
      .subscribe({
        next: (res: DoctorsResponse) => {
          this.doctors = [...this.doctors, ...res.data];
          this.lastPage = res.meta.last_page;
          this.currentPage++;
          this.isLoading = false;
          this.firstLoad = false;
        },
        error: (error) => {
          console.error('Error fetching doctors:', error);
          this.isLoading = false;
          this.firstLoad = false;
        },
      });
    this.subscriptions.push(doctorSub);
  }

  private resetAndLoad(): void {
    this.doctors = [];
    this.currentPage = 1;
    this.lastPage = 1;
    this.firstLoad = true;
    this.getDoctors();
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
