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
    path: 'dashboard',
    loadComponent: () => import('./shared/components/dashboard-redirect/dashboard-redirect.component').then(m => m.DashboardRedirectComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'help',
    loadComponent: () => import('./shared/components/help/help.component').then(m => m.HelpComponent),
    data: { breadcrumb: 'Help & Support', icon: 'help' }
  },
  {
    path: 'report-issue',
    loadComponent: () => import('./shared/components/report-issue/report-issue.component').then(m => m.ReportIssueComponent),
    data: { breadcrumb: 'Report Issue', icon: 'bug_report' }
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];