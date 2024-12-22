import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { routes } from '../../core/service/routes/routes';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  public routes = routes;
}
