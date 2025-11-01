using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class CourseRepository : Repository<Course>, ICourseRepository
{
    public CourseRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Course>> GetCoursesByInstructorAsync(int instructorId)
    {
        return await _context.Courses
            .Include(c => c.Instructor)
            .Where(c => c.InstructorId == instructorId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetCoursesByCategoryAsync(string category)
    {
        return await _context.Courses
            .Include(c => c.Instructor)
            .Where(c => c.Category.Contains(category))
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> SearchCoursesAsync(string keyword)
    {
        return await _context.Courses
            .Include(c => c.Instructor)
            .Where(c => c.Title.Contains(keyword) ||
                       c.Description.Contains(keyword) ||
                       c.Category.Contains(keyword))
            .ToListAsync();
    }

    public async Task<Course> GetCourseWithModulesAsync(int courseId)
    {
        return await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
            .FirstOrDefaultAsync(c => c.Id == courseId);
    }

    public async Task<IEnumerable<Course>> GetActiveCoursesAsync()
    {
        return await _context.Courses
            .Include(c => c.Instructor)
            .Where(c => c.IsActive)
            .ToListAsync();
    }
}