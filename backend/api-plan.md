# API Structure and Endpoints for Student Placement Cell System

## Base URL
`https://api.placementcell.com/api/v1`

## Authentication
All endpoints except registration and login require JWT token in Authorization header.

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

## User Management
- `GET /users` - Get all users (Admin only)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (Admin only)

## Student Module
- `GET /students` - Get all students
- `GET /students/{id}` - Get student profile
- `POST /students` - Create student profile
- `PUT /students/{id}` - Update student profile
- `GET /students/{id}/applications` - Get student's applications
- `GET /students/{id}/enrollments` - Get student's course enrollments

## Company Module
- `GET /companies` - Get all companies
- `GET /companies/{id}` - Get company profile
- `POST /companies` - Register company
- `PUT /companies/{id}` - Update company profile
- `GET /companies/{id}/jobs` - Get company's jobs
- `PUT /companies/{id}/kyc` - Update KYC status (Admin only)

## Job Module
- `GET /jobs` - Get all jobs (with filters)
- `GET /jobs/{id}` - Get job details
- `POST /jobs` - Post new job (Company only)
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job
- `GET /jobs/search` - Search jobs with parameters

## Application Module
- `GET /applications` - Get applications (filtered by user role)
- `GET /applications/{id}` - Get application details
- `POST /applications` - Apply for job
- `PUT /applications/{id}/status` - Update application status
- `DELETE /applications/{id}` - Withdraw application

## Interview Module
- `GET /interviews` - Get interviews
- `GET /interviews/{id}` - Get interview details
- `POST /interviews` - Schedule interview
- `PUT /interviews/{id}` - Update interview
- `DELETE /interviews/{id}` - Cancel interview

## LMS Module
### Courses
- `GET /courses` - Get all courses
- `GET /courses/{id}` - Get course details
- `POST /courses` - Create course (Instructor/Admin)
- `PUT /courses/{id}` - Update course
- `DELETE /courses/{id}` - Delete course

### Enrollments
- `GET /enrollments` - Get enrollments
- `POST /enrollments` - Enroll in course
- `PUT /enrollments/{id}/progress` - Update progress
- `GET /enrollments/{id}/certificate` - Get certificate

### Assessments
- `GET /assessments/{courseId}` - Get course assessments
- `POST /assessments/{id}/submit` - Submit assessment
- `GET /assessments/{id}/results` - Get assessment results

## Document Module
- `GET /documents` - Get user's documents
- `POST /documents` - Upload document
- `GET /documents/{id}/download` - Download document
- `PUT /documents/{id}/verify` - Verify document (Admin)

## Notification Module
- `GET /notifications` - Get user notifications
- `PUT /notifications/{id}/read` - Mark as read
- `POST /notifications` - Send notification (Admin)

## Message Module
- `GET /messages` - Get user messages
- `POST /messages` - Send message
- `PUT /messages/{id}/read` - Mark message as read

## Review Module
- `GET /reviews` - Get reviews
- `POST /reviews` - Post review
- `PUT /reviews/{id}` - Update review

## Payment Module
- `GET /payments` - Get payment history
- `POST /payments` - Process payment
- `GET /payments/{id}` - Get payment details

## Admin Module
- `GET /admin/dashboard` - Get dashboard stats
- `PUT /admin/users/{id}/status` - Activate/Deactivate user
- `GET /admin/audit-logs` - Get audit logs
- `POST /admin/announcements` - Post announcement

## Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "errors": []
}
```

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Pagination
For list endpoints:
- `GET /endpoint?page=1&pageSize=10`

## Filtering and Sorting
- `GET /endpoint?filter=field:value&sort=field:asc`