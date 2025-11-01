using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Enrollment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int StudentId { get; set; }

    [ForeignKey("StudentId")]
    public Student Student { get; set; }

    [Required]
    public int CourseId { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }

    public DateTime EnrolledDate { get; set; } = DateTime.UtcNow;

    public decimal ProgressPercentage { get; set; } = 0;

    public DateTime? CompletionDate { get; set; }

    public string CertificatePath { get; set; }
}