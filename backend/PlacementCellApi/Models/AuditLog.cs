using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class AuditLog
{
    [Key]
    public int Id { get; set; }

    public int? UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    public string Action { get; set; }

    public string EntityType { get; set; }

    public int? EntityId { get; set; }

    public string OldValues { get; set; } // JSON string

    public string NewValues { get; set; } // JSON string

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public string IpAddress { get; set; }
}