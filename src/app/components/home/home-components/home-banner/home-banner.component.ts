import { Component, Input } from '@angular/core';
import { IBanner } from '../../../../core/Dtos/dynamic-home.models';
import { Banner } from '../../../../core/Dtos/dynamic-home.models';

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
