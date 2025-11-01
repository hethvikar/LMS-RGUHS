using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IInterviewService
{
    Task<Interview> GetInterviewByIdAsync(int id);
    Task<IEnumerable<Interview>> GetInterviewsByApplicationAsync(int applicationId);
    Task<IEnumerable<Interview>> GetInterviewsByInterviewerAsync(string interviewerName);
    Task<Interview> CreateInterviewAsync(Interview interview);
    Task UpdateInterviewAsync(Interview interview);
    Task UpdateInterviewStatusAsync(int interviewId, string status);
    Task DeleteInterviewAsync(int id);
    Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync();
    Task<IEnumerable<Interview>> GetInterviewsByDateRangeAsync(DateTime startDate, DateTime endDate);
}