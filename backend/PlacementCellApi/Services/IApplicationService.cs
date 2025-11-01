using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IApplicationService
{
    Task<Application> GetApplicationByIdAsync(int id);
    Task<IEnumerable<Application>> GetApplicationsByStudentAsync(int studentId);
    Task<IEnumerable<Application>> GetApplicationsByJobAsync(int jobId);
    Task<Application> CreateApplicationAsync(Application application);
    Task UpdateApplicationStatusAsync(int applicationId, string status);
    Task WithdrawApplicationAsync(int applicationId);
    Task<bool> CanStudentApplyForJobAsync(int studentId, int jobId);
}