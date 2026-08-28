using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeachFlow.Api.Models;

[Table("processes")]
public class Process
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("teacher_id")]
    public Guid TeacherId { get; set; }

    [Required]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("TeacherId")]
    public UserProfile Teacher { get; set; } = null!;

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<StudentProcess> StudentProcesses { get; set; } = new List<StudentProcess>();
}
