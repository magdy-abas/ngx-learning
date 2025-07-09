import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppAccessService } from '../../core/service/app-access.service';
import { AppLayoutComponent } from '../app-layout/app-layout.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { appLayoutRoutes } from '../../core/service/routes/app-layout.routes';
import { mainRoutes } from '../../core/service/routes/main-layout.routes';
import { first } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-layout-selector',
  imports: [],
  template: ``,
})
export class LayoutSelectorComponent implements OnInit {
  private router = inject(Router);
  private appAccessService = inject(AppAccessService);

  ngOnInit(): void {
    this.appAccessService
      .access$()
      .pipe(first())
      .subscribe((hasAccess) => {
        const routes = hasAccess
          ? [
              {
                path: '',
                component: AppLayoutComponent,
                children: appLayoutRoutes,
              },
            ]
          : [
              {
                path: '',
                component: MainLayoutComponent,
                children: mainRoutes,
              },
            ];

        this.router.resetConfig(routes);
        this.router.navigateByUrl('/');
      });
  }
}
