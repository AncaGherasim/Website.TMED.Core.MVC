using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;

namespace MVC_TMED.Infrastructure
{
    public static class ClientInfo
    {
        public static string GetClientIp(HttpContext ctx)
        {
            if (ctx == null)
            {
                return "UnknownIP";
            }

            if (ctx.Request.Headers.TryGetValue("X-Forwarded-For", out var xfwd) && !StringValues.IsNullOrEmpty(xfwd))
            {
                var ip = xfwd.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0].Trim();
                if (!string.IsNullOrEmpty(ip))
                    return ip;
            }
            else if (ctx.Request.Headers.TryGetValue("X-Real-IP", out var xrealip) && !StringValues.IsNullOrEmpty(xrealip))
            {
                var ip = xrealip.ToString().Trim();
                if (!string.IsNullOrEmpty(ip))
                    return ip;
            }

            return ctx.Connection.RemoteIpAddress?.ToString() ?? "UnknownIP";
        }
    }
}