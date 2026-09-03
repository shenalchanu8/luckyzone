using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace LuckyZone.Api.Security;

internal sealed class AdminTokenService
{
    private readonly byte[] _secret;
    private readonly int _expiryHours;

    public AdminTokenService(IConfiguration configuration)
    {
        _secret = Encoding.UTF8.GetBytes(configuration["Jwt:Secret"] ?? "LuckyZone-Secure-2026");
        _expiryHours = Math.Max(1, configuration.GetValue("Jwt:ExpiryHours", 8));
    }

    public string Create(AdminIdentity admin)
    {
        var payload = JsonSerializer.Serialize(new TokenPayload(
            admin.Id,
            admin.Email,
            admin.RoleName,
            DateTimeOffset.UtcNow.AddHours(_expiryHours).ToUnixTimeSeconds()));

        var payloadBytes = Encoding.UTF8.GetBytes(payload);
        var signatureBytes = HMACSHA256.HashData(_secret, payloadBytes);

        return $"{Convert.ToBase64String(payloadBytes)}.{Convert.ToBase64String(signatureBytes)}";
    }

    public bool TryRead(string? authorizationHeader, out TokenPayload payload)
    {
        payload = default!;

        if (string.IsNullOrWhiteSpace(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            return false;
        }

        var token = authorizationHeader["Bearer ".Length..].Trim();
        var parts = token.Split('.', 2);
        if (parts.Length != 2)
        {
            return false;
        }

        try
        {
            var payloadBytes = Convert.FromBase64String(parts[0]);
            var signatureBytes = Convert.FromBase64String(parts[1]);
            var expectedSignature = HMACSHA256.HashData(_secret, payloadBytes);

            if (!CryptographicOperations.FixedTimeEquals(signatureBytes, expectedSignature))
            {
                return false;
            }

            payload = JsonSerializer.Deserialize<TokenPayload>(payloadBytes)!;
            return payload.ExpiresAtUnix > DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }
        catch
        {
            return false;
        }
    }
}

internal sealed record TokenPayload(int AdminId, string Email, string Role, long ExpiresAtUnix);
