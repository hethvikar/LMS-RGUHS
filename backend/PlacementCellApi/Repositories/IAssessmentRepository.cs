using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IAssessmentRepository : IRepository<Assessment>
{
    Task<IEnumerable<Assessment>> GetAssessmentsByCourseAsync(int courseId);
    Task<Assessment> GetAssessmentWithQuestionsAsync(int assessmentId);
    Task<IEnumerable<AssessmentQuestion>> GetAssessmentQuestionsAsync(int assessmentId);
}