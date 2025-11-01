using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Course
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    public string Category { get; set; }

    public int InstructorId { get; set; }

    [ForeignKey("InstructorId")]
    public User Instructor { get; set; }

    public int DurationHours { get; set; }

    public decimal Price { get; set; }

    public bool IsPaid { get; set; } = false;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<CourseModule> Modules { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; }
}