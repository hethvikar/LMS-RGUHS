using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Interview
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ApplicationId { get; set; }

    [ForeignKey("ApplicationId")]
    public Application Application { get; set; }

    public DateTime ScheduledDate { get; set; }

    public string InterviewType { get; set; } // Online, Offline

    public string Platform { get; set; } // Zoom, Google Meet

    public string MeetingLink { get; set; }

    public string Interviewer { get; set; }

    public string Notes { get; set; }

    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled
}