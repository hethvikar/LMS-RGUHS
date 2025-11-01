using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCourses()
    {
        var courses = await _courseService.GetAllCoursesAsync();
        return Ok(new { success = true, data = courses });
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCourses([FromQuery] string keyword = "")
    {
        var courses = await _courseService.SearchCoursesAsync(keyword);
        return Ok(new { success = true, data = courses });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourse(int id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);
        if (course == null)
            return NotFound(new { success = false, message = "Course not found" });

        return Ok(new { success = true, data = course });
    }

    [HttpGet("{id}/modules")]
    public async Task<IActionResult> GetCourseWithModules(int id)
    {
        var course = await _courseService.GetCourseWithModulesAsync(id);
        if (course == null)
            return NotFound(new { success = false, message = "Course not found" });

        return Ok(new { success = true, data = course });
    }

    [HttpGet("instructor/{instructorId}")]
    [Authorize]
    public async Task<IActionResult> GetCoursesByInstructor(int instructorId)
    {
        var courses = await _courseService.GetCoursesByInstructorAsync(instructorId);
        return Ok(new { success = true, data = courses });
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetCoursesByCategory(string category)
    {
        var courses = await _courseService.GetCoursesByCategoryAsync(category);
        return Ok(new { success = true, data = courses });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCourse([FromBody] Course course)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid course data" });

        var createdCourse = await _courseService.CreateCourseAsync(course);
        return CreatedAtAction(nameof(GetCourse), new { id = createdCourse.Id },
            new { success = true, data = createdCourse, message = "Course created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        if (id != course.Id)
            return BadRequest(new { success = false, message = "Course ID mismatch" });

        var existingCourse = await _courseService.GetCourseByIdAsync(id);
        if (existingCourse == null)
            return NotFound(new { success = false, message = "Course not found" });

        await _courseService.UpdateCourseAsync(course);
        return Ok(new { success = true, message = "Course updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);
        if (course == null)
            return NotFound(new { success = false, message = "Course not found" });

        await _courseService.DeleteCourseAsync(id);
        return Ok(new { success = true, message = "Course deleted successfully" });
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveCourses()
    {
        var courses = await _courseService.GetActiveCoursesAsync();
        return Ok(new { success = true, data = courses });
    }
}