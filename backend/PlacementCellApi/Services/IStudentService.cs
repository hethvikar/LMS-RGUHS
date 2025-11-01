using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IStudentService
{
    Task<Student> GetStudentProfileAsync(int studentId);
    Task<Student> CreateStudentProfileAsync(Student student);
    Task UpdateStudentProfileAsync(Student student);
    Task<IEnumerable<Student>> GetStudentsBySpecializationAsync(string specialization);
    Task<Student> GetStudentByUserIdAsync(int userId);
}