import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main-dashboard/main-dashboard.component').then(m => m.MainDashboardComponent)
  }
];