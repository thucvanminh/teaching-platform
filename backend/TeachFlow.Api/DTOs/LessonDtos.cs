namespace TeachFlow.Api.DTOs;

public record CreateLessonRequest(string Title, string? Description, string LessonType, string ContentUrl, int OrderIndex);
public record UpdateLessonRequest(string Title, string? Description, string LessonType, string ContentUrl, int OrderIndex);
public record LessonDto(Guid Id, string Title, string? Description, string LessonType, string ContentUrl, int OrderIndex);
