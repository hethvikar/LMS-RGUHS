import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'company',
    loadChildren: () => import('./features/company/company.routes').then(m => m.COMPANY_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'lms',
    loadChildren: () => import('./features/lms/lms.routes').then(m => m.LMS_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];