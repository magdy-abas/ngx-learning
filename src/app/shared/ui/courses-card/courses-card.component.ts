import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconModule } from '../../utils/feather-icons.utils';
import { CurrencyPipe, NgClass, NgFor } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-courses-card',
  standalone: true,
  imports: [RouterLink, FeatherIconModule, NgFor, NgClass, CurrencyPipe],
  templateUrl: './courses-card.component.html',
  styleUrl: './courses-card.component.scss',
})
export class CoursesCardComponent implements OnInit {
  constructor(private _AuthService: AuthService) {}
  @Input() coursesData: any[] = [];
  @Input() fromHome: boolean = true;
  getFloorValue(value: number): number {
    return Math.floor(value);
  }

  ngOnInit(): void {
    console.log(this._AuthService.isAuthenticated());
  }
}
