using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class JobService : IJobService
{
    private readonly ApplicationDbContext _context;
    private readonly IRepository<Job> _jobRepository;

    public JobService(ApplicationDbContext context, IRepository<Job> jobRepository)
    {
        _context = context;
        _jobRepository = jobRepository;
    }

    public async Task<IEnumerable<Job>> GetAllJobsAsync()
    {
        return await _jobRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Job>> GetJobsByCompanyAsync(int companyId)
    {
        return await _jobRepository.FindAsync(j => j.CompanyId == companyId);
    }

    public async Task<IEnumerable<Job>> SearchJobsAsync(string keyword, string location, string jobType)
    {
        var query = _context.Jobs.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(j => j.Title.Contains(keyword) ||
                                    j.Description.Contains(keyword) ||
                                    j.Requirements.Contains(keyword));
        }

        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(j => j.Location.Contains(location));
        }

        if (!string.IsNullOrEmpty(jobType))
        {
            query = query.Where(j => j.JobType == jobType);
        }

        query = query.Where(j => j.IsActive && j.Deadline > DateTime.UtcNow);

        return await query.Include(j => j.Company).ToListAsync();
    }

    public async Task<Job> GetJobByIdAsync(int id)
    {
        return await _context.Jobs
            .Include(j => j.Company)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<Job> CreateJobAsync(Job job)
    {
        job.PostedDate = DateTime.UtcNow;
        return await _jobRepository.AddAsync(job);
    }

    public async Task UpdateJobAsync(Job job)
    {
        await _jobRepository.UpdateAsync(job);
    }

    public async Task DeleteJobAsync(int id)
    {
        var job = await _jobRepository.GetByIdAsync(id);
        if (job != null)
        {
            await _jobRepository.DeleteAsync(job);
        }
    }

    public async Task<IEnumerable<Job>> GetActiveJobsAsync()
    {
        return await _jobRepository.FindAsync(j => j.IsActive && j.Deadline > DateTime.UtcNow);
    }
}