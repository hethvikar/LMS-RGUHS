using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Admin
{
    [Key]
    [ForeignKey("User")]
    public int Id { get; set; }

    public User User { get; set; }

    public string Permissions { get; set; } // JSON string of permissions
}