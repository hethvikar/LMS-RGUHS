using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface ICourseRepository : IRepository<Course>
{
    Task<IEnumerable<Course>> GetCoursesByInstructorAsync(int instructorId);
    Task<IEnumerable<Course>> GetCoursesByCategoryAsync(string category);
    Task<IEnumerable<Course>> SearchCoursesAsync(string keyword);
    Task<Course> GetCourseWithModulesAsync(int courseId);
    Task<IEnumerable<Course>> GetActiveCoursesAsync();
}