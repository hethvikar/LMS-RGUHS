using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudentProfile(int id)
    {
        var student = await _studentService.GetStudentProfileAsync(id);
        if (student == null)
            return NotFound(new { success = false, message = "Student not found" });

        return Ok(new { success = true, data = student });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetStudentByUserId(int userId)
    {
        var student = await _studentService.GetStudentByUserIdAsync(userId);
        if (student == null)
            return NotFound(new { success = false, message = "Student profile not found" });

        return Ok(new { success = true, data = student });
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> CreateStudentProfile([FromBody] Student student)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid student data" });

        var createdStudent = await _studentService.CreateStudentProfileAsync(student);
        return CreatedAtAction(nameof(GetStudentProfile), new { id = createdStudent.Id },
            new { success = true, data = createdStudent, message = "Student profile created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> UpdateStudentProfile(int id, [FromBody] Student student)
    {
        if (id != student.Id)
            return BadRequest(new { success = false, message = "Student ID mismatch" });

        var existingStudent = await _studentService.GetStudentProfileAsync(id);
        if (existingStudent == null)
            return NotFound(new { success = false, message = "Student not found" });

        await _studentService.UpdateStudentProfileAsync(student);
        return Ok(new { success = true, message = "Student profile updated successfully" });
    }

    [HttpGet("specialization/{specialization}")]
    public async Task<IActionResult> GetStudentsBySpecialization(string specialization)
    {
        var students = await _studentService.GetStudentsBySpecializationAsync(specialization);
        return Ok(new { success = true, data = students });
    }
}