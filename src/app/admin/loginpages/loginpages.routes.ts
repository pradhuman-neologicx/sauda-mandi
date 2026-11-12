import { Routes } from '@angular/router';
import { guestGuard } from '../../core/auth/guest-guard';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./loginpages.component').then((c) => c.LoginpagesComponent),
    children: [
      { path: '', redirectTo: 'sign_in', pathMatch: 'full' },
      {
        path: 'sign_in',
        loadComponent: () =>
          import('./signin/signin.component').then((c) => c.SigninComponent),
      },
      {
        path: 'reset-password/:id/:token',
        loadComponent: () =>
          import('./otp/otp.component').then((c) => c.OtpComponent),
      },
      {
        path: 'forgot_password',
        loadComponent: () =>
          import('./forgot-password/forgot-password.component').then(
            (c) => c.ForgotPasswordComponent,
          ),
      },
    ],
  },
];

