using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class InterviewRepository : Repository<Interview>, IInterviewRepository
{
    public InterviewRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Interview> GetInterviewWithDetailsAsync(int interviewId)
    {
        return await _context.Interviews
            .Include(i => i.Application)
            .ThenInclude(a => a.Student)
            .ThenInclude(s => s.User)
            .Include(i => i.Application.Job)
            .ThenInclude(j => j.Company)
            .FirstOrDefaultAsync(i => i.Id == interviewId);
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByApplicationAsync(int applicationId)
    {
        return await _context.Interviews
            .Include(i => i.Application)
            .Where(i => i.ApplicationId == applicationId)
            .OrderByDescending(i => i.ScheduledDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByInterviewerAsync(string interviewerName)
    {
        return await _context.Interviews
            .Include(i => i.Application)
            .ThenInclude(a => a.Student.User)
            .Include(i => i.Application.Job)
            .Where(i => i.Interviewer == interviewerName)
            .OrderBy(i => i.ScheduledDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync()
    {
        return await _context.Interviews
            .Include(i => i.Application)
            .ThenInclude(a => a.Student.User)
            .Include(i => i.Application.Job)
            .Where(i => i.ScheduledDate > DateTime.UtcNow && i.Status != "Cancelled")
            .OrderBy(i => i.ScheduledDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Interviews
            .Include(i => i.Application)
            .ThenInclude(a => a.Student.User)
            .Include(i => i.Application.Job)
            .Where(i => i.ScheduledDate >= startDate && i.ScheduledDate <= endDate)
            .OrderBy(i => i.ScheduledDate)
            .ToListAsync();
    }
}