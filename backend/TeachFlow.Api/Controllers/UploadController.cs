using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TeachFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;

    public UploadController(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("pdf")]
    public async Task<IActionResult> UploadPdf(IFormFile file)
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role != "teacher") return Forbid();

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded" });

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Only PDF files are allowed" });

        var supabaseUrl = _config["Supabase:Url"]!;
        var serviceRoleKey = _config["Supabase:ServiceRoleKey"]!;

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = $"lesson-files/{fileName}";

        using var stream = file.OpenReadStream();
        using var content = new MultipartFormDataContent();
        content.Add(new StreamContent(stream), "file", fileName);

        var client = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Post, $"{supabaseUrl}/storage/v1/object/{filePath}")
        {
            Content = content
        };
        request.Headers.Add("apikey", serviceRoleKey);
        request.Headers.Add("Authorization", $"Bearer {serviceRoleKey}");
        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            return BadRequest(new { message = $"Upload failed: {error}" });
        }

        var publicUrl = $"{supabaseUrl}/storage/v1/object/public/{filePath}";
        return Ok(new { url = publicUrl, path = filePath });
    }
}
