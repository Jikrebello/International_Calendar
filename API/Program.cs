using API;
using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

public class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();

        // Add DbContext.
        builder.Services.AddDbContext<DataContext>(
            options =>
                options.UseSqlite(
                    builder.Configuration.GetConnectionString(name: "DefaultConnection")
                )
        );

        builder.Services.AddServices();
        builder.Services.AddRepositories();

        builder.Services.AddIdentityServices(builder.Configuration);

        // Add Nuget Middleware.
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition(
                name: "Bearer",
                new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                }
            );
            c.AddSecurityRequirement(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        },
                        Array.Empty<string>()
                    }
                }
            );
        });

        builder.Services.AddCors();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseMiddleware<ExceptionMiddleware>();

        if (app.Environment.IsDevelopment())
        {
            app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseCors(
                builder =>
                    builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200")
            );
        }

        // Add the CSP middleware here
        app.Use(
            async (context, next) =>
            {
                context.Response.Headers.Add(
                    key: "Content-Security-Policy",
                    value: "default-src 'self'; img-src *; media-src media1.com media2.com; script-src scripts.com"
                );
                await next();
            }
        );

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
