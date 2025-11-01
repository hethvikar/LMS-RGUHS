using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssessmentsController : ControllerBase
{
    private readonly IAssessmentService _assessmentService;

    public AssessmentsController(IAssessmentService assessmentService)
    {
        _assessmentService = assessmentService;
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetAssessmentsByCourse(int courseId)
    {
        var assessments = await _assessmentService.GetAssessmentsByCourseAsync(courseId);
        return Ok(new { success = true, data = assessments });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAssessment(int id)
    {
        var assessment = await _assessmentService.GetAssessmentByIdAsync(id);
        if (assessment == null)
            return NotFound(new { success = false, message = "Assessment not found" });

        return Ok(new { success = true, data = assessment });
    }

    [HttpGet("{id}/questions")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetAssessmentWithQuestions(int id)
    {
        var assessment = await _assessmentService.GetAssessmentWithQuestionsAsync(id);
        if (assessment == null)
            return NotFound(new { success = false, message = "Assessment not found" });

        return Ok(new { success = true, data = assessment });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAssessment([FromBody] Assessment assessment)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid assessment data" });

        var createdAssessment = await _assessmentService.CreateAssessmentAsync(assessment);
        return CreatedAtAction(nameof(GetAssessment), new { id = createdAssessment.Id },
            new { success = true, data = createdAssessment, message = "Assessment created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAssessment(int id, [FromBody] Assessment assessment)
    {
        if (id != assessment.Id)
            return BadRequest(new { success = false, message = "Assessment ID mismatch" });

        var existingAssessment = await _assessmentService.GetAssessmentByIdAsync(id);
        if (existingAssessment == null)
            return NotFound(new { success = false, message = "Assessment not found" });

        await _assessmentService.UpdateAssessmentAsync(assessment);
        return Ok(new { success = true, message = "Assessment updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAssessment(int id)
    {
        var assessment = await _assessmentService.GetAssessmentByIdAsync(id);
        if (assessment == null)
            return NotFound(new { success = false, message = "Assessment not found" });

        await _assessmentService.DeleteAssessmentAsync(id);
        return Ok(new { success = true, message = "Assessment deleted successfully" });
    }

    [HttpPost("{id}/submit")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> SubmitAssessment(int id, [FromBody] List<StudentAnswer> answers)
    {
        // Get student ID from JWT token
        var userIdClaim = User.FindFirst("sub");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            return Unauthorized();

        await _assessmentService.SubmitAssessmentAsync(id, userId, answers);
        var score = await _assessmentService.CalculateAssessmentScoreAsync(id, userId);

        return Ok(new { success = true, score, message = "Assessment submitted successfully" });
    }
}