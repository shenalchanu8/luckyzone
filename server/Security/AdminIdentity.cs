namespace LuckyZone.Api.Security;

internal sealed record AdminIdentity(int Id, string FullName, string Email, string RoleName);
