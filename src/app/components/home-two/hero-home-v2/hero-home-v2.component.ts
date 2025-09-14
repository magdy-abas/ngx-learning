import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-home-v2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './hero-home-v2.component.html',
  styleUrl: './hero-home-v2.component.scss',
})
export class HeroHomeV2Component {}
