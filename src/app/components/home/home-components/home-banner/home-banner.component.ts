import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss',
})
export class HomeBannerComponent {
  @Input() bannerData: any[] = [];
  @Input() bannerTitle: string = '';
  @Input() bannerShortTitle: string = '';

  ngOnInit(): void {
    console.log(this.bannerData);
  }
}
