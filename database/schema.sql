IF DB_ID(N'LuckyZoneDb') IS NULL
BEGIN
    CREATE DATABASE LuckyZoneDb;
END;
GO

USE LuckyZoneDb;
GO

IF OBJECT_ID('dbo.Admins', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Admins (
        Id INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(200) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        RoleName NVARCHAR(50) NOT NULL DEFAULT 'SuperAdmin',
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END;
GO

IF OBJECT_ID('dbo.Categories', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(150) NOT NULL,
        Slug NVARCHAR(180) NOT NULL UNIQUE,
        Brand NVARCHAR(80) NULL,
        ImageUrl NVARCHAR(500) NULL,
        Description NVARCHAR(MAX) NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        IsFeatured BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END;
GO

IF COL_LENGTH('dbo.Categories', 'Brand') IS NULL
    ALTER TABLE dbo.Categories ADD Brand NVARCHAR(80) NULL;
GO

IF COL_LENGTH('dbo.Categories', 'ImageUrl') IS NULL
    ALTER TABLE dbo.Categories ADD ImageUrl NVARCHAR(500) NULL;
GO

IF OBJECT_ID('dbo.Products', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CategoryId INT NOT NULL,
        Name NVARCHAR(200) NOT NULL,
        Slug NVARCHAR(220) NOT NULL UNIQUE,
        ShortDescription NVARCHAR(600) NULL,
        Description NVARCHAR(MAX) NULL,
        Price DECIMAL(18,2) NOT NULL,
        CompareAtPrice DECIMAL(18,2) NULL,
        StockQuantity INT NOT NULL DEFAULT 0,
        IsFeatured BIT NOT NULL DEFAULT 0,
        IsPublished BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(Id)
    );
END;
GO

IF OBJECT_ID('dbo.ProductColors', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProductColors (
        Id INT PRIMARY KEY IDENTITY(1,1),
        ProductId INT NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        HexCode NVARCHAR(20) NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        CONSTRAINT FK_ProductColors_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id)
    );
END;
GO

IF OBJECT_ID('dbo.ProductImages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProductImages (
        Id INT PRIMARY KEY IDENTITY(1,1),
        ProductId INT NOT NULL,
        ColorId INT NULL,
        ImageUrl NVARCHAR(500) NOT NULL,
        AltText NVARCHAR(200) NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        IsPrimary BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id)
    );
END;
GO

IF COL_LENGTH('dbo.ProductImages', 'ColorId') IS NULL
    ALTER TABLE dbo.ProductImages ADD ColorId INT NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ProductImages_ProductColors')
    ALTER TABLE dbo.ProductImages ADD CONSTRAINT FK_ProductImages_ProductColors
        FOREIGN KEY (ColorId) REFERENCES dbo.ProductColors(Id);
GO

IF OBJECT_ID('dbo.HomeBanners', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.HomeBanners (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Title NVARCHAR(200) NOT NULL,
        Subtitle NVARCHAR(500) NULL,
        ButtonText NVARCHAR(80) NULL,
        ButtonLink NVARCHAR(250) NULL,
        BackgroundImageUrl NVARCHAR(500) NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1
    );
END;
GO

IF OBJECT_ID('dbo.SiteSettings', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SiteSettings (
        Id INT PRIMARY KEY IDENTITY(1,1),
        SiteName NVARCHAR(150) NOT NULL,
        LogoUrl NVARCHAR(500) NULL,
        PrimaryColor NVARCHAR(30) NULL,
        SecondaryColor NVARCHAR(30) NULL,
        AccentColor NVARCHAR(30) NULL,
        ContactEmail NVARCHAR(200) NULL,
        ContactPhone NVARCHAR(50) NULL,
        AddressLine NVARCHAR(300) NULL
    );
END;
GO
