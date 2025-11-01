# Student Placement Cell System

A comprehensive web application for managing medical student placements, internships, and career development.

## Features

### Core Modules
- **Student Placement Cell**: Profile management, job applications, interview tracking
- **Company Registration**: Institution sign-up, job posting, candidate management
- **Learning Management System**: Courses, assessments, certifications
- **Admin Panel**: User management, content moderation, analytics
- **Communication**: In-app messaging, notifications, announcements
- **Document Verification**: Secure credential uploads and validation
- **Payment Integration**: Course payments and premium features
- **AI Matching**: Smart job and course recommendations

## Technology Stack

### Backend
- **Framework**: .NET Core 9.0
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Bearer Tokens
- **ORM**: Entity Framework Core
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 18
- **Language**: TypeScript
- **UI Library**: Angular Material
- **State Management**: RxJS + Services

### Integrations
- **Video Conferencing**: Zoom, Google Meet
- **Payments**: Stripe, Razorpay
- **Notifications**: Email, SMS APIs

## Project Structure

```
c:/workspace/
├── backend/                    # .NET Core API
│   ├── PlacementCellApi/
│   │   ├── Controllers/       # API endpoints
│   │   ├── Data/             # Database context
│   │   ├── Models/           # Entity models
│   │   ├── Services/         # Business logic
│   │   └── appsettings.json  # Configuration
│   └── api-plan.md           # API documentation
├── frontend/                  # Angular application
│   └── architecture.md        # Frontend design
├── database/                  # Database scripts
│   └── schema.sql            # MSSQL schema
└── README.md                  # This file
```

## Prerequisites

### Backend
- .NET 9.0 SDK
- Microsoft SQL Server
- Visual Studio 2022 or VS Code

### Frontend
- Node.js 18+
- Angular CLI 18
- npm or yarn

## Setup Instructions

### Database Setup
1. Install Microsoft SQL Server
2. Open SQL Server Management Studio or Azure Data Studio
3. Run the `database/dummy-data.sql` script to create the database with sample data
   - This will create the `PlacementCellDb` database
   - Set up all tables with proper relationships
   - Insert comprehensive dummy data for testing

**Alternative:** Run `database/setup-database.sql` for a guided setup

**Sample Data Includes:**
- 12 Users (2 Admins, 4 Companies, 6 Students)
- 6 Job postings across different medical specialties
- 8 Job applications with various statuses
- 3 Scheduled interviews
- 8 LMS courses with modules and assessments
- 8 Student enrollments with progress tracking
- 11 Document uploads with verification status
- 7 Notifications and 5 messages
- 6 Reviews and 6 payment records
- 6 Audit log entries

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend/PlacementCellApi
   ```

2. Restore packages:
   ```bash
   dotnet restore
   ```

3. Update connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=your-server;Database=PlacementCellDb;Trusted_Connection=True;"
   }
   ```

4. Run database migrations:
   ```bash
   dotnet ef database update
   ```

5. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001`

### Frontend Setup
1. Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli@18
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## API Documentation

Once the backend is running, visit `https://localhost:5001/swagger` for interactive API documentation.

## Key Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (Company)
- `GET /api/jobs/{id}` - Get job details

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications` - Get user's applications

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/enrollments` - Enroll in course

## Development Workflow

1. **Backend Development**:
   - Create models in `Models/` folder
   - Implement services in `Services/` folder
   - Add controllers in `Controllers/` folder
   - Update database context if needed

2. **Frontend Development**:
   - Create components in feature modules
   - Implement services for API calls
   - Add routing and guards
   - Style with Angular Material

3. **Database Changes**:
   - Update schema in `database/schema.sql`
   - Create migrations if using EF Code First

## Security Features

- JWT-based authentication
- Role-based authorization
- Password hashing with BCrypt
- HTTPS enforcement
- CORS configuration
- Input validation

## Testing

### Backend Testing
```bash
dotnet test
```

### Frontend Testing
```bash
ng test
```

### End-to-End Testing
```bash
ng e2e
```

## Deployment

### Backend Deployment
1. Build the application:
   ```bash
   dotnet publish -c Release
   ```

2. Deploy to IIS or cloud service (Azure, AWS)

### Frontend Deployment
1. Build for production:
   ```bash
   ng build --prod
   ```

2. Deploy `dist/` folder to web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.