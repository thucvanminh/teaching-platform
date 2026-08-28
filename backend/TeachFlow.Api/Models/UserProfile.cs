using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeachFlow.Api.Models;

[Table("user_profiles")]
public class UserProfile
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Column("role")]
    public string Role { get; set; } = string.Empty;

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Process> Processes { get; set; } = new List<Process>();
    public ICollection<StudentProcess> StudentProcesses { get; set; } = new List<StudentProcess>();
    public ICollection<LessonCompletion> LessonCompletions { get; set; } = new List<LessonCompletion>();
    public ICollection<LessonNote> Notes { get; set; } = new List<LessonNote>();
}
