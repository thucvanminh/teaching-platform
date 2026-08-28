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
        if (await _db.UserProfiles.AnyAsync(u => u.Id.ToString() == request.Email))
            return BadRequest(new { message = "User already exists" });

        var supabaseUrl = _config["Supabase:Url"]!;
        var supabaseKey = _config["Supabase:AnonKey"]!;
        var serviceRoleKey = _config["Supabase:ServiceRoleKey"]!;

        // Create user via Supabase Admin API (bypasses email confirmation)
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

        // Create profile in our database
        var profile = new UserProfile
        {
            Id = Guid.Parse(result.Id),
            FullName = request.FullName,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        _db.UserProfiles.Add(profile);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Registration successful", userId = result.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var supabaseUrl = _config["Supabase:Url"]!;
        var supabaseKey = _config["Supabase:AnonKey"]!;

        // Authenticate with Supabase
        var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/auth/v1/token?grant_type=password")
        {
            Content = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(new { email = request.Email, password = request.Password }),
                Encoding.UTF8,
                "application/json")
        };
        requestMessage.Headers.Add("apikey", supabaseKey);
        var response = await _httpClient.SendAsync(requestMessage);

        if (!response.IsSuccessStatusCode)
            return Unauthorized(new { message = "Invalid email or password" });

        var result = System.Text.Json.JsonSerializer.Deserialize<SupabaseTokenResponse>(
            await response.Content.ReadAsStringAsync(),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (result?.access_token == null || result.user?.Id == null)
            return Unauthorized(new { message = "Authentication failed" });

        // Get profile from our database
        var profile = await _db.UserProfiles.FindAsync(Guid.Parse(result.user.Id));
        if (profile == null)
        {
            // Auto-create profile if missing
            profile = new UserProfile
            {
                Id = Guid.Parse(result.user.Id),
                FullName = request.Email,
                Role = "student",
                CreatedAt = DateTime.UtcNow
            };
            _db.UserProfiles.Add(profile);
            await _db.SaveChangesAsync();
        }

        return Ok(new AuthResponse(
            result.access_token,
            new UserProfileDto(Guid.Parse(result.user.Id), request.Email, profile.FullName, profile.Role)
        ));
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var profile = await _db.UserProfiles.FindAsync(Guid.Parse(userId));
        if (profile == null)
            return NotFound();

        var email = User.FindFirstValue(ClaimTypes.Email) ?? "";
        return Ok(new UserProfileDto(profile.Id, email, profile.FullName, profile.Role));
    }
}

// Supabase API response models
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
