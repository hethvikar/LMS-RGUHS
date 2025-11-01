using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InterviewsController : ControllerBase
{
    private readonly IInterviewService _interviewService;

    public InterviewsController(IInterviewService interviewService)
    {
        _interviewService = interviewService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInterview(int id)
    {
        var interview = await _interviewService.GetInterviewByIdAsync(id);
        if (interview == null)
            return NotFound(new { success = false, message = "Interview not found" });

        return Ok(new { success = true, data = interview });
    }

    [HttpGet("application/{applicationId}")]
    public async Task<IActionResult> GetInterviewsByApplication(int applicationId)
    {
        var interviews = await _interviewService.GetInterviewsByApplicationAsync(applicationId);
        return Ok(new { success = true, data = interviews });
    }

    [HttpGet("interviewer/{interviewerName}")]
    public async Task<IActionResult> GetInterviewsByInterviewer(string interviewerName)
    {
        var interviews = await _interviewService.GetInterviewsByInterviewerAsync(interviewerName);
        return Ok(new { success = true, data = interviews });
    }

    [HttpPost]
    [Authorize(Roles = "Company,Admin")]
    public async Task<IActionResult> CreateInterview([FromBody] Interview interview)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid interview data" });

        var createdInterview = await _interviewService.CreateInterviewAsync(interview);
        return CreatedAtAction(nameof(GetInterview), new { id = createdInterview.Id },
            new { success = true, data = createdInterview, message = "Interview scheduled successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Company,Admin")]
    public async Task<IActionResult> UpdateInterview(int id, [FromBody] Interview interview)
    {
        if (id != interview.Id)
            return BadRequest(new { success = false, message = "Interview ID mismatch" });

        var existingInterview = await _interviewService.GetInterviewByIdAsync(id);
        if (existingInterview == null)
            return NotFound(new { success = false, message = "Interview not found" });

        await _interviewService.UpdateInterviewAsync(interview);
        return Ok(new { success = true, message = "Interview updated successfully" });
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Company,Admin")]
    public async Task<IActionResult> UpdateInterviewStatus(int id, [FromBody] string status)
    {
        await _interviewService.UpdateInterviewStatusAsync(id, status);
        return Ok(new { success = true, message = "Interview status updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Company,Admin")]
    public async Task<IActionResult> DeleteInterview(int id)
    {
        var interview = await _interviewService.GetInterviewByIdAsync(id);
        if (interview == null)
            return NotFound(new { success = false, message = "Interview not found" });

        await _interviewService.DeleteInterviewAsync(id);
        return Ok(new { success = true, message = "Interview cancelled successfully" });
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingInterviews()
    {
        var interviews = await _interviewService.GetUpcomingInterviewsAsync();
        return Ok(new { success = true, data = interviews });
    }

    [HttpGet("daterange")]
    public async Task<IActionResult> GetInterviewsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var interviews = await _interviewService.GetInterviewsByDateRangeAsync(startDate, endDate);
        return Ok(new { success = true, data = interviews });
    }
}