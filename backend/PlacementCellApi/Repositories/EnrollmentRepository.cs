using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class EnrollmentRepository : Repository<Enrollment>, IEnrollmentRepository
{
    public EnrollmentRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Enrollment>> GetEnrollmentsByStudentAsync(int studentId)
    {
        return await _context.Enrollments
            .Include(e => e.Course)
            .ThenInclude(c => c.Instructor)
            .Where(e => e.StudentId == studentId)
            .OrderByDescending(e => e.EnrolledDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Enrollment>> GetEnrollmentsByCourseAsync(int courseId)
    {
        return await _context.Enrollments
            .Include(e => e.Student)
            .ThenInclude(s => s.User)
            .Where(e => e.CourseId == courseId)
            .OrderByDescending(e => e.EnrolledDate)
            .ToListAsync();
    }

    public async Task<Enrollment> GetEnrollmentWithDetailsAsync(int enrollmentId)
    {
        return await _context.Enrollments
            .Include(e => e.Student)
            .ThenInclude(s => s.User)
            .Include(e => e.Course)
            .ThenInclude(c => c.Instructor)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId);
    }

    public async Task<bool> IsStudentEnrolledInCourseAsync(int studentId, int courseId)
    {
        return await _context.Enrollments
            .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
    }

    public async Task<Enrollment> GetStudentEnrollmentAsync(int studentId, int courseId)
    {
        return await _context.Enrollments
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);
    }
}