import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../utils/feather-icons.utils';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-courses-card',
  standalone: true,
  imports: [RouterLink, FeatherIconModule, NgFor, NgClass],
  templateUrl: './courses-card.component.html',
  styleUrl: './courses-card.component.scss',
})
export class CoursesCardComponent implements OnInit {
  @Input() coursesData: any[] = [];
  @Input() fromHome: boolean = true;

  ngOnInit(): void {
    console.log('Received coursesData:', this.coursesData);
  }
}
