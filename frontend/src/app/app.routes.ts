import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES),
    data: { breadcrumb: 'Home', icon: 'home' }
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    data: { breadcrumb: 'Authentication', icon: 'security' }
  },
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Dashboard', icon: 'dashboard' }
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Student Portal', icon: 'school' }
  },
  {
    path: 'company',
    loadChildren: () => import('./features/company/company.routes').then(m => m.COMPANY_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Company Portal', icon: 'business' }
  },
  {
    path: 'lms',
    loadChildren: () => import('./features/lms/lms.routes').then(m => m.LMS_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Learning Management System', icon: 'menu_book' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { breadcrumb: 'Administration', icon: 'admin_panel_settings' }
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];