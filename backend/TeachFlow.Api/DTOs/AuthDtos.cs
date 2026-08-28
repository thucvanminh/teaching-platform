namespace TeachFlow.Api.DTOs;

public record RegisterRequest(string Email, string Username, string Password, string FullName, string Role);
public record LoginRequest(string Identifier, string Password);
public record AuthResponse(string AccessToken, UserProfileDto User);
public record UserProfileDto(Guid Id, string Email, string Username, string FullName, string Role);
