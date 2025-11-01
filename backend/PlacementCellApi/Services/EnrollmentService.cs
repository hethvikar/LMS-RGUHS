using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepository;

    public EnrollmentService(IEnrollmentRepository enrollmentRepository)
    {
        _enrollmentRepository = enrollmentRepository;
    }

    public async Task<Enrollment> GetEnrollmentByIdAsync(int id)
    {
        return await _enrollmentRepository.GetEnrollmentWithDetailsAsync(id);
    }

    public async Task<IEnumerable<Enrollment>> GetEnrollmentsByStudentAsync(int studentId)
    {
        return await _enrollmentRepository.GetEnrollmentsByStudentAsync(studentId);
    }

    public async Task<IEnumerable<Enrollment>> GetEnrollmentsByCourseAsync(int courseId)
    {
        return await _enrollmentRepository.GetEnrollmentsByCourseAsync(courseId);
    }

    public async Task<Enrollment> EnrollStudentInCourseAsync(Enrollment enrollment)
    {
        // Check if student is already enrolled
        if (await _enrollmentRepository.IsStudentEnrolledInCourseAsync(enrollment.StudentId, enrollment.CourseId))
        {
            throw new InvalidOperationException("Student is already enrolled in this course");
        }

        enrollment.EnrolledDate = DateTime.UtcNow;
        return await _enrollmentRepository.AddAsync(enrollment);
    }

    public async Task UpdateEnrollmentProgressAsync(int enrollmentId, decimal progress)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId);
        if (enrollment != null)
        {
            enrollment.ProgressPercentage = progress;
            if (progress >= 100)
            {
                enrollment.CompletionDate = DateTime.UtcNow;
            }
            await _enrollmentRepository.UpdateAsync(enrollment);
        }
    }

    public async Task CompleteEnrollmentAsync(int enrollmentId)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId);
        if (enrollment != null)
        {
            enrollment.ProgressPercentage = 100;
            enrollment.CompletionDate = DateTime.UtcNow;
            await _enrollmentRepository.UpdateAsync(enrollment);
        }
    }

    public async Task<bool> IsStudentEnrolledAsync(int studentId, int courseId)
    {
        return await _enrollmentRepository.IsStudentEnrolledInCourseAsync(studentId, courseId);
    }

    public async Task<Enrollment> GetStudentEnrollmentAsync(int studentId, int courseId)
    {
        return await _enrollmentRepository.GetStudentEnrollmentAsync(studentId, courseId);
    }
}