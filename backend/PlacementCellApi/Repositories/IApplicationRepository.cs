using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IApplicationRepository : IRepository<Application>
{
    Task<IEnumerable<Application>> GetApplicationsByStudentAsync(int studentId);
    Task<IEnumerable<Application>> GetApplicationsByJobAsync(int jobId);
    Task<Application> GetApplicationWithDetailsAsync(int applicationId);
    Task<bool> HasStudentAppliedForJobAsync(int studentId, int jobId);
}