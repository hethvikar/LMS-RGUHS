using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Message
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int SenderId { get; set; }

    [ForeignKey("SenderId")]
    public User Sender { get; set; }

    [Required]
    public int ReceiverId { get; set; }

    [ForeignKey("ReceiverId")]
    public User Receiver { get; set; }

    public string Subject { get; set; }

    public string Content { get; set; }

    public DateTime SentDate { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;
}