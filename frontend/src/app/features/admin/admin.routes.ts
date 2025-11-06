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
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'user-roles',
        loadComponent: () => import('./components/user-roles/user-roles.component').then(m => m.UserRolesComponent)
      },
      {
        path: 'user-activity',
        loadComponent: () => import('./components/user-activity/user-activity.component').then(m => m.UserActivityComponent)
      },
      {
        path: 'course-enrollment',
        loadComponent: () => import('./components/course-enrollment/course-enrollment.component').then(m => m.CourseEnrollmentComponent)
      },
      {
        path: 'assessment-assignment',
        loadComponent: () => import('./components/assessment-assignment/assessment-assignment.component').then(m => m.AssessmentAssignmentComponent)
      }
    ]
  }
];