import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./website/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./admin/loginpages/loginpages.routes').then(
        (m) => m.LOGIN_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
