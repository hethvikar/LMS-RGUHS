using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class AssessmentService : IAssessmentService
{
    private readonly IAssessmentRepository _assessmentRepository;

    public AssessmentService(IAssessmentRepository assessmentRepository)
    {
        _assessmentRepository = assessmentRepository;
    }

    public async Task<IEnumerable<Assessment>> GetAssessmentsByCourseAsync(int courseId)
    {
        return await _assessmentRepository.GetAssessmentsByCourseAsync(courseId);
    }

    public async Task<Assessment> GetAssessmentByIdAsync(int id)
    {
        return await _assessmentRepository.GetByIdAsync(id);
    }

    public async Task<Assessment> CreateAssessmentAsync(Assessment assessment)
    {
        return await _assessmentRepository.AddAsync(assessment);
    }

    public async Task UpdateAssessmentAsync(Assessment assessment)
    {
        await _assessmentRepository.UpdateAsync(assessment);
    }

    public async Task DeleteAssessmentAsync(int id)
    {
        var assessment = await _assessmentRepository.GetByIdAsync(id);
        if (assessment != null)
        {
            await _assessmentRepository.DeleteAsync(assessment);
        }
    }

    public async Task<Assessment> GetAssessmentWithQuestionsAsync(int assessmentId)
    {
        return await _assessmentRepository.GetAssessmentWithQuestionsAsync(assessmentId);
    }

    public async Task SubmitAssessmentAsync(int assessmentId, int studentId, List<StudentAnswer> answers)
    {
        // Implementation for submitting assessment answers
        // This would save the answers to StudentAnswers table
        // and calculate the score
    }

    public async Task<decimal> CalculateAssessmentScoreAsync(int assessmentId, int studentId)
    {
        // Implementation for calculating assessment score
        // This would compare student answers with correct answers
        return 0; // Placeholder
    }
}