using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class StudentAnswer
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int EnrollmentId { get; set; }

    [ForeignKey("EnrollmentId")]
    public Enrollment Enrollment { get; set; }

    [Required]
    public int AssessmentId { get; set; }

    [ForeignKey("AssessmentId")]
    public Assessment Assessment { get; set; }

    [Required]
    public int QuestionId { get; set; }

    [ForeignKey("QuestionId")]
    public AssessmentQuestion Question { get; set; }

    public string Answer { get; set; }

    public bool IsCorrect { get; set; }

    public int MarksObtained { get; set; }
}