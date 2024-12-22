import { Component } from '@angular/core';
import { FeatherIconModule } from './../../shared/utils/feather-icons.utils';
import { RouterLink } from '@angular/router';
import { routes } from '../../core/service/routes/routes';

@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [FeatherIconModule, RouterLink],
  templateUrl: './courses-details.component.html',
  styleUrl: './courses-details.component.scss',
})
export class CoursesDetailsComponent {
  public routes = routes;
}
