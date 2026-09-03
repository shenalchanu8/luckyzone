using System.Text.RegularExpressions;
using LuckyZone.Api.Security;
using Microsoft.Data.SqlClient;

namespace LuckyZone.Api.Infrastructure;

internal sealed class DatabaseInitializer(SqlConnectionFactory connectionFactory, PasswordHasher passwordHasher, IWebHostEnvironment environment)
{
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        await EnsureDatabaseExistsAsync(cancellationToken);
        await ApplySchemaAsync(cancellationToken);
        await SeedAsync(cancellationToken);
    }

    private async Task EnsureDatabaseExistsAsync(CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenMasterConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            IF DB_ID(@databaseName) IS NULL
            BEGIN
                DECLARE @statement NVARCHAR(MAX) = N'CREATE DATABASE [' + REPLACE(@databaseName, ']', ']]') + N']';
                EXEC(@statement);
            END
            """;
        command.Parameters.AddWithValue("@databaseName", connectionFactory.DatabaseName);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    private async Task ApplySchemaAsync(CancellationToken cancellationToken)
    {
        var schemaPath = Path.Combine(environment.ContentRootPath, "database", "schema.sql");
        if (!File.Exists(schemaPath))
        {
            schemaPath = Path.GetFullPath(Path.Combine(environment.ContentRootPath, "..", "database", "schema.sql"));
        }

        var schemaSql = await File.ReadAllTextAsync(schemaPath, cancellationToken);
        var batches = Regex.Split(schemaSql, @"^\s*GO\s*$", RegexOptions.Multiline)
            .Where(batch => !string.IsNullOrWhiteSpace(batch));

        await using var connection = await connectionFactory.OpenDatabaseConnectionAsync(cancellationToken);
        foreach (var batch in batches)
        {
            await using var command = connection.CreateCommand();
            command.CommandText = batch;
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
    }

    private async Task SeedAsync(CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenDatabaseConnectionAsync(cancellationToken);
        var adminPasswordHash = passwordHasher.Hash("Admin@123");

        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                IF NOT EXISTS (SELECT 1 FROM dbo.Admins WHERE Email = @email)
                BEGIN
                    INSERT INTO dbo.Admins (FullName, Email, PasswordHash, RoleName, IsActive)
                    VALUES (@fullName, @email, @passwordHash, 'SuperAdmin', 1);
                END
                """;
            command.Parameters.AddWithValue("@fullName", "LuckyZone Admin");
            command.Parameters.AddWithValue("@email", "admin@luckyzone.com");
            command.Parameters.AddWithValue("@passwordHash", adminPasswordHash);
            await command.ExecuteNonQueryAsync(cancellationToken);
        }

        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                MERGE dbo.Categories AS target
                USING (VALUES
                    ('iPhone', 'iphone', 'Apple', '/assets/category-iphone.png', 'Premium iPhone lineup.', 1),
                    ('MacBook & Mac', 'mac', 'Apple', '/assets/category-macbook.png', 'MacBook, iMac and Mac devices.', 2),
                    ('iPad', 'ipad', 'Apple', '/assets/category-ipad.png', 'Apple tablets for work and entertainment.', 3),
                    ('Apple Watch', 'watch', 'Apple', '/assets/category-watch.png', 'Apple smartwatch collection.', 4),
                    ('AirPods', 'airpods', 'Apple', '/assets/category-airpods.png', 'Apple wireless audio devices.', 5),
                    ('Apple Accessories', 'accessories', 'Apple', '/assets/category-accessories.png', 'Cases, chargers, cables and more.', 6),
                    ('Samsung Phones', 'samsung-phones', 'Samsung', '/assets/samsung-card-phone-new.png', 'Samsung Galaxy phone collection.', 7),
                    ('Samsung Watches', 'samsung-watches', 'Samsung', '/assets/samsung-card-watch-new.png', 'Samsung Galaxy smartwatches.', 8),
                    ('Samsung Earbuds', 'samsung-earbuds', 'Samsung', '/assets/samsung-card-buds-new.png', 'Samsung Galaxy Buds collection.', 9),
                    ('Samsung Tablets', 'samsung-tablets', 'Samsung', '/assets/samsung-card-tablet-new.png', 'Samsung Galaxy tablets.', 10),
                    ('Samsung Headsets', 'samsung-headsets', 'Samsung', '/assets/samsung-card-headset-new.png', 'Samsung headsets and audio.', 11),
                    ('Samsung Accessories', 'samsung-accessories', 'Samsung', '/assets/samsung-card-accessories-new.png', 'Samsung cases, chargers and accessories.', 12),
                    ('Other Accessories', 'other-accessories', 'Other', '/assets/category-accessories.png', 'More mobile and computer accessories.', 13),
                    ('Mobile Phones', 'mobile-phones', 'Other', '/assets/device-essential-mobile-phones.png', 'Smart mobile phones and flagship devices.', 14),
                    ('Smart Watch', 'smart-watch', 'Other', '/assets/device-essential-smart-watch.png', 'Smart watches and wearable tech.', 15),
                    ('Headsets', 'headsets', 'Other', '/assets/device-essential-headset.png', 'Headsets and audio devices.', 16),
                    ('Power Banks', 'power-banks', 'Other', '/assets/device-essential-power-bank.png', 'Portable charging and power banks.', 17)
                ) AS source(Name, Slug, Brand, ImageUrl, Description, DisplayOrder)
                ON target.Slug = source.Slug
                WHEN MATCHED THEN UPDATE SET
                    target.Brand = source.Brand,
                    target.ImageUrl = COALESCE(target.ImageUrl, source.ImageUrl),
                    target.Description = COALESCE(target.Description, source.Description)
                WHEN NOT MATCHED THEN
                    INSERT (Name, Slug, Brand, ImageUrl, Description, DisplayOrder, IsFeatured, IsActive)
                    VALUES (source.Name, source.Slug, source.Brand, source.ImageUrl, source.Description, source.DisplayOrder, 1, 1);
                """;
            await command.ExecuteNonQueryAsync(cancellationToken);
        }

        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                IF NOT EXISTS (SELECT 1 FROM dbo.Products)
                BEGIN
                    INSERT INTO dbo.Products (CategoryId, Name, Slug, ShortDescription, Description, Price, CompareAtPrice, StockQuantity, IsFeatured, IsPublished)
                    SELECT c.Id, v.Name, v.Slug, v.ShortDescription, v.Description, v.Price, v.CompareAtPrice, v.StockQuantity, v.IsFeatured, v.IsPublished
                    FROM (VALUES
                        ('iphone', 'LuckyZone Pro Phone', 'luckyzone-pro-phone', 'Flagship smartphone with premium finish.', 'Premium phone collection for LuckyZone.', 299990, 319990, 12, 1, 1),
                        ('airpods', 'LuckyBuds Air', 'luckybuds-air', 'Wireless earbuds with strong battery life.', 'Audio essentials for the LuckyZone catalog.', 44990, 49990, 24, 1, 1),
                        ('ipad', 'LuckyPad Slim', 'luckypad-slim', 'Portable tablet built for work and play.', 'Tablet lineup for browsing, work, and media.', 189990, 205990, 8, 1, 0)
                    ) v(CategorySlug, Name, Slug, ShortDescription, Description, Price, CompareAtPrice, StockQuantity, IsFeatured, IsPublished)
                    INNER JOIN dbo.Categories c ON c.Slug = v.CategorySlug;
                END
                """;
            await command.ExecuteNonQueryAsync(cancellationToken);
        }

        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                IF NOT EXISTS (SELECT 1 FROM dbo.ProductColors pc INNER JOIN dbo.Products p ON p.Id=pc.ProductId WHERE p.Slug='luckyzone-pro-phone')
                BEGIN
                    DECLARE @phoneProductId INT = (SELECT TOP 1 Id FROM dbo.Products WHERE Slug='luckyzone-pro-phone');
                    IF @phoneProductId IS NOT NULL
                    BEGIN
                        INSERT INTO dbo.ProductColors (ProductId, Name, HexCode, DisplayOrder) VALUES (@phoneProductId, 'Midnight Black', '#171717', 0);
                        DECLARE @phoneColorId INT = SCOPE_IDENTITY();
                        INSERT INTO dbo.ProductImages (ProductId, ColorId, ImageUrl, AltText, DisplayOrder, IsPrimary)
                        VALUES (@phoneProductId, @phoneColorId, '/assets/hero-iphone-new.png', 'LuckyZone Pro Phone in Midnight Black', 0, 1);
                    END
                END

                IF NOT EXISTS (SELECT 1 FROM dbo.ProductColors pc INNER JOIN dbo.Products p ON p.Id=pc.ProductId WHERE p.Slug='luckybuds-air')
                BEGIN
                    DECLARE @budsProductId INT = (SELECT TOP 1 Id FROM dbo.Products WHERE Slug='luckybuds-air');
                    IF @budsProductId IS NOT NULL
                    BEGIN
                        INSERT INTO dbo.ProductColors (ProductId, Name, HexCode, DisplayOrder) VALUES (@budsProductId, 'White', '#f8fafc', 0);
                        DECLARE @budsColorId INT = SCOPE_IDENTITY();
                        INSERT INTO dbo.ProductImages (ProductId, ColorId, ImageUrl, AltText, DisplayOrder, IsPrimary)
                        VALUES (@budsProductId, @budsColorId, '/assets/category-airpods.png', 'LuckyBuds Air in White', 0, 1);
                    END
                END

                IF NOT EXISTS (SELECT 1 FROM dbo.ProductColors pc INNER JOIN dbo.Products p ON p.Id=pc.ProductId WHERE p.Slug='luckypad-slim')
                BEGIN
                    DECLARE @padProductId INT = (SELECT TOP 1 Id FROM dbo.Products WHERE Slug='luckypad-slim');
                    IF @padProductId IS NOT NULL
                    BEGIN
                        INSERT INTO dbo.ProductColors (ProductId, Name, HexCode, DisplayOrder) VALUES (@padProductId, 'Sky Blue', '#a8c7e8', 0);
                        DECLARE @padColorId INT = SCOPE_IDENTITY();
                        INSERT INTO dbo.ProductImages (ProductId, ColorId, ImageUrl, AltText, DisplayOrder, IsPrimary)
                        VALUES (@padProductId, @padColorId, '/assets/category-ipad.png', 'LuckyPad Slim in Sky Blue', 0, 1);
                    END
                END
                """;
            await command.ExecuteNonQueryAsync(cancellationToken);
        }

        await using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                IF NOT EXISTS (SELECT 1 FROM dbo.HomeBanners)
                BEGIN
                    INSERT INTO dbo.HomeBanners (Title, Subtitle, ButtonText, ButtonLink, DisplayOrder, IsActive)
                    VALUES
                        ('Explore latest lineup', 'Premium electronics with LuckyZone identity', 'Shop Now', '/', 1, 1),
                        ('Trade in and upgrade', 'Best offers for flagship devices', 'View Deals', '/categories/iphone', 2, 1);
                END
                """;
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
    }
}
