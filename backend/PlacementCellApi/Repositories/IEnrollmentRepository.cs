using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IEnrollmentRepository : IRepository<Enrollment>
{
    Task<IEnumerable<Enrollment>> GetEnrollmentsByStudentAsync(int studentId);
    Task<IEnumerable<Enrollment>> GetEnrollmentsByCourseAsync(int courseId);
    Task<Enrollment> GetEnrollmentWithDetailsAsync(int enrollmentId);
    Task<bool> IsStudentEnrolledInCourseAsync(int studentId, int courseId);
    Task<Enrollment> GetStudentEnrollmentAsync(int studentId, int courseId);
}