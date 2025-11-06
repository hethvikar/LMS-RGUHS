import { Routes } from '@angular/router';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/company-layout/company-layout.component').then(m => m.CompanyLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.CompanyProfileComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./components/jobs/jobs.component').then(m => m.CompanyJobsComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./components/candidates/candidates.component').then(m => m.CompanyCandidatesComponent)
      },
      {
        path: 'interviews',
        loadComponent: () => import('./components/interviews/interviews.component').then(m => m.CompanyInterviewsComponent)
      },
      {
        path: 'liveinterview',
        loadComponent: () => import('./components/interviews/live-interview.component').then(m => m.LiveInterviewComponent)
      }
    ]
  }
];