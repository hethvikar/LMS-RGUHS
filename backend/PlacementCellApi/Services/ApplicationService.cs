using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _applicationRepository;

    public ApplicationService(IApplicationRepository applicationRepository)
    {
        _applicationRepository = applicationRepository;
    }

    public async Task<Application> GetApplicationByIdAsync(int id)
    {
        return await _applicationRepository.GetApplicationWithDetailsAsync(id);
    }

    public async Task<IEnumerable<Application>> GetApplicationsByStudentAsync(int studentId)
    {
        return await _applicationRepository.GetApplicationsByStudentAsync(studentId);
    }

    public async Task<IEnumerable<Application>> GetApplicationsByJobAsync(int jobId)
    {
        return await _applicationRepository.GetApplicationsByJobAsync(jobId);
    }

    public async Task<Application> CreateApplicationAsync(Application application)
    {
        // Check if student has already applied
        if (await _applicationRepository.HasStudentAppliedForJobAsync(application.StudentId, application.JobId))
        {
            throw new InvalidOperationException("Student has already applied for this job");
        }

        return await _applicationRepository.AddAsync(application);
    }

    public async Task UpdateApplicationStatusAsync(int applicationId, string status)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application != null)
        {
            application.Status = status;
            await _applicationRepository.UpdateAsync(application);
        }
    }

    public async Task WithdrawApplicationAsync(int applicationId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application != null)
        {
            application.Status = "Withdrawn";
            await _applicationRepository.UpdateAsync(application);
        }
    }

    public async Task<bool> CanStudentApplyForJobAsync(int studentId, int jobId)
    {
        return !await _applicationRepository.HasStudentAppliedForJobAsync(studentId, jobId);
    }
}