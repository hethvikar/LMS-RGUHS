import { Routes } from '@angular/router';

export const LMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/lms-layout/lms-layout.component').then(m => m.LmsLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/lms-dashboard/lms-dashboard.component').then(m => m.LmsDashboardComponent),
        data: { breadcrumb: 'Dashboard', icon: 'dashboard' }
      },
      {
        path: 'courses',
        loadComponent: () => import('./components/courses/courses.component').then(m => m.LmsCoursesComponent),
        data: { breadcrumb: 'Courses', icon: 'library_books' }
      },
      {
        path: 'assignments',
        loadComponent: () => import('./components/assignments/assignments.component').then(m => m.LmsAssignmentsComponent),
        data: { breadcrumb: 'Assignments', icon: 'assignment' }
      },
      {
        path: 'resources',
        loadComponent: () => import('./components/resources/resources.component').then(m => m.LmsResourcesComponent),
        data: { breadcrumb: 'Resources', icon: 'folder' }
      },
      {
        path: 'progress',
        loadComponent: () => import('./components/progress/progress.component').then(m => m.LmsProgressComponent),
        data: { breadcrumb: 'Progress', icon: 'trending_up' }
      },
      {
        path: 'assessment-taking',
        loadComponent: () => import('./components/assessment-taking/assessment-taking.component').then(m => m.AssessmentTakingComponent),
        data: { breadcrumb: 'Take Assessment', icon: 'edit_note' }
      },
      {
        path: 'assessment-results',
        loadComponent: () => import('./components/assessment-results/assessment-results.component').then(m => m.AssessmentResultsComponent),
        data: { breadcrumb: 'Assessment Results', icon: 'assessment' }
      },
      {
        path: 'question-bank',
        loadComponent: () => import('./components/question-bank/question-bank.component').then(m => m.QuestionBankComponent),
        data: { breadcrumb: 'Question Bank', icon: 'quiz' }
      }
    ]
  }
];