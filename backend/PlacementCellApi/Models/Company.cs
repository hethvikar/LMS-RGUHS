using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Company
{
    [Key]
    [ForeignKey("User")]
    public int Id { get; set; }

    public User User { get; set; }

    [Required]
    public string CompanyName { get; set; }

    public string Industry { get; set; }

    public string Website { get; set; }

    public string Description { get; set; }

    public string RegistrationNumber { get; set; }

    public string LicensePath { get; set; }

    public string KYCStatus { get; set; } = "Pending"; // Pending, Approved, Rejected

    public string Address { get; set; }

    public string City { get; set; }

    public string State { get; set; }

    public string Country { get; set; }

    public string ZipCode { get; set; }

    public string ContactPerson { get; set; }
}