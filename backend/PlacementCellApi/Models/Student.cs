using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Student
{
    [Key]
    [ForeignKey("User")]
    public int Id { get; set; }

    public User User { get; set; }

    public string MedicalSpecialization { get; set; }

    public int GraduationYear { get; set; }

    public decimal NEETScore { get; set; }

    public string ResumePath { get; set; }

    public string ProfilePicturePath { get; set; }

    public string Bio { get; set; }

    public string Address { get; set; }

    public string City { get; set; }

    public string State { get; set; }

    public string Country { get; set; }

    public string ZipCode { get; set; }
}