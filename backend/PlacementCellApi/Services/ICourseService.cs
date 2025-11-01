using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface ICourseService
{
    Task<IEnumerable<Course>> GetAllCoursesAsync();
    Task<Course> GetCourseByIdAsync(int id);
    Task<IEnumerable<Course>> GetCoursesByInstructorAsync(int instructorId);
    Task<IEnumerable<Course>> GetCoursesByCategoryAsync(string category);
    Task<IEnumerable<Course>> SearchCoursesAsync(string keyword);
    Task<Course> CreateCourseAsync(Course course);
    Task UpdateCourseAsync(Course course);
    Task DeleteCourseAsync(int id);
    Task<Course> GetCourseWithModulesAsync(int courseId);
    Task<IEnumerable<Course>> GetActiveCoursesAsync();
}