using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class ApplicationRepository : Repository<Application>, IApplicationRepository
{
    public ApplicationRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Application>> GetApplicationsByStudentAsync(int studentId)
    {
        return await _context.Applications
            .Include(a => a.Job)
            .ThenInclude(j => j.Company)
            .Where(a => a.StudentId == studentId)
            .OrderByDescending(a => a.AppliedDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Application>> GetApplicationsByJobAsync(int jobId)
    {
        return await _context.Applications
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Where(a => a.JobId == jobId)
            .OrderByDescending(a => a.AppliedDate)
            .ToListAsync();
    }

    public async Task<Application> GetApplicationWithDetailsAsync(int applicationId)
    {
        return await _context.Applications
            .Include(a => a.Student)
            .ThenInclude(s => s.User)
            .Include(a => a.Job)
            .ThenInclude(j => j.Company)
            .FirstOrDefaultAsync(a => a.Id == applicationId);
    }

    public async Task<bool> HasStudentAppliedForJobAsync(int studentId, int jobId)
    {
        return await _context.Applications
            .AnyAsync(a => a.StudentId == studentId && a.JobId == jobId);
    }
}