import { Component, Input } from '@angular/core';
import { HomeData } from '../../data';
import { feature_instructors } from '../../../../core/service/data/data.service';
import { NgFor } from '@angular/common';
import { IDoctor } from '../../../../core/interfaces/Home.interface';
import { Doctor } from '../../../../core/Dtos/dynamic-home.models';

@Component({
  selector: 'app-home-instructors',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home-instructors.component.html',
  styleUrl: './home-instructors.component.scss',
})
export class HomeInstructorsComponent {
  public feature_instructors: feature_instructors[] = [];
  @Input() instructorsData: Doctor[] = [];
  @Input() instructorsTitle: string = '';
  @Input() instructorsShortTitle: string = '';
  constructor(public data: HomeData) {
    this.feature_instructors = this.data.feature_instructors;
  }

  ngOnInit(): void {}
}
