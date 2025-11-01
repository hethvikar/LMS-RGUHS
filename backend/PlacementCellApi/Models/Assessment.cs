using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Assessment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CourseId { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }

    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    public string Type { get; set; } // Quiz, Exam

    public int TotalMarks { get; set; }

    public int PassingMarks { get; set; }

    public int DurationMinutes { get; set; }

    public bool IsTimed { get; set; } = true;

    // Navigation properties
    public ICollection<AssessmentQuestion> Questions { get; set; }
}