using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IEnrollmentService
{
    Task<Enrollment> GetEnrollmentByIdAsync(int id);
    Task<IEnumerable<Enrollment>> GetEnrollmentsByStudentAsync(int studentId);
    Task<IEnumerable<Enrollment>> GetEnrollmentsByCourseAsync(int courseId);
    Task<Enrollment> EnrollStudentInCourseAsync(Enrollment enrollment);
    Task UpdateEnrollmentProgressAsync(int enrollmentId, decimal progress);
    Task CompleteEnrollmentAsync(int enrollmentId);
    Task<bool> IsStudentEnrolledAsync(int studentId, int courseId);
    Task<Enrollment> GetStudentEnrollmentAsync(int studentId, int courseId);
}