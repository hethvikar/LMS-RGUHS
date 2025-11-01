using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetApplication(int id)
    {
        var application = await _applicationService.GetApplicationByIdAsync(id);
        if (application == null)
            return NotFound(new { success = false, message = "Application not found" });

        return Ok(new { success = true, data = application });
    }

    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetApplicationsByStudent(int studentId)
    {
        var applications = await _applicationService.GetApplicationsByStudentAsync(studentId);
        return Ok(new { success = true, data = applications });
    }

    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetApplicationsByJob(int jobId)
    {
        var applications = await _applicationService.GetApplicationsByJobAsync(jobId);
        return Ok(new { success = true, data = applications });
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CreateApplication([FromBody] Application application)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid application data" });

        try
        {
            var createdApplication = await _applicationService.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetApplication), new { id = createdApplication.Id },
                new { success = true, data = createdApplication, message = "Application submitted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] string status)
    {
        await _applicationService.UpdateApplicationStatusAsync(id, status);
        return Ok(new { success = true, message = "Application status updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> WithdrawApplication(int id)
    {
        await _applicationService.WithdrawApplicationAsync(id);
        return Ok(new { success = true, message = "Application withdrawn successfully" });
    }

    [HttpGet("can-apply/{studentId}/{jobId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CanApply(int studentId, int jobId)
    {
        var canApply = await _applicationService.CanStudentApplyForJobAsync(studentId, jobId);
        return Ok(new { success = true, canApply });
    }
}