using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class AssessmentRepository : Repository<Assessment>, IAssessmentRepository
{
    public AssessmentRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Assessment>> GetAssessmentsByCourseAsync(int courseId)
    {
        return await _context.Assessments
            .Include(a => a.Questions)
            .Where(a => a.CourseId == courseId)
            .ToListAsync();
    }

    public async Task<Assessment> GetAssessmentWithQuestionsAsync(int assessmentId)
    {
        return await _context.Assessments
            .Include(a => a.Questions.OrderBy(q => q.Id))
            .FirstOrDefaultAsync(a => a.Id == assessmentId);
    }

    public async Task<IEnumerable<AssessmentQuestion>> GetAssessmentQuestionsAsync(int assessmentId)
    {
        return await _context.AssessmentQuestions
            .Where(q => q.AssessmentId == assessmentId)
            .OrderBy(q => q.Id)
            .ToListAsync();
    }
}