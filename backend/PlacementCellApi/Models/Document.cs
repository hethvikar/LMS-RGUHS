using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Document
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    [Required]
    public string DocumentType { get; set; } // Degree, License, Resume, etc.

    public string FileName { get; set; }

    public string FilePath { get; set; }

    public DateTime UploadDate { get; set; } = DateTime.UtcNow;

    public string VerificationStatus { get; set; } = "Pending"; // Pending, Verified, Rejected

    public int? VerifiedBy { get; set; }

    [ForeignKey("VerifiedBy")]
    public Admin VerifiedByAdmin { get; set; }

    public DateTime? VerifiedDate { get; set; }
}