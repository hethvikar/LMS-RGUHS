-- Database Setup Script for Student Placement Cell System
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- Instructions:
-- 1. Open SQL Server Management Studio
-- 2. Connect to your SQL Server instance
-- 3. Open this file
-- 4. Execute the script

-- The script will:
-- 1. Create the PlacementCellDb database (if it doesn't exist)
-- 2. Create all tables with proper relationships
-- 3. Insert comprehensive dummy data for testing
-- 4. Create necessary indexes for performance

-- Note: This script uses dummy data for development and testing purposes.
-- In production, you should use real data and implement proper security measures.

-- Execute the main script
:r dummy-data.sql

-- Verification queries (optional - run these after setup to verify data)
-- SELECT COUNT(*) as TotalUsers FROM Users;
-- SELECT COUNT(*) as TotalStudents FROM Students;
-- SELECT COUNT(*) as TotalCompanies FROM Companies;
-- SELECT COUNT(*) as TotalJobs FROM Jobs;
-- SELECT COUNT(*) as TotalApplications FROM Applications;
-- SELECT COUNT(*) as TotalCourses FROM Courses;
-- SELECT COUNT(*) as TotalEnrollments FROM Enrollments;

PRINT 'Database setup verification:';
SELECT
    (SELECT COUNT(*) FROM Users) as Users,
    (SELECT COUNT(*) FROM Students) as Students,
    (SELECT COUNT(*) FROM Companies) as Companies,
    (SELECT COUNT(*) FROM Jobs) as Jobs,
    (SELECT COUNT(*) FROM Applications) as Applications,
    (SELECT COUNT(*) FROM Courses) as Courses,
    (SELECT COUNT(*) FROM Enrollments) as Enrollments,
    (SELECT COUNT(*) FROM Documents) as Documents;
GO