using Microsoft.EntityFrameworkCore;
using TeachFlow.Api.Models;

namespace TeachFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Process> Processes => Set<Process>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<StudentProcess> StudentProcesses => Set<StudentProcess>();
    public DbSet<LessonCompletion> LessonCompletions => Set<LessonCompletion>();
    public DbSet<LessonNote> LessonNotes => Set<LessonNote>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StudentProcess>()
            .HasIndex(sp => new { sp.StudentId, sp.ProcessId })
            .IsUnique();

        modelBuilder.Entity<LessonCompletion>()
            .HasIndex(lc => new { lc.StudentId, lc.LessonId })
            .IsUnique();
    }
}
