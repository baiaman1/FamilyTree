using Application.Interfaces;
using FamilyTree.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTree.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public DbSet<Person> Persons => Set<Person>();

    // ЯВНАЯ реализация интерфейса (важно)
    IQueryable<Person> IAppDbContext.Persons => Persons;

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public async Task AddPersonAsync(Person person, CancellationToken ct)
    {
        await Persons.AddAsync(person, ct);
    }

    public Task RemovePersonAsync(Person person, CancellationToken ct)
    {
        Persons.Remove(person);
        return Task.CompletedTask;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.HasOne(x => x.Father)
                .WithMany(x => x.Children)
                .HasForeignKey(x => x.FatherId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(x => x.Path)
                .IsRequired()
                .HasMaxLength(500);

            entity.HasIndex(x => x.Path);
            entity.HasIndex(x => x.FatherId);
        });
    }
}
