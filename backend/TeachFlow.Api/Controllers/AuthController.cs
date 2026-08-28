using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TeachFlow.Api.Data;
using TeachFlow.Api.DTOs;
using TeachFlow.Api.Models;

namespace TeachFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AuthController(AppDbContext db, IConfiguration config, HttpClient httpClient)
    {
        _db = db;
        _config = config;
        _httpClient = httpClient;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var supabaseUrl = _config["Supabase:Url"]!;
        var serviceRoleKey = _config["Supabase:ServiceRoleKey"]!;

        var normalizedUsername = request.Username.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(normalizedUsername) || normalizedUsername.Length < 3)
            return BadRequest(new { message = "Username must be at least 3 characters" });

        if (await _db.UserProfiles.AnyAsync(u => u.Username == normalizedUsername))
            return BadRequest(new { message = "Username already taken" });

        if (await _db.UserProfiles.AnyAsync(u => u.Id.ToString() == request.Email))
            return BadRequest(new { message = "User already exists" });

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/auth/v1/admin/users")
        {
            Content = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(new { email = request.Email, password = request.Password, email_confirm = true }),
                Encoding.UTF8,
                "application/json")
        };
        requestMessage.Headers.Add("apikey", serviceRoleKey);
        requestMessage.Headers.Add("Authorization", $"Bearer {serviceRoleKey}");
        var response = await _httpClient.SendAsync(requestMessage);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            return BadRequest(new { message = $"Supabase registration failed: {error}" });
        }

        var responseBody = await response.Content.ReadAsStringAsync();
        var result = System.Text.Json.JsonSerializer.Deserialize<SupabaseUser>(
            responseBody,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (result?.Id == null)
            return BadRequest(new { message = "Failed to get user ID from Supabase" });

        var profile = new UserProfile
        {
            Id = Guid.Parse(result.Id),
            Username = normalizedUsername,
            FullName = request.FullName,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        _db.UserProfiles.Add(profile);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { message = "Username or email already exists" });
        }

        return Ok(new { message = "Registration successful", userId = result.Id, username = normalizedUsername });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var supabaseUrl = _config["Supabase:Url"]!;
        var supabaseKey = _config["Supabase:AnonKey"]!;

        var email = request.Identifier.Trim();

        if (!email.Contains('@'))
        {
            var username = email.ToLowerInvariant();
            var profile = await _db.UserProfiles.FirstOrDefaultAsync(u => u.Username == username);
            if (profile == null)
                return Unauthorized(new { message = "Invalid username or password" });

            var supabaseUser = await GetSupabaseUserById(profile.Id);
            if (supabaseUser?.Email == null)
                return Unauthorized(new { message = "Invalid username or password" });

            email = supabaseUser.Email;
        }

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/auth/v1/token?grant_type=password")
        {
            Content = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(new { email, password = request.Password }),
                Encoding.UTF8,
                "application/json")
        };
        requestMessage.Headers.Add("apikey", supabaseKey);
        var response = await _httpClient.SendAsync(requestMessage);

        if (!response.IsSuccessStatusCode)
            return Unauthorized(new { message = "Invalid credentials" });

        var result = System.Text.Json.JsonSerializer.Deserialize<SupabaseTokenResponse>(
            await response.Content.ReadAsStringAsync(),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (result?.access_token == null || result.user?.Id == null)
            return Unauthorized(new { message = "Authentication failed" });

        var userProfile = await _db.UserProfiles.FindAsync(Guid.Parse(result.user.Id));
        if (userProfile == null)
        {
            userProfile = new UserProfile
            {
                Id = Guid.Parse(result.user.Id),
                Username = "",
                FullName = result.user.Email ?? "",
                Role = "student",
                CreatedAt = DateTime.UtcNow
            };
            _db.UserProfiles.Add(userProfile);
            await _db.SaveChangesAsync();
        }

        return Ok(new AuthResponse(
            result.access_token,
            new UserProfileDto(userProfile.Id, result.user.Email ?? "", userProfile.Username ?? "", userProfile.FullName, userProfile.Role)
        ));
    }

    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var profile = await _db.UserProfiles.FindAsync(Guid.Parse(userId));
        if (profile == null)
            return NotFound();

        var email = User.FindFirstValue(ClaimTypes.Email) ?? "";
        return Ok(new UserProfileDto(profile.Id, email, profile.Username ?? "", profile.FullName, profile.Role));
    }

    private async Task<SupabaseUser?> GetSupabaseUserById(Guid userId)
    {
        var supabaseUrl = _config["Supabase:Url"]!;
        var serviceRoleKey = _config["Supabase:ServiceRoleKey"]!;

        var req = new HttpRequestMessage(HttpMethod.Get, $"{supabaseUrl}/auth/v1/admin/users/{userId}");
        req.Headers.Add("apikey", serviceRoleKey);
        req.Headers.Add("Authorization", $"Bearer {serviceRoleKey}");

        var response = await _httpClient.SendAsync(req);
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        return System.Text.Json.JsonSerializer.Deserialize<SupabaseUser>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }
}

public class SupabaseAuthResponse
{
    public SupabaseUser? User { get; set; }
}

public class SupabaseTokenResponse
{
    public string? access_token { get; set; }
    public SupabaseUser? user { get; set; }
}

public class SupabaseUser
{
    public string? Id { get; set; }
    public string? Email { get; set; }
}
