using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepository;

    public StudentService(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<Student> GetStudentProfileAsync(int studentId)
    {
        return await _studentRepository.GetStudentWithUserAsync(studentId);
    }

    public async Task<Student> CreateStudentProfileAsync(Student student)
    {
        return await _studentRepository.AddAsync(student);
    }

    public async Task UpdateStudentProfileAsync(Student student)
    {
        await _studentRepository.UpdateAsync(student);
    }

    public async Task<IEnumerable<Student>> GetStudentsBySpecializationAsync(string specialization)
    {
        return await _studentRepository.GetStudentsBySpecializationAsync(specialization);
    }

    public async Task<Student> GetStudentByUserIdAsync(int userId)
    {
        return await _studentRepository.GetStudentByUserIdAsync(userId);
    }
}