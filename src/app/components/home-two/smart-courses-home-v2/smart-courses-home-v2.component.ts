import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IDoctor } from '../../../core/interfaces/dynamic-home.interface';
import { NgFor, NgIf } from '@angular/common';
import { SharedService } from '../../../core/service/shared.service';

@Component({
  selector: 'app-smart-courses-home-v2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './smart-courses-home-v2.component.html',
  styleUrl: './smart-courses-home-v2.component.scss',
})
export class SmartCoursesHomeV2Component implements OnInit {
  kicker: string | null = null;
  title: string | null = null;
  text: string | null = null;

  img1: string | null = null;
  img2: string | null = null;
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.kicker = this.sharedService.getAppAttrValue(
      'smart_section',
      'kicker_title'
    );
    this.title = this.sharedService.getAppAttrValue('smart_section', 'title');
    this.text = this.sharedService.getAppAttrValue('smart_section', 'text');

    this.img1 =
      this.sharedService
        .getAppAttrByCategory('smart_section')
        .find((attr) => attr.key === 'img1')?.file || null;

    this.img2 =
      this.sharedService
        .getAppAttrByCategory('smart_section')
        .find((attr) => attr.key === 'img2')?.file || null;
  }
}
