import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.StudentProfileComponent)
  },
  {
    path: 'applications',
    loadComponent: () => import('./components/applications/applications.component').then(m => m.StudentApplicationsComponent)
  },
  {
    path: 'interviews',
    loadComponent: () => import('./components/interviews/interviews.component').then(m => m.StudentInterviewsComponent)
  },
  {
    path: 'placement-status',
    loadComponent: () => import('./components/placement-status/placement-status.component').then(m => m.StudentPlacementStatusComponent)
  }
];