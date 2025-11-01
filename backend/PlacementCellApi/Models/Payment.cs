using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    [Required]
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "USD";

    public string PaymentMethod { get; set; } // Stripe, Razorpay

    public string TransactionId { get; set; }

    public string Status { get; set; } // Pending, Completed, Failed

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public string Description { get; set; }
}