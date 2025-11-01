using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllJobs()
    {
        var jobs = await _jobService.GetAllJobsAsync();
        return Ok(new { success = true, data = jobs });
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchJobs([FromQuery] string keyword = "", [FromQuery] string location = "", [FromQuery] string jobType = "")
    {
        var jobs = await _jobService.SearchJobsAsync(keyword, location, jobType);
        return Ok(new { success = true, data = jobs });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null)
            return NotFound(new { success = false, message = "Job not found" });

        return Ok(new { success = true, data = job });
    }

    [HttpGet("company/{companyId}")]
    [Authorize]
    public async Task<IActionResult> GetJobsByCompany(int companyId)
    {
        var jobs = await _jobService.GetJobsByCompanyAsync(companyId);
        return Ok(new { success = true, data = jobs });
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> CreateJob([FromBody] Job job)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid job data" });

        var createdJob = await _jobService.CreateJobAsync(job);
        return CreatedAtAction(nameof(GetJob), new { id = createdJob.Id },
            new { success = true, data = createdJob, message = "Job created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] Job job)
    {
        if (id != job.Id)
            return BadRequest(new { success = false, message = "Job ID mismatch" });

        var existingJob = await _jobService.GetJobByIdAsync(id);
        if (existingJob == null)
            return NotFound(new { success = false, message = "Job not found" });

        await _jobService.UpdateJobAsync(job);
        return Ok(new { success = true, message = "Job updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null)
            return NotFound(new { success = false, message = "Job not found" });

        await _jobService.DeleteJobAsync(id);
        return Ok(new { success = true, message = "Job deleted successfully" });
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveJobs()
    {
        var jobs = await _jobService.GetActiveJobsAsync();
        return Ok(new { success = true, data = jobs });
    }
}