import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/student-layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
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
        path: 'liveinterview',
        loadComponent: () => import('./components/interviews/live-interview.component').then(m => m.LiveInterviewComponent)
      },
      {
        path: 'placement-status',
        loadComponent: () => import('./components/placement-status/placement-status.component').then(m => m.StudentPlacementStatusComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./components/jobs/job-search.component').then(m => m.JobSearchComponent)
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('./components/jobs/job-details.component').then(m => m.JobDetailsComponent)
      }
    ]
  }
];