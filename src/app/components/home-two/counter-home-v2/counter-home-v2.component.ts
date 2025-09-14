import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-counter-home-v2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './counter-home-v2.component.html',
  styleUrl: './counter-home-v2.component.scss',
})
export class CounterHomeV2Component {}
