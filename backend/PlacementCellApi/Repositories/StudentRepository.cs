using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class StudentRepository : Repository<Student>, IStudentRepository
{
    public StudentRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Student> GetStudentWithUserAsync(int studentId)
    {
        return await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == studentId);
    }

    public async Task<IEnumerable<Student>> GetStudentsBySpecializationAsync(string specialization)
    {
        return await _context.Students
            .Include(s => s.User)
            .Where(s => s.MedicalSpecialization.Contains(specialization))
            .ToListAsync();
    }

    public async Task<Student> GetStudentByUserIdAsync(int userId)
    {
        return await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == userId);
    }
}