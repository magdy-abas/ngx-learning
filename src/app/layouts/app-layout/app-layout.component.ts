import { Component } from '@angular/core';
import { ApplicationPageComponent } from '../../components/application-page/application-page.component';
import { PublicLayoutComponent } from '../public-layout/public-layout.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [ApplicationPageComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {}
