using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IInterviewRepository : IRepository<Interview>
{
    Task<Interview> GetInterviewWithDetailsAsync(int interviewId);
    Task<IEnumerable<Interview>> GetInterviewsByApplicationAsync(int applicationId);
    Task<IEnumerable<Interview>> GetInterviewsByInterviewerAsync(string interviewerName);
    Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync();
    Task<IEnumerable<Interview>> GetInterviewsByDateRangeAsync(DateTime startDate, DateTime endDate);
}