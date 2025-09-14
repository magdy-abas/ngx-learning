import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IDoctor } from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-smart-courses-home-v2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './smart-courses-home-v2.component.html',
  styleUrl: './smart-courses-home-v2.component.scss',
})
export class SmartCoursesHomeV2Component {}
