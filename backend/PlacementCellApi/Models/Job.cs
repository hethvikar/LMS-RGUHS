using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Job
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    public Company Company { get; set; }

    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    public string Requirements { get; set; }

    public string Department { get; set; }

    public string Location { get; set; }

    public string JobType { get; set; } // Full-time, Part-time, Internship

    public decimal SalaryMin { get; set; }

    public decimal SalaryMax { get; set; }

    public decimal Stipend { get; set; } // for internships

    public int DurationMonths { get; set; } // for internships

    public DateTime PostedDate { get; set; } = DateTime.UtcNow;

    public DateTime Deadline { get; set; }

    public bool IsActive { get; set; } = true;

    public string EligibilityCriteria { get; set; } // JSON string
}