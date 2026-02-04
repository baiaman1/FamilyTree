using Application.Handlers;
using Application.Interfaces;
using FamilyTree.Application.Services;
using FamilyTree.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext (PostgreSQL)
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection")));

        // DbContext interface
        services.AddScoped<IAppDbContext>(sp =>
            sp.GetRequiredService<AppDbContext>());

        // Services
        services.AddScoped<IPersonService, PersonService>();

        // Handlers
        services.AddScoped<GetRootPersonHandler>();
        services.AddScoped<GetChildrenHandler>();
        services.AddScoped<AddChildHandler>();
        services.AddScoped<UpdatePersonHandler>();
        services.AddScoped<DeletePersonHandler>();

        return services;
    }
}
