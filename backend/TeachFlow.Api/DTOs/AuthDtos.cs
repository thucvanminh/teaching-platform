namespace TeachFlow.Api.DTOs;

public record RegisterRequest(string Email, string Password, string FullName, string Role);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string AccessToken, UserProfileDto User);
public record UserProfileDto(Guid Id, string Email, string FullName, string Role);
