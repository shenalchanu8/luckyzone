using System.Data;
using LuckyZone.Api.Infrastructure;
using LuckyZone.Api.Security;
using Microsoft.Data.SqlClient;

namespace LuckyZone.Api;

internal static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this WebApplication app)
    {
        app.MapGet("/api/catalog/categories", GetPublicCategories);
        app.MapGet("/api/catalog/categories/{slug}", GetPublicCategory);
        app.MapGet("/api/catalog/products/{slug}", GetPublicProduct);

        app.MapGet("/api/admin/categories", GetAdminCategories);
        app.MapPost("/api/admin/categories", CreateCategory);
        app.MapPut("/api/admin/categories/{id:int}", UpdateCategory);
        app.MapDelete("/api/admin/categories/{id:int}", DeleteCategory);

        app.MapGet("/api/admin/products", GetAdminProducts);
        app.MapGet("/api/admin/products/{id:int}", GetAdminProduct);
        app.MapPost("/api/admin/products", CreateProduct);
        app.MapPut("/api/admin/products/{id:int}", UpdateProduct);
        app.MapDelete("/api/admin/products/{id:int}", DeleteProduct);
    }

    private static bool IsAuthorized(HttpRequest request, AdminTokenService tokens) =>
        tokens.TryRead(request.Headers.Authorization, out _);

    private static IResult Unauthorized() => Results.Json(new
    {
        success = false,
        message = "Authentication token is invalid or missing."
    }, statusCode: StatusCodes.Status401Unauthorized);

    private static string Slugify(string value)
    {
        var chars = value.Trim().ToLowerInvariant().Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
        var slug = System.Text.RegularExpressions.Regex.Replace(new string(chars), "-+", "-").Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? Guid.NewGuid().ToString("N") : slug;
    }

    private static async Task<IResult> GetPublicCategories(SqlConnectionFactory factory)
    {
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT c.Id, c.Name, c.Slug, c.Brand, c.ImageUrl, c.Description, c.DisplayOrder,
                   COUNT(CASE WHEN p.IsPublished = 1 THEN 1 END) AS ProductCount
            FROM dbo.Categories c
            LEFT JOIN dbo.Products p ON p.CategoryId = c.Id
            WHERE c.IsActive = 1
            GROUP BY c.Id, c.Name, c.Slug, c.Brand, c.ImageUrl, c.Description, c.DisplayOrder
            ORDER BY c.DisplayOrder, c.Name
            """;

        var categories = new List<object>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            categories.Add(CategoryResult(reader, true));
        }
        return Results.Ok(new { success = true, categories });
    }

    private static async Task<IResult> GetPublicCategory(string slug, SqlConnectionFactory factory)
    {
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        object? category = null;
        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                SELECT TOP 1 Id, Name, Slug, Brand, ImageUrl, Description, DisplayOrder, 0 AS ProductCount
                FROM dbo.Categories WHERE Slug = @slug AND IsActive = 1
                """;
            command.Parameters.AddWithValue("@slug", slug);
            await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow);
            if (await reader.ReadAsync()) category = CategoryResult(reader, true);
        }
        if (category is null) return Results.NotFound(new { success = false, message = "Category not found." });

        var products = new List<object>();
        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                SELECT p.Id, p.Name, p.Slug, p.ShortDescription, p.Price, p.CompareAtPrice,
                       p.StockQuantity, p.IsFeatured, p.IsPublished,
                       (SELECT TOP 1 pi.ImageUrl FROM dbo.ProductImages pi WHERE pi.ProductId = p.Id ORDER BY pi.IsPrimary DESC, pi.DisplayOrder, pi.Id) AS ImageUrl,
                       (SELECT COUNT(*) FROM dbo.ProductColors pc WHERE pc.ProductId = p.Id) AS ColorCount,
                       (SELECT pc.Id, pc.Name, pc.HexCode,
                               (SELECT TOP 1 pi.ImageUrl FROM dbo.ProductImages pi WHERE pi.ColorId=pc.Id ORDER BY pi.DisplayOrder, pi.Id) AS ImageUrl
                        FROM dbo.ProductColors pc WHERE pc.ProductId=p.Id ORDER BY pc.DisplayOrder, pc.Id FOR JSON PATH) AS ColorsJson
                FROM dbo.Products p
                INNER JOIN dbo.Categories c ON c.Id = p.CategoryId
                WHERE c.Slug = @slug AND p.IsPublished = 1
                ORDER BY p.IsFeatured DESC, p.CreatedAt DESC
                """;
            command.Parameters.AddWithValue("@slug", slug);
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync()) products.Add(ProductCardResult(reader));
        }
        return Results.Ok(new { success = true, category, products });
    }

    private static async Task<IResult> GetPublicProduct(string slug, SqlConnectionFactory factory)
    {
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        object? product = null;
        int productId = 0;
        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                SELECT TOP 1 p.Id, p.Name, p.Slug, p.ShortDescription, p.Description, p.Price,
                       p.CompareAtPrice, p.StockQuantity, p.IsFeatured, p.IsPublished,
                       c.Name AS CategoryName, c.Slug AS CategorySlug
                FROM dbo.Products p INNER JOIN dbo.Categories c ON c.Id = p.CategoryId
                WHERE p.Slug = @slug AND p.IsPublished = 1 AND c.IsActive = 1
                """;
            command.Parameters.AddWithValue("@slug", slug);
            await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow);
            if (await reader.ReadAsync())
            {
                productId = reader.GetInt32(reader.GetOrdinal("Id"));
                product = ProductDetailResult(reader);
            }
        }
        if (product is null) return Results.NotFound(new { success = false, message = "Product not found." });

        var colors = await LoadColors(connection, productId);
        return Results.Ok(new { success = true, product, colors });
    }

    private static async Task<IResult> GetAdminCategories(HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT c.Id, c.Name, c.Slug, c.Brand, c.ImageUrl, c.Description, c.DisplayOrder,
                   c.IsFeatured, c.IsActive, COUNT(p.Id) AS ProductCount
            FROM dbo.Categories c LEFT JOIN dbo.Products p ON p.CategoryId = c.Id
            GROUP BY c.Id, c.Name, c.Slug, c.Brand, c.ImageUrl, c.Description, c.DisplayOrder, c.IsFeatured, c.IsActive
            ORDER BY c.DisplayOrder, c.Name
            """;
        var categories = new List<object>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync()) categories.Add(new
        {
            id = reader.GetInt32(reader.GetOrdinal("Id")),
            name = reader.GetString(reader.GetOrdinal("Name")),
            slug = reader.GetString(reader.GetOrdinal("Slug")),
            brand = DbString(reader, "Brand"), imageUrl = DbString(reader, "ImageUrl"),
            description = DbString(reader, "Description"),
            displayOrder = reader.GetInt32(reader.GetOrdinal("DisplayOrder")),
            isFeatured = reader.GetBoolean(reader.GetOrdinal("IsFeatured")),
            isActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
            productCount = reader.GetInt32(reader.GetOrdinal("ProductCount"))
        });
        return Results.Ok(new { success = true, categories });
    }

    private static async Task<IResult> CreateCategory(CategoryRequest body, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        if (string.IsNullOrWhiteSpace(body.Name)) return Results.BadRequest(new { success = false, message = "Category name is required." });
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO dbo.Categories (Name, Slug, Brand, ImageUrl, Description, DisplayOrder, IsFeatured, IsActive)
            OUTPUT INSERTED.Id
            VALUES (@name, @slug, @brand, @imageUrl, @description, @displayOrder, @isFeatured, @isActive)
            """;
        AddCategoryParameters(command, body);
        try
        {
            var id = Convert.ToInt32(await command.ExecuteScalarAsync());
            return Results.Created($"/api/admin/categories/{id}", new { success = true, id, message = "Category created." });
        }
        catch (SqlException ex) when (ex.Number is 2601 or 2627)
        {
            return Results.Conflict(new { success = false, message = "That category slug already exists." });
        }
    }

    private static async Task<IResult> UpdateCategory(int id, CategoryRequest body, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        if (string.IsNullOrWhiteSpace(body.Name)) return Results.BadRequest(new { success = false, message = "Category name is required." });
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE dbo.Categories SET Name=@name, Slug=@slug, Brand=@brand, ImageUrl=@imageUrl,
                Description=@description, DisplayOrder=@displayOrder, IsFeatured=@isFeatured, IsActive=@isActive
            WHERE Id=@id
            """;
        AddCategoryParameters(command, body);
        command.Parameters.AddWithValue("@id", id);
        try
        {
            return await command.ExecuteNonQueryAsync() == 0
                ? Results.NotFound(new { success = false, message = "Category not found." })
                : Results.Ok(new { success = true, message = "Category updated." });
        }
        catch (SqlException ex) when (ex.Number is 2601 or 2627)
        {
            return Results.Conflict(new { success = false, message = "That category slug already exists." });
        }
    }

    private static async Task<IResult> DeleteCategory(int id, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM dbo.Categories WHERE Id=@id AND NOT EXISTS (SELECT 1 FROM dbo.Products WHERE CategoryId=@id)";
        command.Parameters.AddWithValue("@id", id);
        return await command.ExecuteNonQueryAsync() == 0
            ? Results.Conflict(new { success = false, message = "Remove or move the category's products before deleting it." })
            : Results.Ok(new { success = true, message = "Category deleted." });
    }

    private static async Task<IResult> GetAdminProducts(HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT p.Id, p.Name, p.Slug, p.Price, p.CompareAtPrice, p.StockQuantity, p.IsFeatured, p.IsPublished,
                   c.Name AS CategoryName, c.Brand,
                   (SELECT TOP 1 ImageUrl FROM dbo.ProductImages pi WHERE pi.ProductId=p.Id ORDER BY pi.IsPrimary DESC, pi.DisplayOrder, pi.Id) AS ImageUrl,
                   (SELECT COUNT(*) FROM dbo.ProductColors pc WHERE pc.ProductId=p.Id) AS ColorCount
            FROM dbo.Products p INNER JOIN dbo.Categories c ON c.Id=p.CategoryId
            ORDER BY p.CreatedAt DESC
            """;
        var products = new List<object>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync()) products.Add(new
        {
            id = reader.GetInt32(reader.GetOrdinal("Id")), name = reader.GetString(reader.GetOrdinal("Name")),
            slug = reader.GetString(reader.GetOrdinal("Slug")), price = reader.GetDecimal(reader.GetOrdinal("Price")),
            compareAtPrice = DbDecimal(reader, "CompareAtPrice"), stockQuantity = reader.GetInt32(reader.GetOrdinal("StockQuantity")),
            isFeatured = reader.GetBoolean(reader.GetOrdinal("IsFeatured")), isPublished = reader.GetBoolean(reader.GetOrdinal("IsPublished")),
            categoryName = reader.GetString(reader.GetOrdinal("CategoryName")), brand = DbString(reader, "Brand"),
            imageUrl = DbString(reader, "ImageUrl"), colorCount = reader.GetInt32(reader.GetOrdinal("ColorCount"))
        });
        return Results.Ok(new { success = true, products });
    }

    private static async Task<IResult> GetAdminProduct(int id, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        object? product = null;
        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                SELECT TOP 1 p.Id, p.CategoryId, p.Name, p.Slug, p.ShortDescription, p.Description,
                       p.Price, p.CompareAtPrice, p.StockQuantity, p.IsFeatured, p.IsPublished
                FROM dbo.Products p WHERE p.Id=@id
                """;
            command.Parameters.AddWithValue("@id", id);
            await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow);
            if (await reader.ReadAsync()) product = new
            {
                id, categoryId = reader.GetInt32(reader.GetOrdinal("CategoryId")), name = reader.GetString(reader.GetOrdinal("Name")),
                slug = reader.GetString(reader.GetOrdinal("Slug")), shortDescription = DbString(reader, "ShortDescription"),
                description = DbString(reader, "Description"), price = reader.GetDecimal(reader.GetOrdinal("Price")),
                compareAtPrice = DbDecimal(reader, "CompareAtPrice"), stockQuantity = reader.GetInt32(reader.GetOrdinal("StockQuantity")),
                isFeatured = reader.GetBoolean(reader.GetOrdinal("IsFeatured")), isPublished = reader.GetBoolean(reader.GetOrdinal("IsPublished"))
            };
        }
        if (product is null) return Results.NotFound(new { success = false, message = "Product not found." });
        var colors = await LoadColors(connection, id);
        return Results.Ok(new { success = true, product, colors });
    }

    private static async Task<IResult> CreateProduct(ProductRequest body, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        var validation = ValidateProduct(body);
        if (validation is not null) return Results.BadRequest(new { success = false, message = validation });
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        try
        {
            var id = await InsertProduct(connection, (SqlTransaction)transaction, body);
            await ReplaceColors(connection, (SqlTransaction)transaction, id, body.Colors ?? []);
            await transaction.CommitAsync();
            return Results.Created($"/api/admin/products/{id}", new { success = true, id, message = "Product created and published to the catalog." });
        }
        catch (SqlException ex) when (ex.Number is 2601 or 2627)
        {
            await transaction.RollbackAsync();
            return Results.Conflict(new { success = false, message = "That product slug already exists." });
        }
    }

    private static async Task<IResult> UpdateProduct(int id, ProductRequest body, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        var validation = ValidateProduct(body);
        if (validation is not null) return Results.BadRequest(new { success = false, message = validation });
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        try
        {
            await using var command = connection.CreateCommand();
            command.Transaction = (SqlTransaction)transaction;
            command.CommandText = """
                UPDATE dbo.Products SET CategoryId=@categoryId, Name=@name, Slug=@slug,
                    ShortDescription=@shortDescription, Description=@description, Price=@price,
                    CompareAtPrice=@compareAtPrice, StockQuantity=@stockQuantity, IsFeatured=@isFeatured,
                    IsPublished=@isPublished, UpdatedAt=SYSDATETIME() WHERE Id=@id
                """;
            AddProductParameters(command, body);
            command.Parameters.AddWithValue("@id", id);
            if (await command.ExecuteNonQueryAsync() == 0)
            {
                await transaction.RollbackAsync();
                return Results.NotFound(new { success = false, message = "Product not found." });
            }
            await ReplaceColors(connection, (SqlTransaction)transaction, id, body.Colors ?? []);
            await transaction.CommitAsync();
            return Results.Ok(new { success = true, message = "Product updated." });
        }
        catch (SqlException ex) when (ex.Number is 2601 or 2627)
        {
            await transaction.RollbackAsync();
            return Results.Conflict(new { success = false, message = "That product slug already exists." });
        }
    }

    private static async Task<IResult> DeleteProduct(int id, HttpRequest request, SqlConnectionFactory factory, AdminTokenService tokens)
    {
        if (!IsAuthorized(request, tokens)) return Unauthorized();
        await using var connection = await factory.OpenDatabaseConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        foreach (var sql in new[]
        {
            "DELETE FROM dbo.ProductImages WHERE ProductId=@id",
            "DELETE FROM dbo.ProductColors WHERE ProductId=@id",
            "DELETE FROM dbo.Products WHERE Id=@id"
        })
        {
            await using var command = connection.CreateCommand(); command.Transaction = (SqlTransaction)transaction;
            command.CommandText = sql; command.Parameters.AddWithValue("@id", id); await command.ExecuteNonQueryAsync();
        }
        await transaction.CommitAsync();
        return Results.Ok(new { success = true, message = "Product deleted." });
    }

    private static async Task<int> InsertProduct(SqlConnection connection, SqlTransaction transaction, ProductRequest body)
    {
        await using var command = connection.CreateCommand(); command.Transaction = transaction;
        command.CommandText = """
            INSERT INTO dbo.Products (CategoryId, Name, Slug, ShortDescription, Description, Price, CompareAtPrice, StockQuantity, IsFeatured, IsPublished)
            OUTPUT INSERTED.Id
            VALUES (@categoryId, @name, @slug, @shortDescription, @description, @price, @compareAtPrice, @stockQuantity, @isFeatured, @isPublished)
            """;
        AddProductParameters(command, body);
        return Convert.ToInt32(await command.ExecuteScalarAsync());
    }

    private static async Task ReplaceColors(SqlConnection connection, SqlTransaction transaction, int productId, List<ProductColorRequest> colors)
    {
        await using (var clearImages = connection.CreateCommand()) { clearImages.Transaction=transaction; clearImages.CommandText="DELETE FROM dbo.ProductImages WHERE ProductId=@id"; clearImages.Parameters.AddWithValue("@id", productId); await clearImages.ExecuteNonQueryAsync(); }
        await using (var clearColors = connection.CreateCommand()) { clearColors.Transaction=transaction; clearColors.CommandText="DELETE FROM dbo.ProductColors WHERE ProductId=@id"; clearColors.Parameters.AddWithValue("@id", productId); await clearColors.ExecuteNonQueryAsync(); }

        for (var colorIndex = 0; colorIndex < colors.Count; colorIndex++)
        {
            var color = colors[colorIndex];
            if (string.IsNullOrWhiteSpace(color.Name)) continue;
            int colorId;
            await using (var command = connection.CreateCommand())
            {
                command.Transaction=transaction; command.CommandText="INSERT INTO dbo.ProductColors (ProductId, Name, HexCode, DisplayOrder) OUTPUT INSERTED.Id VALUES (@productId,@name,@hex,@order)";
                command.Parameters.AddWithValue("@productId", productId); command.Parameters.AddWithValue("@name", color.Name.Trim());
                command.Parameters.AddWithValue("@hex", DbValue(color.HexCode)); command.Parameters.AddWithValue("@order", colorIndex);
                colorId=Convert.ToInt32(await command.ExecuteScalarAsync());
            }
            var images = color.Images?.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToList() ?? [];
            for (var imageIndex = 0; imageIndex < images.Count; imageIndex++)
            {
                await using var command = connection.CreateCommand(); command.Transaction=transaction;
                command.CommandText="INSERT INTO dbo.ProductImages (ProductId, ColorId, ImageUrl, AltText, DisplayOrder, IsPrimary) VALUES (@productId,@colorId,@url,@alt,@order,@primary)";
                command.Parameters.AddWithValue("@productId", productId); command.Parameters.AddWithValue("@colorId", colorId);
                command.Parameters.AddWithValue("@url", images[imageIndex]); command.Parameters.AddWithValue("@alt", $"{color.Name} product image");
                command.Parameters.AddWithValue("@order", imageIndex); command.Parameters.AddWithValue("@primary", colorIndex == 0 && imageIndex == 0);
                await command.ExecuteNonQueryAsync();
            }
        }
    }

    private static async Task<List<object>> LoadColors(SqlConnection connection, int productId)
    {
        var colors = new List<object>();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT pc.Id, pc.Name, pc.HexCode, pc.DisplayOrder, pi.ImageUrl
            FROM dbo.ProductColors pc LEFT JOIN dbo.ProductImages pi ON pi.ColorId=pc.Id
            WHERE pc.ProductId=@id ORDER BY pc.DisplayOrder, pc.Id, pi.DisplayOrder, pi.Id
            """;
        command.Parameters.AddWithValue("@id", productId);
        await using var reader = await command.ExecuteReaderAsync();
        var currentId = -1; string name=""; string? hex=null; var images = new List<string>();
        while (await reader.ReadAsync())
        {
            var id=reader.GetInt32(reader.GetOrdinal("Id"));
            if (id != currentId && currentId != -1) { colors.Add(new { id=currentId, name, hexCode=hex, images=images.ToArray() }); images=[]; }
            if (id != currentId) { currentId=id; name=reader.GetString(reader.GetOrdinal("Name")); hex=DbString(reader,"HexCode"); }
            var image=DbString(reader,"ImageUrl"); if (image is not null) images.Add(image);
        }
        if (currentId != -1) colors.Add(new { id=currentId, name, hexCode=hex, images=images.ToArray() });
        return colors;
    }

    private static object CategoryResult(SqlDataReader reader, bool includeCount) => new
    {
        id=reader.GetInt32(reader.GetOrdinal("Id")), name=reader.GetString(reader.GetOrdinal("Name")),
        slug=reader.GetString(reader.GetOrdinal("Slug")), brand=DbString(reader,"Brand"), imageUrl=DbString(reader,"ImageUrl"),
        description=DbString(reader,"Description"), displayOrder=reader.GetInt32(reader.GetOrdinal("DisplayOrder")),
        productCount=includeCount ? reader.GetInt32(reader.GetOrdinal("ProductCount")) : 0
    };

    private static object ProductCardResult(SqlDataReader reader) => new
    {
        id=reader.GetInt32(reader.GetOrdinal("Id")), name=reader.GetString(reader.GetOrdinal("Name")), slug=reader.GetString(reader.GetOrdinal("Slug")),
        shortDescription=DbString(reader,"ShortDescription"), price=reader.GetDecimal(reader.GetOrdinal("Price")), compareAtPrice=DbDecimal(reader,"CompareAtPrice"),
        stockQuantity=reader.GetInt32(reader.GetOrdinal("StockQuantity")), isFeatured=reader.GetBoolean(reader.GetOrdinal("IsFeatured")),
        isPublished=reader.GetBoolean(reader.GetOrdinal("IsPublished")), imageUrl=DbString(reader,"ImageUrl"), colorCount=reader.GetInt32(reader.GetOrdinal("ColorCount"))
        , colors=ParseCardColors(DbString(reader,"ColorsJson"))
    };

    private static List<ProductColorCard> ParseCardColors(string? json) =>
        string.IsNullOrWhiteSpace(json)
            ? []
            : System.Text.Json.JsonSerializer.Deserialize<List<ProductColorCard>>(json,
                new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];

    private static object ProductDetailResult(SqlDataReader reader) => new
    {
        id=reader.GetInt32(reader.GetOrdinal("Id")), name=reader.GetString(reader.GetOrdinal("Name")), slug=reader.GetString(reader.GetOrdinal("Slug")),
        shortDescription=DbString(reader,"ShortDescription"), description=DbString(reader,"Description"), price=reader.GetDecimal(reader.GetOrdinal("Price")),
        compareAtPrice=DbDecimal(reader,"CompareAtPrice"), stockQuantity=reader.GetInt32(reader.GetOrdinal("StockQuantity")),
        isFeatured=reader.GetBoolean(reader.GetOrdinal("IsFeatured")), isPublished=reader.GetBoolean(reader.GetOrdinal("IsPublished")),
        category=new { name=reader.GetString(reader.GetOrdinal("CategoryName")), slug=reader.GetString(reader.GetOrdinal("CategorySlug")) }
    };

    private static void AddCategoryParameters(SqlCommand command, CategoryRequest body)
    {
        command.Parameters.AddWithValue("@name", body.Name.Trim()); command.Parameters.AddWithValue("@slug", Slugify(body.Slug ?? body.Name));
        command.Parameters.AddWithValue("@brand", DbValue(body.Brand)); command.Parameters.AddWithValue("@imageUrl", DbValue(body.ImageUrl));
        command.Parameters.AddWithValue("@description", DbValue(body.Description)); command.Parameters.AddWithValue("@displayOrder", body.DisplayOrder);
        command.Parameters.AddWithValue("@isFeatured", body.IsFeatured); command.Parameters.AddWithValue("@isActive", body.IsActive);
    }

    private static void AddProductParameters(SqlCommand command, ProductRequest body)
    {
        command.Parameters.AddWithValue("@categoryId", body.CategoryId); command.Parameters.AddWithValue("@name", body.Name.Trim());
        command.Parameters.AddWithValue("@slug", Slugify(body.Slug ?? body.Name)); command.Parameters.AddWithValue("@shortDescription", DbValue(body.ShortDescription));
        command.Parameters.AddWithValue("@description", DbValue(body.Description)); command.Parameters.AddWithValue("@price", body.Price);
        command.Parameters.AddWithValue("@compareAtPrice", body.CompareAtPrice is > 0 ? body.CompareAtPrice : DBNull.Value);
        command.Parameters.AddWithValue("@stockQuantity", Math.Max(0, body.StockQuantity)); command.Parameters.AddWithValue("@isFeatured", body.IsFeatured);
        command.Parameters.AddWithValue("@isPublished", body.IsPublished);
    }

    private static string? ValidateProduct(ProductRequest body)
    {
        if (string.IsNullOrWhiteSpace(body.Name)) return "Product name is required.";
        if (body.CategoryId <= 0) return "Please select a category.";
        if (body.Price < 0) return "Final price cannot be negative.";
        if (body.CompareAtPrice is > 0 && body.CompareAtPrice < body.Price) return "Regular price must be higher than or equal to the final price.";
        if (body.Colors is null || body.Colors.Count == 0) return "Add at least one color and its images.";
        if (body.Colors.Any(c => string.IsNullOrWhiteSpace(c.Name))) return "Every color needs a name.";
        if (body.Colors.Any(c => c.Images is null || c.Images.Count == 0)) return "Every color needs at least one image.";
        return null;
    }

    private static object DbValue(string? value) => string.IsNullOrWhiteSpace(value) ? DBNull.Value : value.Trim();
    private static string? DbString(SqlDataReader reader, string name) => reader.IsDBNull(reader.GetOrdinal(name)) ? null : reader.GetString(reader.GetOrdinal(name));
    private static decimal? DbDecimal(SqlDataReader reader, string name) => reader.IsDBNull(reader.GetOrdinal(name)) ? null : reader.GetDecimal(reader.GetOrdinal(name));
}

internal sealed record CategoryRequest(string Name, string? Slug, string? Brand, string? ImageUrl, string? Description, int DisplayOrder, bool IsFeatured, bool IsActive);
internal sealed record ProductColorRequest(string Name, string? HexCode, List<string>? Images);
internal sealed record ProductColorCard(int Id, string Name, string? HexCode, string? ImageUrl);
internal sealed record ProductRequest(int CategoryId, string Name, string? Slug, string? ShortDescription, string? Description, decimal Price, decimal? CompareAtPrice, int StockQuantity, bool IsFeatured, bool IsPublished, List<ProductColorRequest>? Colors);
