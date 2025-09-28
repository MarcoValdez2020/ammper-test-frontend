import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/components/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'banks',
    loadComponent: () => import('./belvo/banks/components/banks-list/banks-list.component').then(c => c.BanksListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'accounts/:linkId',
    loadComponent: () => import('./belvo/accounts/components/accounts-list/accounts-list.component').then(c => c.AccountsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions/:accountId',
    loadComponent: () => import('./belvo/transactions/components/transactions-list/transactions-list.component').then(c => c.TransactionsListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
