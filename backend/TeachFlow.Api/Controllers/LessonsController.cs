using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeachFlow.Api.Data;
using TeachFlow.Api.DTOs;
using TeachFlow.Api.Models;

namespace TeachFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LessonsController : ControllerBase
{
    private readonly AppDbContext _db;

    public LessonsController(AppDbContext db) => _db = db;

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<bool> IsTeacherOfProcess(Guid processId)
    {
        var userId = GetUserId();
        return await _db.Processes.AnyAsync(p => p.Id == processId && p.TeacherId == userId);
    }

    [HttpPost("process/{processId}")]
    public async Task<IActionResult> Create(Guid processId, [FromBody] CreateLessonRequest request)
    {
        if (!await IsTeacherOfProcess(processId)) return Forbid();

        var lesson = new Lesson
        {
            Id = Guid.NewGuid(),
            ProcessId = processId,
            Title = request.Title,
            Description = request.Description,
            LessonType = request.LessonType,
            ContentUrl = request.ContentUrl,
            OrderIndex = request.OrderIndex,
            CreatedAt = DateTime.UtcNow
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync();

        return CreatedAtAction(null, new { id = lesson.Id },
            new LessonDto(lesson.Id, lesson.Title, lesson.Description, lesson.LessonType, lesson.ContentUrl, lesson.OrderIndex));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLessonRequest request)
    {
        var lesson = await _db.Lessons.Include(l => l.Process).FirstOrDefaultAsync(l => l.Id == id);
        if (lesson == null) return NotFound();
        if (lesson.Process.TeacherId != GetUserId()) return Forbid();

        lesson.Title = request.Title;
        lesson.Description = request.Description;
        lesson.LessonType = request.LessonType;
        lesson.ContentUrl = request.ContentUrl;
        lesson.OrderIndex = request.OrderIndex;

        await _db.SaveChangesAsync();
        return Ok(new LessonDto(lesson.Id, lesson.Title, lesson.Description, lesson.LessonType, lesson.ContentUrl, lesson.OrderIndex));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var lesson = await _db.Lessons.Include(l => l.Process).FirstOrDefaultAsync(l => l.Id == id);
        if (lesson == null) return NotFound();
        if (lesson.Process.TeacherId != GetUserId()) return Forbid();

        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
