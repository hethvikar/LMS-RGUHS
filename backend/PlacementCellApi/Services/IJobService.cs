using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IJobService
{
    Task<IEnumerable<Job>> GetAllJobsAsync();
    Task<IEnumerable<Job>> GetJobsByCompanyAsync(int companyId);
    Task<IEnumerable<Job>> SearchJobsAsync(string keyword, string location, string jobType);
    Task<Job> GetJobByIdAsync(int id);
    Task<Job> CreateJobAsync(Job job);
    Task UpdateJobAsync(Job job);
    Task DeleteJobAsync(int id);
    Task<IEnumerable<Job>> GetActiveJobsAsync();
}