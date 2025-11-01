-- Database Schema for Student Placement Cell System
-- MSSQL Database

-- Users table (base for all user types)
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL, -- 'Student', 'Company', 'Admin'
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- Students table
CREATE TABLE Students (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(Id),
    MedicalSpecialization NVARCHAR(100),
    GraduationYear INT,
    NEETScore DECIMAL(5,2),
    ResumePath NVARCHAR(500),
    ProfilePicturePath NVARCHAR(500),
    Bio NVARCHAR(MAX),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    State NVARCHAR(100),
    Country NVARCHAR(100),
    ZipCode NVARCHAR(20)
);

-- Companies table
CREATE TABLE Companies (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(Id),
    CompanyName NVARCHAR(255) NOT NULL,
    Industry NVARCHAR(100),
    Website NVARCHAR(255),
    Description NVARCHAR(MAX),
    RegistrationNumber NVARCHAR(100),
    LicensePath NVARCHAR(500),
    KYCStatus NVARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    Address NVARCHAR(500),
    City NVARCHAR(100),
    State NVARCHAR(100),
    Country NVARCHAR(100),
    ZipCode NVARCHAR(20),
    ContactPerson NVARCHAR(100)
);

-- Admins table
CREATE TABLE Admins (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(Id),
    Permissions NVARCHAR(MAX) -- JSON string of permissions
);

-- Jobs table
CREATE TABLE Jobs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT FOREIGN KEY REFERENCES Companies(Id),
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Requirements NVARCHAR(MAX),
    Department NVARCHAR(100),
    Location NVARCHAR(255),
    JobType NVARCHAR(50), -- 'Full-time', 'Part-time', 'Internship'
    SalaryMin DECIMAL(10,2),
    SalaryMax DECIMAL(10,2),
    Stipend DECIMAL(10,2), -- for internships
    DurationMonths INT, -- for internships
    PostedDate DATETIME2 DEFAULT GETDATE(),
    Deadline DATETIME2,
    IsActive BIT DEFAULT 1,
    EligibilityCriteria NVARCHAR(MAX) -- JSON string
);

-- Applications table
CREATE TABLE Applications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT FOREIGN KEY REFERENCES Students(Id),
    JobId INT FOREIGN KEY REFERENCES Jobs(Id),
    AppliedDate DATETIME2 DEFAULT GETDATE(),
    Status NVARCHAR(50) DEFAULT 'Applied', -- 'Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected', 'Withdrawn'
    Notes NVARCHAR(MAX),
    UNIQUE(StudentId, JobId)
);

-- Interviews table
CREATE TABLE Interviews (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ApplicationId INT FOREIGN KEY REFERENCES Applications(Id),
    ScheduledDate DATETIME2,
    InterviewType NVARCHAR(50), -- 'Online', 'Offline'
    Platform NVARCHAR(100), -- 'Zoom', 'Google Meet'
    MeetingLink NVARCHAR(500),
    Interviewer NVARCHAR(100),
    Notes NVARCHAR(MAX),
    Status NVARCHAR(50) DEFAULT 'Scheduled' -- 'Scheduled', 'Completed', 'Cancelled'
);

-- Courses table (for LMS)
CREATE TABLE Courses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(100),
    InstructorId INT FOREIGN KEY REFERENCES Users(Id),
    DurationHours INT,
    Price DECIMAL(10,2),
    IsPaid BIT DEFAULT 0,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- CourseModules table
CREATE TABLE CourseModules (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CourseId INT FOREIGN KEY REFERENCES Courses(Id),
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    OrderIndex INT,
    ContentType NVARCHAR(50), -- 'Video', 'Document', 'Quiz'
    ContentPath NVARCHAR(500),
    DurationMinutes INT
);

-- Enrollments table
CREATE TABLE Enrollments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT FOREIGN KEY REFERENCES Students(Id),
    CourseId INT FOREIGN KEY REFERENCES Courses(Id),
    EnrolledDate DATETIME2 DEFAULT GETDATE(),
    ProgressPercentage DECIMAL(5,2) DEFAULT 0,
    CompletionDate DATETIME2,
    CertificatePath NVARCHAR(500),
    UNIQUE(StudentId, CourseId)
);

-- Assessments table
CREATE TABLE Assessments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CourseId INT FOREIGN KEY REFERENCES Courses(Id),
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Type NVARCHAR(50), -- 'Quiz', 'Exam'
    TotalMarks INT,
    PassingMarks INT,
    DurationMinutes INT,
    IsTimed BIT DEFAULT 1
);

-- AssessmentQuestions table
CREATE TABLE AssessmentQuestions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AssessmentId INT FOREIGN KEY REFERENCES Assessments(Id),
    Question NVARCHAR(MAX),
    Options NVARCHAR(MAX), -- JSON array
    CorrectAnswer NVARCHAR(MAX),
    Marks INT DEFAULT 1
);

-- StudentAnswers table
CREATE TABLE StudentAnswers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EnrollmentId INT FOREIGN KEY REFERENCES Enrollments(Id),
    AssessmentId INT FOREIGN KEY REFERENCES Assessments(Id),
    QuestionId INT FOREIGN KEY REFERENCES AssessmentQuestions(Id),
    Answer NVARCHAR(MAX),
    IsCorrect BIT,
    MarksObtained INT
);

-- Documents table
CREATE TABLE Documents (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    DocumentType NVARCHAR(100), -- 'Degree', 'License', 'Resume', etc.
    FileName NVARCHAR(255),
    FilePath NVARCHAR(500),
    UploadDate DATETIME2 DEFAULT GETDATE(),
    VerificationStatus NVARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Verified', 'Rejected'
    VerifiedBy INT FOREIGN KEY REFERENCES Admins(Id),
    VerifiedDate DATETIME2
);

-- Notifications table
CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Title NVARCHAR(255),
    Message NVARCHAR(MAX),
    Type NVARCHAR(50), -- 'Email', 'SMS', 'InApp'
    IsRead BIT DEFAULT 0,
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    ScheduledDate DATETIME2
);

-- Messages table (for in-app messaging)
CREATE TABLE Messages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SenderId INT FOREIGN KEY REFERENCES Users(Id),
    ReceiverId INT FOREIGN KEY REFERENCES Users(Id),
    Subject NVARCHAR(255),
    Content NVARCHAR(MAX),
    SentDate DATETIME2 DEFAULT GETDATE(),
    IsRead BIT DEFAULT 0
);

-- Reviews table
CREATE TABLE Reviews (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ReviewerId INT FOREIGN KEY REFERENCES Users(Id), -- Company or Student
    RevieweeId INT FOREIGN KEY REFERENCES Users(Id), -- Student or Company
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(MAX),
    CreatedDate DATETIME2 DEFAULT GETDATE()
);

-- Payments table
CREATE TABLE Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Amount DECIMAL(10,2),
    Currency NVARCHAR(10) DEFAULT 'USD',
    PaymentMethod NVARCHAR(50), -- 'Stripe', 'Razorpay'
    TransactionId NVARCHAR(255),
    Status NVARCHAR(50), -- 'Pending', 'Completed', 'Failed'
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    Description NVARCHAR(255)
);

-- AuditLogs table
CREATE TABLE AuditLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Action NVARCHAR(255),
    EntityType NVARCHAR(100),
    EntityId INT,
    OldValues NVARCHAR(MAX),
    NewValues NVARCHAR(MAX),
    Timestamp DATETIME2 DEFAULT GETDATE(),
    IpAddress NVARCHAR(45)
);

-- Indexes for performance
CREATE INDEX IX_Jobs_CompanyId ON Jobs(CompanyId);
CREATE INDEX IX_Jobs_JobType ON Jobs(JobType);
CREATE INDEX IX_Applications_StudentId ON Applications(StudentId);
CREATE INDEX IX_Applications_JobId ON Applications(JobId);
CREATE INDEX IX_Enrollments_StudentId ON Enrollments(StudentId);
CREATE INDEX IX_Documents_UserId ON Documents(UserId);
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_Messages_SenderId ON Messages(SenderId);
CREATE INDEX IX_Messages_ReceiverId ON Messages(ReceiverId);