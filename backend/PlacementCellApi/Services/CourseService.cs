using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;

    public CourseService(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<IEnumerable<Course>> GetAllCoursesAsync()
    {
        return await _courseRepository.GetAllAsync();
    }

    public async Task<Course> GetCourseByIdAsync(int id)
    {
        return await _courseRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Course>> GetCoursesByInstructorAsync(int instructorId)
    {
        return await _courseRepository.GetCoursesByInstructorAsync(instructorId);
    }

    public async Task<IEnumerable<Course>> GetCoursesByCategoryAsync(string category)
    {
        return await _courseRepository.GetCoursesByCategoryAsync(category);
    }

    public async Task<IEnumerable<Course>> SearchCoursesAsync(string keyword)
    {
        return await _courseRepository.SearchCoursesAsync(keyword);
    }

    public async Task<Course> CreateCourseAsync(Course course)
    {
        course.CreatedDate = DateTime.UtcNow;
        return await _courseRepository.AddAsync(course);
    }

    public async Task UpdateCourseAsync(Course course)
    {
        await _courseRepository.UpdateAsync(course);
    }

    public async Task DeleteCourseAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course != null)
        {
            await _courseRepository.DeleteAsync(course);
        }
    }

    public async Task<Course> GetCourseWithModulesAsync(int courseId)
    {
        return await _courseRepository.GetCourseWithModulesAsync(courseId);
    }

    public async Task<IEnumerable<Course>> GetActiveCoursesAsync()
    {
        return await _courseRepository.GetActiveCoursesAsync();
    }
}