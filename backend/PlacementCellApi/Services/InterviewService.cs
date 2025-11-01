using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class InterviewService : IInterviewService
{
    private readonly IInterviewRepository _interviewRepository;

    public InterviewService(IInterviewRepository interviewRepository)
    {
        _interviewRepository = interviewRepository;
    }

    public async Task<Interview> GetInterviewByIdAsync(int id)
    {
        return await _interviewRepository.GetInterviewWithDetailsAsync(id);
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByApplicationAsync(int applicationId)
    {
        return await _interviewRepository.GetInterviewsByApplicationAsync(applicationId);
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByInterviewerAsync(string interviewerName)
    {
        return await _interviewRepository.GetInterviewsByInterviewerAsync(interviewerName);
    }

    public async Task<Interview> CreateInterviewAsync(Interview interview)
    {
        return await _interviewRepository.AddAsync(interview);
    }

    public async Task UpdateInterviewAsync(Interview interview)
    {
        await _interviewRepository.UpdateAsync(interview);
    }

    public async Task UpdateInterviewStatusAsync(int interviewId, string status)
    {
        var interview = await _interviewRepository.GetByIdAsync(interviewId);
        if (interview != null)
        {
            interview.Status = status;
            await _interviewRepository.UpdateAsync(interview);
        }
    }

    public async Task DeleteInterviewAsync(int id)
    {
        var interview = await _interviewRepository.GetByIdAsync(id);
        if (interview != null)
        {
            await _interviewRepository.DeleteAsync(interview);
        }
    }

    public async Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync()
    {
        return await _interviewRepository.GetUpcomingInterviewsAsync();
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _interviewRepository.GetInterviewsByDateRangeAsync(startDate, endDate);
    }
}