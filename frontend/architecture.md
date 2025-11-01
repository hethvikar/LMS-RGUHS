# Frontend Architecture for Student Placement Cell System

## Technology Stack
- Angular 18
- TypeScript
- Angular Material for UI components
- RxJS for reactive programming
- Angular Router for navigation
- HttpClient for API calls
- JWT for authentication

## Project Structure
```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── auth/               # Authentication services
│   │   ├── guards/             # Route guards
│   │   ├── interceptors/       # HTTP interceptors
│   │   └── services/           # Core services
│   ├── shared/                 # Shared components and utilities
│   │   ├── components/         # Reusable components
│   │   ├── directives/         # Custom directives
│   │   ├── pipes/              # Custom pipes
│   │   └── models/             # TypeScript interfaces
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication module
│   │   ├── student/            # Student module
│   │   ├── company/            # Company module
│   │   ├── lms/                # Learning Management System
│   │   ├── admin/              # Admin panel
│   │   └── dashboard/          # User dashboard
│   ├── layouts/                # Layout components
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── footer/
│   └── app.component.ts
├── assets/                     # Static assets
├── environments/               # Environment configurations
└── styles/                     # Global styles
```

## Core Module
### Authentication Service
- Login/logout
- Token management
- User state management

### HTTP Interceptor
- JWT token attachment
- Error handling
- Loading indicators

### Guards
- AuthGuard: Protect authenticated routes
- RoleGuard: Role-based access control

## Shared Module
### Components
- LoadingSpinnerComponent
- ErrorMessageComponent
- ConfirmationDialogComponent
- FileUploadComponent
- PaginationComponent

### Pipes
- DateFormatPipe
- TruncatePipe
- CurrencyPipe

### Models/Interfaces
- User.ts
- Student.ts
- Company.ts
- Job.ts
- Application.ts
- Course.ts
- etc.

## Feature Modules

### Auth Module
Components:
- LoginComponent
- RegisterComponent
- ForgotPasswordComponent

### Student Module
Components:
- StudentProfileComponent
- JobSearchComponent
- ApplicationListComponent
- ResumeBuilderComponent
- CourseEnrollmentComponent

### Company Module
Components:
- CompanyProfileComponent
- JobPostingComponent
- ApplicationManagementComponent
- CandidateShortlistComponent
- InterviewSchedulingComponent

### LMS Module
Components:
- CourseCatalogComponent
- CourseDetailComponent
- CoursePlayerComponent
- AssessmentComponent
- CertificateComponent
- LiveClassComponent

### Admin Module
Components:
- UserManagementComponent
- JobModerationComponent
- CourseModerationComponent
- AnalyticsDashboardComponent
- NotificationManagementComponent

### Dashboard Module
Components:
- StudentDashboardComponent
- CompanyDashboardComponent
- AdminDashboardComponent

## Routing Structure
```
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'student', loadChildren: () => import('./features/student/student.module').then(m => m.StudentModule), canActivate: [AuthGuard, RoleGuard], data: { roles: ['Student'] } },
  { path: 'company', loadChildren: () => import('./features/company/company.module').then(m => m.CompanyModule), canActivate: [AuthGuard, RoleGuard], data: { roles: ['Company'] } },
  { path: 'lms', loadChildren: () => import('./features/lms/lms.module').then(m => m.LmsModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin'] } },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];
```

## State Management
- Use Angular services with BehaviorSubject for simple state
- Consider NgRx for complex state management if needed

## Services Structure
Each feature module has its own service:
- AuthService
- StudentService
- CompanyService
- JobService
- CourseService
- etc.

Services handle:
- API calls
- Data transformation
- Caching
- Error handling

## Styling
- Use SCSS for component styling
- Angular Material theme
- Responsive design with Bootstrap or custom CSS Grid/Flexbox
- Dark mode support

## Testing
- Unit tests with Jasmine/Karma
- E2E tests with Cypress
- Component testing with Angular Testing Utilities

## Performance Optimization
- Lazy loading of feature modules
- OnPush change detection
- Virtual scrolling for large lists
- Image optimization
- Bundle splitting

## Security
- Input validation
- XSS prevention
- CSRF protection
- Secure storage of tokens
- Route guards for authorization