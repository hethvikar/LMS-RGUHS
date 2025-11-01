using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlacementCellApi.Models;

public class Review
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ReviewerId { get; set; }

    [ForeignKey("ReviewerId")]
    public User Reviewer { get; set; }

    [Required]
    public int RevieweeId { get; set; }

    [ForeignKey("RevieweeId")]
    public User Reviewee { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    public string Comment { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}