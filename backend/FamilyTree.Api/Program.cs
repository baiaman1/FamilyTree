using FamilyTree.Infrastructure.Persistence;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using WebApi.Extensions;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Swagger UI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// DI
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();
app.Urls.Add("http://0.0.0.0:8080");

// SEED
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // ✅ применяем миграции автоматически
    await db.Database.MigrateAsync();

    // ✅ потом сидинг
    await DbInitializer.SeedRootAsync(db);
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 👇 ВАЖНО: CORS ДО authorization и controllers
app.UseCors("FrontendPolicy");

app.UseAuthorization();
app.MapControllers();

app.Run();
