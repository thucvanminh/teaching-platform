using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeachFlow.Api.Models;

[Table("student_processes")]
public class StudentProcess
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Required]
    [Column("student_id")]
    public Guid StudentId { get; set; }

    [Required]
    [Column("process_id")]
    public Guid ProcessId { get; set; }

    [Column("assigned_at")]
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("StudentId")]
    public UserProfile Student { get; set; } = null!;

    [ForeignKey("ProcessId")]
    public Process Process { get; set; } = null!;
}
