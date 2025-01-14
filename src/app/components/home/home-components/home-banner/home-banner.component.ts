import { Component, Input } from '@angular/core';
import { IBanner } from '../../../../core/interfaces/Home.interface';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent {
  @Input() bannerData: IBanner[] = [];
  @Input() bannerTitle: string = '';
  @Input() bannerShortTitle: string = '';
}
