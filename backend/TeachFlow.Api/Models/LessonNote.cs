using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeachFlow.Api.Models;

[Table("lesson_notes")]
public class LessonNote
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("lesson_id")]
    public Guid LessonId { get; set; }

    [Required]
    [Column("author_id")]
    public Guid AuthorId { get; set; }

    [Required]
    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("LessonId")]
    public Lesson Lesson { get; set; } = null!;

    [ForeignKey("AuthorId")]
    public UserProfile Author { get; set; } = null!;
}
