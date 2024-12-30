import { Component, Input } from '@angular/core';
import { HomeData } from '../../data';
import { feature_instructors } from '../../../../core/service/data/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home-instructors',
  standalone: true,
  imports: [NgFor],
  templateUrl: './home-instructors.component.html',
  styleUrl: './home-instructors.component.scss',
})
export class HomeInstructorsComponent {
  public feature_instructors: feature_instructors[] = [];
  @Input() instructorsData: any[] = [];
  constructor(public data: HomeData) {
    this.feature_instructors = this.data.feature_instructors;
  }
}
