-- Student Placement Cell System - Database Schema with Dummy Data
-- MSSQL Database Setup Script

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PlacementCellDb')
BEGIN
    CREATE DATABASE PlacementCellDb;
END
GO

USE PlacementCellDb;
GO

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

-- ===========================================
-- DUMMY DATA INSERTION
-- ===========================================

-- Insert Admin Users
INSERT INTO Users (Email, PasswordHash, Role, FirstName, LastName, Phone, CreatedAt, UpdatedAt, IsActive)
VALUES
('admin@placementcell.com', '$2a$11$example.hash.for.admin', 'Admin', 'System', 'Administrator', '+1234567890', GETDATE(), GETDATE(), 1),
('moderator@placementcell.com', '$2a$11$example.hash.for.mod', 'Admin', 'Content', 'Moderator', '+1234567891', GETDATE(), GETDATE(), 1);

-- Insert Admin Profiles
INSERT INTO Admins (Id, Permissions)
VALUES
(1, '{"canManageUsers": true, "canVerifyDocuments": true, "canModerateContent": true, "canViewReports": true}'),
(2, '{"canManageUsers": false, "canVerifyDocuments": true, "canModerateContent": true, "canViewReports": false}');

-- Insert Company Users
INSERT INTO Users (Email, PasswordHash, Role, FirstName, LastName, Phone, CreatedAt, UpdatedAt, IsActive)
VALUES
('hr@apollohospitals.com', '$2a$11$example.hash.company1', 'Company', 'Rajesh', 'Kumar', '+919876543210', GETDATE(), GETDATE(), 1),
('recruiter@maxhealthcare.com', '$2a$11$example.hash.company2', 'Company', 'Priya', 'Sharma', '+919876543211', GETDATE(), GETDATE(), 1),
('hr@fortishospitals.com', '$2a$11$example.hash.company3', 'Company', 'Amit', 'Verma', '+919876543212', GETDATE(), GETDATE(), 1),
('recruiter@medanta.com', '$2a$11$example.hash.company4', 'Company', 'Sneha', 'Patel', '+919876543213', GETDATE(), GETDATE(), 1);

-- Insert Company Profiles
INSERT INTO Companies (Id, CompanyName, Industry, Website, Description, RegistrationNumber, LicensePath, KYCStatus, Address, City, State, Country, ZipCode, ContactPerson)
VALUES
(3, 'Apollo Hospitals', 'Healthcare', 'https://www.apollohospitals.com', 'Leading healthcare provider with 70+ hospitals across India', 'REG001', '/documents/licenses/apollo_license.pdf', 'Approved', '21 Greams Lane', 'Chennai', 'Tamil Nadu', 'India', '600006', 'Rajesh Kumar'),
(4, 'Max Healthcare', 'Healthcare', 'https://www.maxhealthcare.in', 'Multi-specialty hospital chain with advanced medical facilities', 'REG002', '/documents/licenses/max_license.pdf', 'Approved', 'Sector 19', 'Gurgaon', 'Haryana', 'India', '122001', 'Priya Sharma'),
(5, 'Fortis Healthcare', 'Healthcare', 'https://www.fortishealthcare.com', 'One of India''s largest healthcare networks', 'REG003', '/documents/licenses/fortis_license.pdf', 'Approved', 'Okhla Road', 'New Delhi', 'Delhi', 'India', '110025', 'Amit Verma'),
(6, 'Medanta', 'Healthcare', 'https://www.medanta.org', 'Multi-super specialty institute with world-class infrastructure', 'REG004', '/documents/licenses/medanta_license.pdf', 'Approved', 'Sector 38', 'Gurgaon', 'Haryana', 'India', '122001', 'Sneha Patel');

-- Insert Student Users
INSERT INTO Users (Email, PasswordHash, Role, FirstName, LastName, Phone, CreatedAt, UpdatedAt, IsActive)
VALUES
('rahul.sharma@student.edu', '$2a$11$example.hash.student1', 'Student', 'Rahul', 'Sharma', '+919876543214', GETDATE(), GETDATE(), 1),
('priya.gupta@student.edu', '$2a$11$example.hash.student2', 'Student', 'Priya', 'Gupta', '+919876543215', GETDATE(), GETDATE(), 1),
('arjun.verma@student.edu', '$2a$11$example.hash.student3', 'Student', 'Arjun', 'Verma', '+919876543216', GETDATE(), GETDATE(), 1),
('kavita.singh@student.edu', '$2a$11$example.hash.student4', 'Student', 'Kavita', 'Singh', '+919876543217', GETDATE(), GETDATE(), 1),
('vikas.patel@student.edu', '$2a$11$example.hash.student5', 'Student', 'Vikas', 'Patel', '+919876543218', GETDATE(), GETDATE(), 1),
('meera.joshi@student.edu', '$2a$11$example.hash.student6', 'Student', 'Meera', 'Joshi', '+919876543219', GETDATE(), GETDATE(), 1);

-- Insert Student Profiles
INSERT INTO Students (Id, MedicalSpecialization, GraduationYear, NEETScore, ResumePath, ProfilePicturePath, Bio, Address, City, State, Country, ZipCode)
VALUES
(7, 'Cardiology', 2024, 685.5, '/documents/resumes/rahul_sharma_resume.pdf', '/images/profiles/rahul.jpg', 'Dedicated medical student with strong foundation in cardiology', '45 Civil Lines', 'Jaipur', 'Rajasthan', 'India', '302001'),
(8, 'Neurology', 2024, 692.0, '/documents/resumes/priya_gupta_resume.pdf', '/images/profiles/priya.jpg', 'Passionate about neurological disorders and research', '12 MG Road', 'Pune', 'Maharashtra', 'India', '411001'),
(9, 'Orthopedics', 2024, 678.5, '/documents/resumes/arjun_verma_resume.pdf', '/images/profiles/arjun.jpg', 'Sports medicine enthusiast with surgical interests', '78 Park Street', 'Kolkata', 'West Bengal', 'India', '700016'),
(10, 'Pediatrics', 2024, 695.5, '/documents/resumes/kavita_singh_resume.pdf', '/images/profiles/kavita.jpg', 'Child healthcare advocate with community service experience', '23 Connaught Place', 'New Delhi', 'Delhi', 'India', '110001'),
(11, 'Emergency Medicine', 2024, 688.0, '/documents/resumes/vikas_patel_resume.pdf', '/images/profiles/vikas.jpg', 'Emergency response specialist with trauma care focus', '56 Brigade Road', 'Bangalore', 'Karnataka', 'India', '560025'),
(12, 'Internal Medicine', 2024, 682.5, '/documents/resumes/meera_joshi_resume.pdf', '/images/profiles/meera.jpg', 'Internal medicine aspirant with research publications', '89 FC Road', 'Pune', 'Maharashtra', 'India', '411004');

-- Insert Jobs
INSERT INTO Jobs (CompanyId, Title, Description, Requirements, Department, Location, JobType, SalaryMin, SalaryMax, Stipend, DurationMonths, PostedDate, Deadline, IsActive, EligibilityCriteria)
VALUES
(3, 'Cardiology Resident', 'Join our cardiology department as a resident physician', 'MBBS degree, NEET qualification, cardiology interest', 'Cardiology', 'Chennai, Tamil Nadu', 'Full-time', 800000.00, 1200000.00, NULL, NULL, GETDATE(), DATEADD(month, 2, GETDATE()), 1, '{"neetScore": 650, "graduationYear": 2024}'),
(3, 'Emergency Medicine Intern', '6-month internship in emergency department', 'MBBS degree, basic life support certification', 'Emergency Medicine', 'Chennai, Tamil Nadu', 'Internship', NULL, NULL, 25000.00, 6, GETDATE(), DATEADD(month, 1, GETDATE()), 1, '{"neetScore": 600, "graduationYear": 2024}'),
(4, 'Neurology Resident', 'Advanced neurology training program', 'MBBS, neurology elective completed', 'Neurology', 'Gurgaon, Haryana', 'Full-time', 900000.00, 1300000.00, NULL, NULL, GETDATE(), DATEADD(month, 3, GETDATE()), 1, '{"neetScore": 680, "graduationYear": 2024}'),
(4, 'Pediatric Intern', 'Clinical internship in pediatrics department', 'MBBS degree, child healthcare interest', 'Pediatrics', 'Gurgaon, Haryana', 'Internship', NULL, NULL, 22000.00, 6, GETDATE(), DATEADD(month, 1, GETDATE()), 1, '{"neetScore": 620, "graduationYear": 2024}'),
(5, 'Orthopedic Surgery Resident', 'Comprehensive orthopedic training', 'MBBS, surgery rotation completed', 'Orthopedics', 'New Delhi, Delhi', 'Full-time', 850000.00, 1250000.00, NULL, NULL, GETDATE(), DATEADD(month, 2, GETDATE()), 1, '{"neetScore": 670, "graduationYear": 2024}'),
(6, 'Internal Medicine Resident', 'Internal medicine residency program', 'MBBS degree, internal medicine interest', 'Internal Medicine', 'Gurgaon, Haryana', 'Full-time', 750000.00, 1100000.00, NULL, NULL, GETDATE(), DATEADD(month, 2, GETDATE()), 1, '{"neetScore": 640, "graduationYear": 2024}');

-- Insert Applications
INSERT INTO Applications (StudentId, JobId, AppliedDate, Status, Notes)
VALUES
(7, 1, GETDATE(), 'Shortlisted', 'Strong cardiology background'),
(7, 2, DATEADD(day, -5, GETDATE()), 'Applied', 'Interested in emergency medicine'),
(8, 3, GETDATE(), 'Interviewed', 'Excellent neurology performance'),
(8, 4, DATEADD(day, -3, GETDATE()), 'Applied', 'Pediatric experience'),
(9, 5, GETDATE(), 'Selected', 'Outstanding orthopedic candidate'),
(10, 4, DATEADD(day, -7, GETDATE()), 'Shortlisted', 'Child healthcare focus'),
(11, 2, DATEADD(day, -2, GETDATE()), 'Applied', 'Emergency medicine interest'),
(12, 6, GETDATE(), 'Applied', 'Internal medicine specialization');

-- Insert Interviews
INSERT INTO Interviews (ApplicationId, ScheduledDate, InterviewType, Platform, MeetingLink, Interviewer, Notes, Status)
VALUES
(3, DATEADD(day, 7, GETDATE()), 'Online', 'Zoom', 'https://zoom.us/j/123456789', 'Dr. Rajesh Kumar', 'Technical interview for neurology position', 'Scheduled'),
(5, DATEADD(day, 5, GETDATE()), 'Offline', NULL, NULL, 'Dr. Amit Verma', 'Final round interview at hospital', 'Scheduled'),
(6, DATEADD(day, 10, GETDATE()), 'Online', 'Google Meet', 'https://meet.google.com/abc-defg-hij', 'Dr. Sneha Patel', 'Pediatric department interview', 'Scheduled');

-- Insert Courses
INSERT INTO Courses (Title, Description, Category, InstructorId, DurationHours, Price, IsPaid, CreatedDate, IsActive)
VALUES
('Advanced Cardiology', 'Comprehensive course on cardiovascular diseases and treatments', 'Cardiology', 3, 40, 5000.00, 1, GETDATE(), 1),
('Neurology Fundamentals', 'Introduction to neurological disorders and diagnostics', 'Neurology', 4, 35, 4500.00, 1, GETDATE(), 1),
('Emergency Medicine Protocols', 'Critical care and emergency response procedures', 'Emergency Medicine', 3, 30, 4000.00, 1, GETDATE(), 1),
('Pediatric Care Essentials', 'Child healthcare and developmental pediatrics', 'Pediatrics', 4, 25, 3500.00, 1, GETDATE(), 1),
('Orthopedic Surgery Basics', 'Fundamentals of orthopedic procedures and treatments', 'Orthopedics', 5, 45, 6000.00, 1, GETDATE(), 1),
('Internal Medicine Overview', 'Comprehensive internal medicine principles', 'Internal Medicine', 6, 50, 5500.00, 1, GETDATE(), 1),
('Medical Ethics and Law', 'Healthcare ethics, patient rights, and medical jurisprudence', 'Medical Ethics', 1, 20, 0.00, 0, GETDATE(), 1),
('Basic Life Support (BLS)', 'Essential life-saving techniques and CPR', 'Emergency Care', 3, 8, 0.00, 0, GETDATE(), 1);

-- Insert Course Modules
INSERT INTO CourseModules (CourseId, Title, Description, OrderIndex, ContentType, ContentPath, DurationMinutes)
VALUES
(1, 'Introduction to Cardiovascular System', 'Basic anatomy and physiology of heart', 1, 'Video', '/content/cardiology/module1.mp4', 45),
(1, 'Common Cardiac Diseases', 'Overview of prevalent heart conditions', 2, 'Video', '/content/cardiology/module2.mp4', 60),
(1, 'Diagnostic Procedures', 'ECG, Echo, and other cardiac tests', 3, 'Video', '/content/cardiology/module3.mp4', 75),
(2, 'Brain Anatomy and Function', 'Neurological system basics', 1, 'Video', '/content/neurology/module1.mp4', 50),
(2, 'Neurological Examination', 'Clinical assessment techniques', 2, 'Video', '/content/neurology/module2.mp4', 55),
(3, 'Emergency Response Protocols', 'Initial assessment and stabilization', 1, 'Video', '/content/emergency/module1.mp4', 40),
(3, 'Trauma Management', 'Injury assessment and treatment', 2, 'Video', '/content/emergency/module2.mp4', 45),
(4, 'Child Development Milestones', 'Growth and development tracking', 1, 'Video', '/content/pediatrics/module1.mp4', 35),
(4, 'Common Pediatric Conditions', 'Frequent childhood illnesses', 2, 'Video', '/content/pediatrics/module2.mp4', 40);

-- Insert Enrollments
INSERT INTO Enrollments (StudentId, CourseId, EnrolledDate, ProgressPercentage, CompletionDate, CertificatePath)
VALUES
(7, 1, DATEADD(day, -30, GETDATE()), 100.00, DATEADD(day, -5, GETDATE()), '/certificates/rahul_cardiology.pdf'),
(7, 3, DATEADD(day, -15, GETDATE()), 75.00, NULL, NULL),
(8, 2, DATEADD(day, -25, GETDATE()), 100.00, DATEADD(day, -3, GETDATE()), '/certificates/priya_neurology.pdf'),
(8, 4, DATEADD(day, -10, GETDATE()), 60.00, NULL, NULL),
(9, 5, DATEADD(day, -20, GETDATE()), 100.00, DATEADD(day, -2, GETDATE()), '/certificates/arjun_orthopedics.pdf'),
(10, 4, DATEADD(day, -12, GETDATE()), 80.00, NULL, NULL),
(11, 3, DATEADD(day, -8, GETDATE()), 40.00, NULL, NULL),
(12, 6, DATEADD(day, -18, GETDATE()), 100.00, DATEADD(day, -1, GETDATE()), '/certificates/meera_internal_medicine.pdf');

-- Insert Assessments
INSERT INTO Assessments (CourseId, Title, Description, Type, TotalMarks, PassingMarks, DurationMinutes, IsTimed)
VALUES
(1, 'Cardiology Final Exam', 'Comprehensive assessment of cardiology knowledge', 'Exam', 100, 70, 120, 1),
(2, 'Neurology Quiz', 'Neurological disorders and diagnostics quiz', 'Quiz', 50, 35, 45, 1),
(3, 'Emergency Protocols Test', 'Emergency response procedures assessment', 'Exam', 75, 50, 60, 1),
(4, 'Pediatric Care Assessment', 'Child healthcare knowledge test', 'Quiz', 40, 28, 30, 1),
(5, 'Orthopedic Surgery Exam', 'Surgical procedures and treatments', 'Exam', 100, 75, 90, 1),
(6, 'Internal Medicine Test', 'Comprehensive internal medicine assessment', 'Exam', 80, 56, 75, 1);

-- Insert Assessment Questions
INSERT INTO AssessmentQuestions (AssessmentId, Question, Options, CorrectAnswer, Marks)
VALUES
(1, 'What is the normal range for adult blood pressure?', '["120/80 mmHg", "140/90 mmHg", "100/60 mmHg", "160/100 mmHg"]', '120/80 mmHg', 5),
(1, 'Which valve is most commonly affected in rheumatic heart disease?', '["Aortic", "Mitral", "Tricuspid", "Pulmonary"]', 'Mitral', 5),
(2, 'What is the primary function of the cerebellum?', '["Memory", "Coordination", "Vision", "Hearing"]', 'Coordination', 10),
(3, 'What is the first step in Basic Life Support?', '["Check responsiveness", "Call for help", "Start CPR", "Check airway"]', 'Check responsiveness', 15),
(4, 'At what age do children typically start walking?', '["6 months", "9 months", "12 months", "18 months"]', '12 months', 10),
(5, 'Which bone is most commonly fractured in adults?', '["Femur", "Humerus", "Radius", "Clavicle"]', 'Clavicle', 20);

-- Insert Documents
INSERT INTO Documents (UserId, DocumentType, FileName, FilePath, UploadDate, VerificationStatus, VerifiedBy, VerifiedDate)
VALUES
(7, 'Degree', 'rahul_mbbs_certificate.pdf', '/documents/degrees/rahul_mbbs.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 1, DATEADD(day, -30, GETDATE())),
(7, 'NEET', 'rahul_neet_scorecard.pdf', '/documents/neet/rahul_neet.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 1, DATEADD(day, -30, GETDATE())),
(7, 'Resume', 'rahul_sharma_resume.pdf', '/documents/resumes/rahul_resume.pdf', DATEADD(day, -30, GETDATE()), 'Verified', 1, DATEADD(day, -15, GETDATE())),
(8, 'Degree', 'priya_mbbs_certificate.pdf', '/documents/degrees/priya_mbbs.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 1, DATEADD(day, -25, GETDATE())),
(8, 'NEET', 'priya_neet_scorecard.pdf', '/documents/neet/priya_neet.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 1, DATEADD(day, -25, GETDATE())),
(9, 'Degree', 'arjun_mbbs_certificate.pdf', '/documents/degrees/arjun_mbbs.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 1, DATEADD(day, -20, GETDATE())),
(10, 'Degree', 'kavita_mbbs_certificate.pdf', '/documents/degrees/kavita_mbbs.pdf', DATEADD(day, -60, GETDATE()), 'Pending', NULL, NULL),
(11, 'Degree', 'vikas_mbbs_certificate.pdf', '/documents/degrees/vikas_mbbs.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 2, DATEADD(day, -10, GETDATE())),
(12, 'Degree', 'meera_mbbs_certificate.pdf', '/documents/degrees/meera_mbbs.pdf', DATEADD(day, -60, GETDATE()), 'Verified', 1, DATEADD(day, -18, GETDATE())),
(3, 'License', 'apollo_medical_license.pdf', '/documents/licenses/apollo_license.pdf', DATEADD(day, -365, GETDATE()), 'Verified', 1, DATEADD(day, -350, GETDATE())),
(4, 'License', 'max_medical_license.pdf', '/documents/licenses/max_license.pdf', DATEADD(day, -365, GETDATE()), 'Verified', 1, DATEADD(day, -340, GETDATE()));

-- Insert Notifications
INSERT INTO Notifications (UserId, Title, Message, Type, IsRead, CreatedDate, ScheduledDate)
VALUES
(7, 'Application Shortlisted', 'Congratulations! Your application for Cardiology Resident at Apollo Hospitals has been shortlisted.', 'InApp', 0, GETDATE(), NULL),
(7, 'New Job Alert', 'New internship opportunity in Emergency Medicine at Apollo Hospitals', 'Email', 0, DATEADD(day, -2, GETDATE()), NULL),
(8, 'Interview Scheduled', 'Your interview for Neurology Resident at Max Healthcare is scheduled for next week.', 'InApp', 0, GETDATE(), NULL),
(9, 'Job Offer', 'Congratulations! You have been selected for Orthopedic Surgery Resident at Fortis Healthcare.', 'Email', 1, DATEADD(day, -3, GETDATE()), NULL),
(10, 'Application Update', 'Your application status for Pediatric Intern at Max Healthcare has been updated to Shortlisted.', 'InApp', 0, DATEADD(day, -1, GETDATE()), NULL),
(11, 'Course Completion', 'You have successfully completed the Emergency Medicine Protocols course.', 'InApp', 0, DATEADD(day, -5, GETDATE()), NULL),
(12, 'Certificate Available', 'Your certificate for Internal Medicine Overview course is now available for download.', 'Email', 0, DATEADD(day, -1, GETDATE()), NULL);

-- Insert Messages
INSERT INTO Messages (SenderId, ReceiverId, Subject, Content, SentDate, IsRead)
VALUES
(3, 7, 'Interview Preparation', 'Please prepare for your upcoming cardiology interview. Review the common cardiac conditions.', GETDATE(), 0),
(4, 8, 'Neurology Interview Details', 'Your neurology interview will be conducted by Dr. Sharma. Please bring your portfolio.', DATEADD(day, -1, GETDATE()), 1),
(5, 9, 'Welcome to Fortis', 'Welcome to Fortis Healthcare! Your joining formalities will be shared soon.', DATEADD(day, -2, GETDATE()), 1),
(6, 10, 'Pediatric Department', 'We are impressed with your pediatric knowledge. Looking forward to your interview.', DATEADD(day, -3, GETDATE()), 0),
(3, 11, 'Emergency Medicine Training', 'Great work on your emergency medicine protocols course. Keep up the good work!', DATEADD(day, -4, GETDATE()), 1);

-- Insert Reviews
INSERT INTO Reviews (ReviewerId, RevieweeId, Rating, Comment, CreatedDate)
VALUES
(7, 3, 5, 'Excellent training program and supportive environment. Highly recommended for cardiology aspirants.', DATEADD(day, -10, GETDATE())),
(8, 4, 5, 'Outstanding neurology department with cutting-edge facilities and experienced faculty.', DATEADD(day, -8, GETDATE())),
(9, 5, 4, 'Great orthopedic program with good hands-on experience. Minor improvements needed in accommodation.', DATEADD(day, -5, GETDATE())),
(10, 4, 5, 'Wonderful pediatric department with child-friendly environment and comprehensive training.', DATEADD(day, -12, GETDATE())),
(11, 3, 4, 'Good emergency medicine exposure with real case scenarios. Could use more simulation training.', DATEADD(day, -7, GETDATE())),
(12, 6, 5, 'Excellent internal medicine program with strong emphasis on evidence-based practice.', DATEADD(day, -3, GETDATE()));

-- Insert Payments
INSERT INTO Payments (UserId, Amount, Currency, PaymentMethod, TransactionId, Status, CreatedDate, Description)
VALUES
(7, 5000.00, 'INR', 'Razorpay', 'TXN_2024_001', 'Completed', DATEADD(day, -30, GETDATE()), 'Payment for Advanced Cardiology course'),
(8, 4500.00, 'INR', 'Stripe', 'TXN_2024_002', 'Completed', DATEADD(day, -25, GETDATE()), 'Payment for Neurology Fundamentals course'),
(9, 6000.00, 'INR', 'Razorpay', 'TXN_2024_003', 'Completed', DATEADD(day, -20, GETDATE()), 'Payment for Orthopedic Surgery Basics course'),
(10, 3500.00, 'INR', 'Stripe', 'TXN_2024_004', 'Completed', DATEADD(day, -12, GETDATE()), 'Payment for Pediatric Care Essentials course'),
(11, 4000.00, 'INR', 'Razorpay', 'TXN_2024_005', 'Completed', DATEADD(day, -8, GETDATE()), 'Payment for Emergency Medicine Protocols course'),
(12, 5500.00, 'INR', 'Stripe', 'TXN_2024_006', 'Completed', DATEADD(day, -18, GETDATE()), 'Payment for Internal Medicine Overview course');

-- Insert Audit Logs
INSERT INTO AuditLogs (UserId, Action, EntityType, EntityId, OldValues, NewValues, Timestamp, IpAddress)
VALUES
(1, 'Document Verification', 'Document', 1, '{"VerificationStatus": "Pending"}', '{"VerificationStatus": "Verified", "VerifiedBy": 1}', DATEADD(day, -30, GETDATE()), '192.168.1.100'),
(1, 'User Profile Update', 'User', 7, '{"Phone": "+919876543214"}', '{"Phone": "+919876543215"}', DATEADD(day, -15, GETDATE()), '192.168.1.101'),
(2, 'Job Posting', 'Job', 1, NULL, '{"Title": "Cardiology Resident", "CompanyId": 3}', DATEADD(day, -20, GETDATE()), '192.168.1.102'),
(1, 'Application Status Update', 'Application', 1, '{"Status": "Applied"}', '{"Status": "Shortlisted"}', DATEADD(day, -10, GETDATE()), '192.168.1.100'),
(2, 'Course Creation', 'Course', 1, NULL, '{"Title": "Advanced Cardiology", "InstructorId": 3}', DATEADD(day, -25, GETDATE()), '192.168.1.103'),
(1, 'Interview Scheduling', 'Interview', 1, NULL, '{"ApplicationId": 3, "ScheduledDate": "2024-12-15"}', DATEADD(day, -5, GETDATE()), '192.168.1.100');

PRINT 'Database setup completed successfully with dummy data!';
PRINT 'Total records inserted:';
PRINT '- Users: 12';
PRINT '- Students: 6';
PRINT '- Companies: 4';
PRINT '- Admins: 2';
PRINT '- Jobs: 6';
PRINT '- Applications: 8';
PRINT '- Interviews: 3';
PRINT '- Courses: 8';
PRINT '- Course Modules: 9';
PRINT '- Enrollments: 8';
PRINT '- Assessments: 6';
PRINT '- Assessment Questions: 6';
PRINT '- Documents: 11';
PRINT '- Notifications: 7';
PRINT '- Messages: 5';
PRINT '- Reviews: 6';
PRINT '- Payments: 6';
PRINT '- Audit Logs: 6';
GO