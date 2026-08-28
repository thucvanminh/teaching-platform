using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeachFlow.Api.Models;

[Table("lessons")]
public class Lesson
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("process_id")]
    public Guid ProcessId { get; set; }

    [Required]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [Column("lesson_type")]
    public string LessonType { get; set; } = string.Empty;

    [Required]
    [Column("content_url")]
    public string ContentUrl { get; set; } = string.Empty;

    [Column("order_index")]
    public int OrderIndex { get; set; } = 0;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("ProcessId")]
    public Process Process { get; set; } = null!;

    public ICollection<LessonCompletion> Completions { get; set; } = new List<LessonCompletion>();
    public ICollection<LessonNote> Notes { get; set; } = new List<LessonNote>();
}
