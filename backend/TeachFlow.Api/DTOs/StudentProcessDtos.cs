namespace TeachFlow.Api.DTOs;

public record AssignProcessRequest(Guid StudentId, Guid ProcessId);
public record StudentProcessDto(Guid Id, Guid StudentId, string StudentName, Guid ProcessId, string ProcessTitle, DateTime AssignedAt);
