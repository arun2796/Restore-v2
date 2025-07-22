using System;
using System.Security.Claims;

namespace API.Extension;

public static class ClaimPrinciple
{
    public static string GetUsername(this ClaimsPrincipal user)
    {

        return user.Identity?.Name ?? throw new Exception("Username not found");
    }
}
