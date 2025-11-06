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
        loadComponent: () => import('./components/lms-dashboard/lms-dashboard.component').then(m => m.LmsDashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./components/courses/courses.component').then(m => m.LmsCoursesComponent)
      },
      {
        path: 'assignments',
        loadComponent: () => import('./components/assignments/assignments.component').then(m => m.LmsAssignmentsComponent)
      },
      {
        path: 'resources',
        loadComponent: () => import('./components/resources/resources.component').then(m => m.LmsResourcesComponent)
      },
      {
        path: 'progress',
        loadComponent: () => import('./components/progress/progress.component').then(m => m.LmsProgressComponent)
      },
      {
        path: 'assessment-taking',
        loadComponent: () => import('./components/assessment-taking/assessment-taking.component').then(m => m.AssessmentTakingComponent)
      },
      {
        path: 'assessment-results',
        loadComponent: () => import('./components/assessment-results/assessment-results.component').then(m => m.AssessmentResultsComponent)
      },
      {
        path: 'question-bank',
        loadComponent: () => import('./components/question-bank/question-bank.component').then(m => m.QuestionBankComponent)
      }
    ]
  }
];