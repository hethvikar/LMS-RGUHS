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
      },
      // LMS-linked routes for students
      {
        path: 'assignments',
        loadComponent: () => import('../lms/components/assignments/assignments.component').then(m => m.LmsAssignmentsComponent),
        data: { breadcrumb: 'Assignments', icon: 'assignment' }
      },
      {
        path: 'courses',
        loadComponent: () => import('../lms/components/courses/courses.component').then(m => m.LmsCoursesComponent),
        data: { breadcrumb: 'Courses', icon: 'library_books' }
      },
      {
        path: 'assessments',
        loadComponent: () => import('../lms/components/assessment-taking/assessment-taking.component').then(m => m.AssessmentTakingComponent),
        data: { breadcrumb: 'Take Assessment', icon: 'edit_note' }
      },
      {
        path: 'progress',
        loadComponent: () => import('../lms/components/progress/progress.component').then(m => m.LmsProgressComponent),
        data: { breadcrumb: 'Progress', icon: 'trending_up' }
      },
      {
        path: 'results',
        loadComponent: () => import('../lms/components/assessment-results/assessment-results.component').then(m => m.AssessmentResultsComponent),
        data: { breadcrumb: 'Assessment Results', icon: 'assessment' }
      },
      {
        path: 'certifications',
        loadComponent: () => import('./components/certifications/certifications.component').then(m => m.StudentCertificationsComponent),
        data: { breadcrumb: 'Certifications', icon: 'workspace_premium' }
      },
      {
        path: 'training-attendance',
        loadComponent: () => import('./components/training/training-attendance.component').then(m => m.TrainingAttendanceComponent),
        data: { breadcrumb: 'Training Attendance', icon: 'event_available' }
      }
    ]
  }
];