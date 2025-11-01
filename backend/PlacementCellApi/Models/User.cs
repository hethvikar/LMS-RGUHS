using System.ComponentModel.DataAnnotations;

namespace PlacementCellApi.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required]
    public string Role { get; set; } // Student, Company, Admin

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    public string Phone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    // Navigation properties - removed to avoid EF confusion
}