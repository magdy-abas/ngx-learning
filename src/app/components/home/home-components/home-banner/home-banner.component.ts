import { Component, Input } from '@angular/core';

import { Banner } from '../../../../core/interfaces/dynamic-home.interface';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent {
  @Input() bannerData: Banner[] = [];
  @Input() bannerTitle: string = '';
  @Input() bannerShortTitle: string = '';
}
