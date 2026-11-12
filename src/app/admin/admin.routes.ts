import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./admin.component').then((c) => c.AdminComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (c) => c.DashboardComponent,
          ),
      },
      {
        path: 'firm-management',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./firm-management/firm-management.component').then(
            (c) => c.FirmManagementComponent,
          ),
      },
      {
        path: 'party-ledger',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./party-ledger/party-ledger.component').then(
            (c) => c.PartyLedgerComponent,
          ),
      },
      {
        path: 'sauda-management',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./sauda-management/sauda-management.component').then(
            (c) => c.SaudaManagementComponent,
          ),
      },
      {
        path: 'truck-management',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./truck-management/truck-management.component').then(
            (c) => c.TruckManagementComponent,
          ),
      },
      {
        path: 'inventory-management',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inventory', pathMatch: 'full' },
          {
            path: 'categories',
            loadComponent: () =>
              import('./inventory-management/categories/categories.component').then(
                (c) => c.CategoriesComponent,
              ),
          },
          {
            path: 'product-master',
            loadComponent: () =>
              import('./inventory-management/product-master/product-master.component').then(
                (c) => c.ProductMasterComponent,
              ),
          },
          {
            path: 'inventory',
            loadComponent: () =>
              import('./inventory-management/inventory/inventory.component').then(
                (c) => c.InventoryComponent,
              ),
          },
        ],
      },
      {
        path: 'event-category',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./event-category/event-category.component').then(
            (c) => c.EventCategoryComponent,
          ),
      },
    ],
  },
];
