import { Routes } from '@angular/router';
import { LayoutSelectorComponent } from './layouts/layout-selector/layout-selector.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutSelectorComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
