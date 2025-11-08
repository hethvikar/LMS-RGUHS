import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        data: { breadcrumb: 'Dashboard', icon: 'dashboard' }
      },
      {
        path: 'user-management',
        loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
        data: { breadcrumb: 'User Management', icon: 'manage_accounts' }
      },
      {
        path: 'user-roles',
        loadComponent: () => import('./components/user-roles/user-roles.component').then(m => m.UserRolesComponent),
        data: { breadcrumb: 'User Roles', icon: 'badge' }
      },
      {
        path: 'user-activity',
        loadComponent: () => import('./components/user-activity/user-activity.component').then(m => m.UserActivityComponent),
        data: { breadcrumb: 'User Activity', icon: 'monitor' }
      },
      {
        path: 'course-enrollment',
        loadComponent: () => import('./components/course-enrollment/course-enrollment.component').then(m => m.CourseEnrollmentComponent),
        data: { breadcrumb: 'Course Enrollment', icon: 'how_to_reg' }
      },
      {
        path: 'assessment-assignment',
        loadComponent: () => import('./components/assessment-assignment/assessment-assignment.component').then(m => m.AssessmentAssignmentComponent),
        data: { breadcrumb: 'Assessment Assignment', icon: 'assignment_turned_in' }
      },
      {
        path: 'company-verification',
        loadComponent: () => import('./components/company-verification/company-verification.component').then(m => m.CompanyVerificationComponent),
        data: { breadcrumb: 'Company Verification', icon: 'verified' }
      },
      {
        path: 'candidate-search',
        loadComponent: () => import('./components/candidate-search/candidate-search.component').then(m => m.CandidateSearchComponent),
        data: { breadcrumb: 'Candidate Search', icon: 'person_search' }
      },
      {
        path: 'request-tracker',
        loadComponent: () => import('./components/request-tracker/request-tracker.component').then(m => m.RequestTrackerComponent),
        data: { breadcrumb: 'Request Tracker', icon: 'track_changes' }
      }
    ]
  }
];