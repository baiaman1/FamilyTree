using FamilyTree.Domain.Entities;
using FamilyTree.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedRootAsync(AppDbContext db)
    {
        if (await db.Persons.AnyAsync())
            return;

        var root = new Person
        {
            Id = Guid.NewGuid(),
            Name = "Основатель рода",
            FatherId = null,
            Depth = 0,
            Path = "0001"
        };

        db.Persons.Add(root);
        await db.SaveChangesAsync();
    }
}