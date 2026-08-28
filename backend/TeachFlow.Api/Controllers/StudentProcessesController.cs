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
public class StudentProcessesController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudentProcessesController(AppDbContext db) => _db = db;

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var role = User.FindFirstValue(ClaimTypes.Role);

        if (role == "teacher")
        {
            var result = await _db.StudentProcesses
                .Include(sp => sp.Student)
                .Include(sp => sp.Process)
                .Where(sp => sp.Process.TeacherId == userId)
                .Select(sp => new StudentProcessDto(
                    sp.Id, sp.StudentId, sp.Student.FullName,
                    sp.ProcessId, sp.Process.Title, sp.AssignedAt))
                .ToListAsync();
            return Ok(result);
        }

        var studentResult = await _db.StudentProcesses
            .Include(sp => sp.Process)
            .Where(sp => sp.StudentId == userId)
            .Select(sp => new StudentProcessDto(
                sp.Id, sp.StudentId, "",
                sp.ProcessId, sp.Process.Title, sp.AssignedAt))
            .ToListAsync();
        return Ok(studentResult);
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetStudents()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role != "teacher") return Forbid();

        var students = await _db.UserProfiles
            .Where(u => u.Role == "student")
            .Select(u => new { u.Id, u.FullName })
            .ToListAsync();
        return Ok(students);
    }

    [HttpPost]
    public async Task<IActionResult> Assign([FromBody] AssignProcessRequest request)
    {
        var userId = GetUserId();
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role != "teacher") return Forbid();

        var process = await _db.Processes.FindAsync(request.ProcessId);
        if (process == null || process.TeacherId != userId) return Forbid();

        var exists = await _db.StudentProcesses
            .AnyAsync(sp => sp.StudentId == request.StudentId && sp.ProcessId == request.ProcessId);
        if (exists) return Conflict(new { message = "Already assigned" });

        var sp = new StudentProcess
        {
            Id = Guid.NewGuid(),
            StudentId = request.StudentId,
            ProcessId = request.ProcessId,
            AssignedAt = DateTime.UtcNow
        };

        _db.StudentProcesses.Add(sp);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Assigned successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Unassign(Guid id)
    {
        var userId = GetUserId();
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role != "teacher") return Forbid();

        var sp = await _db.StudentProcesses
            .Include(s => s.Process)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (sp == null || sp.Process.TeacherId != userId) return Forbid();

        _db.StudentProcesses.Remove(sp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
