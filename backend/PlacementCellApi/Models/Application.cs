using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Application
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int StudentId { get; set; }

    [ForeignKey("StudentId")]
    public Student Student { get; set; }

    [Required]
    public int JobId { get; set; }

    [ForeignKey("JobId")]
    public Job Job { get; set; }

    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Applied"; // Applied, Shortlisted, Interviewed, Selected, Rejected, Withdrawn

    public string Notes { get; set; }
}