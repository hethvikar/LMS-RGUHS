using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class AssessmentQuestion
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AssessmentId { get; set; }

    [ForeignKey("AssessmentId")]
    public Assessment Assessment { get; set; }

    [Required]
    public string Question { get; set; }

    public string Options { get; set; } // JSON array of options

    public string CorrectAnswer { get; set; }

    public int Marks { get; set; } = 1;
}