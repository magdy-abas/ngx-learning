import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { SharedService } from '../../../core/service/shared.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DynamicHomeService } from '../../../core/service/dynamic-home.service';

@Component({
  selector: 'app-smart-courses-home-v2',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './smart-courses-home-v2.component.html',
  styleUrl: './smart-courses-home-v2.component.scss',
})
export class SmartCoursesHomeV2Component implements OnInit, OnDestroy {
  kicker: string | null = null;
  title: string | null = null;
  text: string | null = null;

  img1: string | null = null;
  img2: string | null = null;

  private subscription?: Subscription;

  constructor(private DynamicHomeService: DynamicHomeService) {}

  ngOnInit(): void {
    this.subscription = this.DynamicHomeService.appAttrs$.subscribe((attrs) => {
      if (attrs.length > 0) {
        this.loadSmartData();
      }
    });
  }

  private loadSmartData(): void {
    this.kicker = this.DynamicHomeService.getAppAttrValue(
      'smart_section',
      'kicker_title'
    );
    this.title = this.DynamicHomeService.getAppAttrValue(
      'smart_section',
      'title'
    );
    this.text = this.DynamicHomeService.getAppAttrValue(
      'smart_section',
      'text'
    );

    const smartAttrs =
      this.DynamicHomeService.getAppAttrByCategory('smart_section');
    this.img1 = smartAttrs.find((attr) => attr.key === 'img1')?.file || null;
    this.img2 = smartAttrs.find((attr) => attr.key === 'img2')?.file || null;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
