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
public class ProcessesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProcessesController(AppDbContext db) => _db = db;

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "teacher")
        {
            var processes = await _db.Processes
                .Where(p => p.TeacherId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ProcessDto(
                    p.Id, p.Title, p.Description, p.Status, p.CreatedAt,
                    p.Lessons.Count))
                .ToListAsync();
            return Ok(processes);
        }

        // Student: get assigned processes
        var assigned = await _db.StudentProcesses
            .Where(sp => sp.StudentId == userId)
            .Select(sp => new ProcessDto(
                sp.Process.Id, sp.Process.Title, sp.Process.Description,
                sp.Process.Status, sp.Process.CreatedAt,
                sp.Process.Lessons.Count))
            .ToListAsync();
        return Ok(assigned);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var userId = GetUserId();
        var role = User.FindFirstValue(ClaimTypes.Role);

        var process = await _db.Processes
            .Include(p => p.Lessons.OrderBy(l => l.OrderIndex))
            .FirstOrDefaultAsync(p => p.Id == id);

        if (process == null) return NotFound();

        if (role == "teacher" && process.TeacherId != userId)
            return Forbid();

        if (role == "student")
        {
            var assigned = await _db.StudentProcesses
                .AnyAsync(sp => sp.StudentId == userId && sp.ProcessId == id);
            if (!assigned) return Forbid();
        }

        return Ok(new
        {
            process.Id,
            process.Title,
            process.Description,
            process.Status,
            process.CreatedAt,
            Lessons = process.Lessons.Select(l => new
            {
                l.Id,
                l.Title,
                l.Description,
                l.LessonType,
                l.ContentUrl,
                l.OrderIndex
            })
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProcessRequest request)
    {
        var userId = GetUserId();
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role != "teacher") return Forbid();

        var process = new Process
        {
            Id = Guid.NewGuid(),
            TeacherId = userId,
            Title = request.Title,
            Description = request.Description,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Processes.Add(process);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = process.Id },
            new ProcessDto(process.Id, process.Title, process.Description, process.Status, process.CreatedAt, 0));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProcessRequest request)
    {
        var userId = GetUserId();
        var process = await _db.Processes.FindAsync(id);
        if (process == null) return NotFound();
        if (process.TeacherId != userId) return Forbid();

        process.Title = request.Title;
        process.Description = request.Description ?? process.Description;
        process.Status = request.Status ?? process.Status;
        process.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new ProcessDto(process.Id, process.Title, process.Description, process.Status, process.CreatedAt, 0));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var process = await _db.Processes.FindAsync(id);
        if (process == null) return NotFound();
        if (process.TeacherId != userId) return Forbid();

        _db.Processes.Remove(process);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
