using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeachFlow.Api.Models;

[Table("lesson_completions")]
public class LessonCompletion
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("student_id")]
    public Guid StudentId { get; set; }

    [Required]
    [Column("lesson_id")]
    public Guid LessonId { get; set; }

    [Column("completed_at")]
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("StudentId")]
    public UserProfile Student { get; set; } = null!;

    [ForeignKey("LessonId")]
    public Lesson Lesson { get; set; } = null!;
}
