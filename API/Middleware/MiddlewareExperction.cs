
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
namespace API.Middleware;

public class MiddlewareException(IHostEnvironment host, ILogger<MiddlewareException> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }
    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ProblemDetails()
        {
            Status = 500,
            Detail = host.IsDevelopment() ? ex.StackTrace?.ToString() : null,
            Title = ex.Message
        };

        var option = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, option);
        await context.Response.WriteAsJsonAsync(json);
    }
}
