using Microsoft.Data.SqlClient;

namespace LuckyZone.Api.Infrastructure;

internal sealed class SqlConnectionFactory
{
    private readonly IConfiguration _configuration;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string DatabaseName => _configuration["Database:Name"] ?? "LuckyZoneDb";

    public string BuildConnectionString(string databaseName, bool includeDatabase = true)
    {
        var configuredConnectionString = _configuration.GetConnectionString("Sql");
        if (!string.IsNullOrWhiteSpace(configuredConnectionString))
        {
            var configuredBuilder = new SqlConnectionStringBuilder(configuredConnectionString);
            if (includeDatabase)
            {
                configuredBuilder.InitialCatalog = databaseName;
            }
            else
            {
                configuredBuilder.Remove("Initial Catalog");
            }

            return configuredBuilder.ConnectionString;
        }

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = _configuration["Database:Server"] ?? @".\SQLEXPRESS",
            Encrypt = _configuration.GetValue("Database:Encrypt", false),
            TrustServerCertificate = _configuration.GetValue("Database:TrustServerCertificate", true),
            MultipleActiveResultSets = false
        };

        var user = _configuration["Database:User"];
        var password = _configuration["Database:Password"];
        if (!string.IsNullOrWhiteSpace(user))
        {
            builder.UserID = user;
            builder.Password = password;
        }
        else
        {
            builder.IntegratedSecurity = true;
        }

        if (includeDatabase)
        {
            builder.InitialCatalog = databaseName;
        }

        var dbPort = _configuration["Database:Port"];
        if (!string.IsNullOrWhiteSpace(dbPort) && !builder.DataSource.Contains('\\') && !builder.DataSource.Contains(','))
        {
            builder.DataSource = $"{builder.DataSource},{dbPort}";
        }

        return builder.ConnectionString;
    }

    public async Task<SqlConnection> OpenDatabaseConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new SqlConnection(BuildConnectionString(DatabaseName));
        await connection.OpenAsync(cancellationToken);
        return connection;
    }

    public async Task<SqlConnection> OpenMasterConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new SqlConnection(BuildConnectionString("master"));
        await connection.OpenAsync(cancellationToken);
        return connection;
    }
}
