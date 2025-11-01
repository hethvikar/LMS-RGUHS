import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
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
    path: 'users',
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'roles',
    loadComponent: () => import('./components/user-roles/user-roles.component').then(m => m.UserRolesComponent)
  },
  {
    path: 'activity',
    loadComponent: () => import('./components/user-activity/user-activity.component').then(m => m.UserActivityComponent)
  },
  {
    path: 'enrollment',
    loadComponent: () => import('./components/course-enrollment/course-enrollment.component').then(m => m.CourseEnrollmentComponent)
  },
  {
    path: 'assessment-assignment',
    loadComponent: () => import('./components/assessment-assignment/assessment-assignment.component').then(m => m.AssessmentAssignmentComponent)
  }
];