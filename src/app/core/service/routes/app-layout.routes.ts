import { Routes } from '@angular/router';

export const appLayoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../../../components/application-page/application-page.component'
      ).then((m) => m.ApplicationPageComponent),
    title: 'application',
  },
];
