using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IAssessmentService
{
    Task<IEnumerable<Assessment>> GetAssessmentsByCourseAsync(int courseId);
    Task<Assessment> GetAssessmentByIdAsync(int id);
    Task<Assessment> CreateAssessmentAsync(Assessment assessment);
    Task UpdateAssessmentAsync(Assessment assessment);
    Task DeleteAssessmentAsync(int id);
    Task<Assessment> GetAssessmentWithQuestionsAsync(int assessmentId);
    Task SubmitAssessmentAsync(int assessmentId, int studentId, List<StudentAnswer> answers);
    Task<decimal> CalculateAssessmentScoreAsync(int assessmentId, int studentId);
}