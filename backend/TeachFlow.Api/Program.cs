using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TeachFlow.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Supabase HttpClient
builder.Services.AddHttpClient();

// JWT Authentication
var jwtSecret = builder.Configuration["Supabase:JwtSecret"]!;
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var origins = new List<string> { "http://localhost:5173", "http://localhost:3000" };
        var frontendUrl = builder.Configuration["FrontendUrl"];
        if (!string.IsNullOrEmpty(frontendUrl))
            origins.Add(frontendUrl);

        policy.WithOrigins(origins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Controllers + OpenAPI
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
