using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentsController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEnrollment(int id)
    {
        var enrollment = await _enrollmentService.GetEnrollmentByIdAsync(id);
        if (enrollment == null)
            return NotFound(new { success = false, message = "Enrollment not found" });

        return Ok(new { success = true, data = enrollment });
    }

    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetEnrollmentsByStudent(int studentId)
    {
        var enrollments = await _enrollmentService.GetEnrollmentsByStudentAsync(studentId);
        return Ok(new { success = true, data = enrollments });
    }

    [HttpGet("course/{courseId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetEnrollmentsByCourse(int courseId)
    {
        var enrollments = await _enrollmentService.GetEnrollmentsByCourseAsync(courseId);
        return Ok(new { success = true, data = enrollments });
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> EnrollInCourse([FromBody] Enrollment enrollment)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid enrollment data" });

        try
        {
            var createdEnrollment = await _enrollmentService.EnrollStudentInCourseAsync(enrollment);
            return CreatedAtAction(nameof(GetEnrollment), new { id = createdEnrollment.Id },
                new { success = true, data = createdEnrollment, message = "Successfully enrolled in course" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}/progress")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] decimal progress)
    {
        await _enrollmentService.UpdateEnrollmentProgressAsync(id, progress);
        return Ok(new { success = true, message = "Progress updated successfully" });
    }

    [HttpPut("{id}/complete")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CompleteEnrollment(int id)
    {
        await _enrollmentService.CompleteEnrollmentAsync(id);
        return Ok(new { success = true, message = "Course completed successfully" });
    }

    [HttpGet("check/{studentId}/{courseId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CheckEnrollment(int studentId, int courseId)
    {
        var isEnrolled = await _enrollmentService.IsStudentEnrolledAsync(studentId, courseId);
        return Ok(new { success = true, isEnrolled });
    }

    [HttpGet("student/{studentId}/course/{courseId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetStudentEnrollment(int studentId, int courseId)
    {
        var enrollment = await _enrollmentService.GetStudentEnrollmentAsync(studentId, courseId);
        if (enrollment == null)
            return NotFound(new { success = false, message = "Enrollment not found" });

        return Ok(new { success = true, data = enrollment });
    }
}