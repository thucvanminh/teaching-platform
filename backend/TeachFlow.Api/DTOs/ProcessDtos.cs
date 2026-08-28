namespace TeachFlow.Api.DTOs;

public record CreateProcessRequest(string Title, string? Description);
public record UpdateProcessRequest(string Title, string? Description, string? Status);
public record ProcessDto(Guid Id, string Title, string? Description, string Status, DateTime CreatedAt, int LessonCount);
