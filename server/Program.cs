using System.Data;
using LuckyZone.Api;
using LuckyZone.Api.Infrastructure;
using LuckyZone.Api.Security;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(builder.Configuration["Api:Url"] ?? "http://0.0.0.0:5005");
builder.Services.Configure<JsonOptions>(options =>
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
{
    var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
    if (origins.Length > 0) policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();
    else policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
}));
builder.Services.AddSingleton<SqlConnectionFactory>();
builder.Services.AddSingleton<DatabaseInitializer>();
builder.Services.AddSingleton<PasswordHasher>();
builder.Services.AddSingleton<AdminTokenService>();

var app = builder.Build();

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/backend", out var remainingPath))
    {
        context.Request.PathBase = "/backend";
        context.Request.Path = remainingPath;
    }

    await next();
});

app.UseCors();

var uploadPath = builder.Configuration["Uploads:Path"] ?? "uploads";
var uploadDirectory = Path.IsPathRooted(uploadPath)
    ? uploadPath
    : Path.Combine(app.Environment.ContentRootPath, uploadPath);
var uploadRequestPath = builder.Configuration["Uploads:RequestPath"] ?? "/uploads";
var maxUploadBytes = builder.Configuration.GetValue("Uploads:MaxBytes", 8 * 1024 * 1024);
Directory.CreateDirectory(uploadDirectory);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadDirectory),
    RequestPath = uploadRequestPath
});

try
{
    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.GetRequiredService<DatabaseInitializer>().InitializeAsync();
}
catch (Exception exception)
{
    app.Logger.LogError(exception, "Database initialization failed. The API will keep running, but database-backed endpoints may fail until the connection settings are fixed.");
}

app.MapGet("/api/health", () => Results.Ok(new { success = true, message = "LuckyZone API is running", date = "2026-08-02" }));

app.MapPost("/api/admin/login", async (LoginRequest request, SqlConnectionFactory factory, PasswordHasher hasher, AdminTokenService tokens) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.BadRequest(new { success = false, message = "Email and password are required." });

    await using var connection = await factory.OpenDatabaseConnectionAsync();
    await using var command = connection.CreateCommand();
    command.CommandText = "SELECT TOP 1 Id, FullName, Email, PasswordHash, RoleName, IsActive FROM dbo.Admins WHERE Email=@email";
    command.Parameters.AddWithValue("@email", request.Email.Trim().ToLowerInvariant());
    await using var reader = await command.ExecuteReaderAsync();
    if (!await reader.ReadAsync() || !reader.GetBoolean(reader.GetOrdinal("IsActive")) ||
        !hasher.Verify(request.Password, reader.GetString(reader.GetOrdinal("PasswordHash"))))
        return Results.Json(new { success = false, message = "Invalid email or password." }, statusCode: 401);

    var admin = new AdminIdentity(reader.GetInt32(reader.GetOrdinal("Id")), reader.GetString(reader.GetOrdinal("FullName")),
        reader.GetString(reader.GetOrdinal("Email")), reader.GetString(reader.GetOrdinal("RoleName")));
    return Results.Ok(new { success = true, token = tokens.Create(admin), admin = new { id=admin.Id, name=admin.FullName, email=admin.Email, role=admin.RoleName } });
});

app.MapGet("/api/admin/dashboard-summary", async (HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens) =>
{
    if (!tokens.TryRead(request.Headers.Authorization, out _))
        return Results.Json(new { success = false, message = "Authentication token is invalid or missing." }, statusCode: 401);
    await using var connection = await factory.OpenDatabaseConnectionAsync();
    await using var command = connection.CreateCommand();
    command.CommandText = """
        SELECT (SELECT COUNT(*) FROM dbo.Products) Products, (SELECT COUNT(*) FROM dbo.Categories) Categories,
               (SELECT COUNT(*) FROM dbo.HomeBanners) Banners, (SELECT COUNT(*) FROM dbo.Products WHERE IsPublished=0) Drafts
        """;
    await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow); await reader.ReadAsync();
    return Results.Ok(new { success=true, products=reader.GetInt32(0), categories=reader.GetInt32(1), banners=reader.GetInt32(2), drafts=reader.GetInt32(3) });
});

app.MapGet("/api/catalog/homepage", async (SqlConnectionFactory factory) =>
{
    await using var connection = await factory.OpenDatabaseConnectionAsync();
    var categories = new List<object>();
    await using (var command = connection.CreateCommand())
    {
        command.CommandText = """
            SELECT c.Id,c.Name,c.Slug,c.Brand,c.ImageUrl,c.Description,c.DisplayOrder,
                   COUNT(CASE WHEN p.IsPublished=1 THEN 1 END) ProductCount
            FROM dbo.Categories c LEFT JOIN dbo.Products p ON p.CategoryId=c.Id
            WHERE c.IsActive=1 GROUP BY c.Id,c.Name,c.Slug,c.Brand,c.ImageUrl,c.Description,c.DisplayOrder
            ORDER BY c.DisplayOrder,c.Name
            """;
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync()) categories.Add(new { id=reader.GetInt32(0), name=reader.GetString(1), slug=reader.GetString(2),
            brand=reader.IsDBNull(3)?null:reader.GetString(3), imageUrl=reader.IsDBNull(4)?null:reader.GetString(4),
            description=reader.IsDBNull(5)?null:reader.GetString(5), displayOrder=reader.GetInt32(6), productCount=reader.GetInt32(7) });
    }
    return Results.Ok(new { success=true, categories });
});

app.MapPost("/api/admin/uploads", async (HttpRequest request, AdminTokenService tokens) =>
{
    if (!tokens.TryRead(request.Headers.Authorization, out _))
        return Results.Json(new { success=false, message="Authentication token is invalid or missing." }, statusCode:401);
    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("image");
    if (file is null || file.Length == 0) return Results.BadRequest(new { success=false, message="Choose an image to upload." });
    if (file.Length > maxUploadBytes) return Results.BadRequest(new { success=false, message="Images are too large." });
    var allowed = new Dictionary<string,string> { ["image/jpeg"]=".jpg", ["image/png"]=".png", ["image/webp"]=".webp", ["image/gif"]=".gif" };
    if (!allowed.TryGetValue(file.ContentType.ToLowerInvariant(), out var extension))
        return Results.BadRequest(new { success=false, message="Only JPG, PNG, WebP, and GIF images are supported." });
    var fileName = $"{Guid.NewGuid():N}{extension}";
    await using var stream = File.Create(Path.Combine(uploadDirectory, fileName));
    await file.CopyToAsync(stream);
    return Results.Ok(new { success=true, url=$"/uploads/{fileName}" });
}).DisableAntiforgery();

app.MapCatalogEndpoints();
app.Run();

internal sealed record LoginRequest(string Email, string Password);
