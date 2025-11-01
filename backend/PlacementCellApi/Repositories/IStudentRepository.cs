using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IStudentRepository : IRepository<Student>
{
    Task<Student> GetStudentWithUserAsync(int studentId);
    Task<IEnumerable<Student>> GetStudentsBySpecializationAsync(string specialization);
    Task<Student> GetStudentByUserIdAsync(int userId);
}