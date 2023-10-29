using System.Net;
using System.Text.Json;
using API.DTOs;
using API.Errors;
using API.Exceptions;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IHostEnvironment environment
        )
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, exception.Message);
                context.Response.ContentType = "application/json";

                if (exception is InvalidCredentialsException)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    var response = new ResultResponse<APIException>(
                        success: false,
                        message: "Invalid Credentials",
                        result: new APIException(
                            context.Response.StatusCode,
                            details: "Unauthorized"
                        )
                    );
                    var json = JsonSerializer.Serialize(
                        response,
                        new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        }
                    );

                    await context.Response.WriteAsync(json);
                }
                else
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                    var response = _environment.IsDevelopment()
                        ? new ResultResponse<APIException>(
                            success: false,
                            message: exception.Message,
                            result: new APIException(
                                context.Response.StatusCode,
                                details: exception.StackTrace?.ToString()
                            )
                        )
                        : new ResultResponse<APIException>(
                            success: false,
                            message: "Internal Server Error",
                            result: new APIException(
                                context.Response.StatusCode,
                                details: "Internal Server Error"
                            )
                        );

                    var options = new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    };

                    var json = JsonSerializer.Serialize(response, options);

                    await context.Response.WriteAsync(json);
                }
            }
        }
    }
}
