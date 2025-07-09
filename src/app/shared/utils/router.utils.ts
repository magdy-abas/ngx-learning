import { Router } from '@angular/router';
import { AppLayoutComponent } from '../../layouts/app-layout/app-layout.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';

import { LayoutSelectorComponent } from '../../layouts/layout-selector/layout-selector.component';
import { first } from 'rxjs';
import { AppAccessService } from './../../core/service/app-access.service';
import { appLayoutRoutes } from '../../core/service/routes/app-layout.routes';
import { mainRoutes } from '../../core/service/routes/main-layout.routes';

export function setupDynamicRoutes(
  router: Router,
  accessService: AppAccessService
): void {
  accessService
    .access$()
    .pipe(first())
    .subscribe((hasAccess) => {
      const layoutComponent = hasAccess
        ? AppLayoutComponent
        : MainLayoutComponent;
      const layoutRoutes = hasAccess ? appLayoutRoutes : mainRoutes;

      const config = router.config;
      const selectorRoute = config.find(
        (r) => r.component === LayoutSelectorComponent
      );

      if (selectorRoute) {
        selectorRoute.children = [
          {
            path: '',
            component: layoutComponent,
            children: layoutRoutes,
          },
        ];

        router.resetConfig(config);

        const currentPath = router.url.split('?')[0].split('#')[0];
        const isRouteFound = layoutRoutes.some((route) => {
          const pathRegex = new RegExp(
            '^' +
              route.path?.replace(/:\w+/g, '[^/]+').replace(/\//g, '\\/') +
              '$'
          );
          return pathRegex.test(currentPath.replace(/^\//, ''));
        });

        if (!isRouteFound) {
          router.navigateByUrl('/', { replaceUrl: true });
        }
      }
    });
}
