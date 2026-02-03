using Application.DTOs;
using Application.Interfaces;
using FamilyTree.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTree.Application.Services;

public class PersonService : IPersonService
{
    private readonly IAppDbContext _db;

    public PersonService(IAppDbContext db)
    {
        _db = db;
    }

    public async Task<PersonNodeDto?> GetRootAsync(CancellationToken ct)
    {
        return await _db.Persons
            .Where(x => x.FatherId == null)
            .Select(x => new PersonNodeDto
            {
                Id = x.Id,
                Name = x.Name,
                HasChildren = _db.Persons.Any(c => c.FatherId == x.Id)
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<List<PersonNodeDto>> GetChildrenAsync(Guid fatherId, CancellationToken ct)
    {
        return await _db.Persons
            .Where(x => x.FatherId == fatherId)
            .OrderBy(x => x.Name)
            .Select(x => new PersonNodeDto
            {
                Id = x.Id,
                Name = x.Name,
                HasChildren = _db.Persons.Any(c => c.FatherId == x.Id)
            })
            .ToListAsync(ct);
    }

    public async Task<Guid> AddChildAsync(Guid fatherId, string name, CancellationToken ct)
    {
        var father = await _db.Persons
            .FirstOrDefaultAsync(x => x.Id == fatherId, ct)
            ?? throw new Exception("Father not found");

        var child = new Person
        {
            Id = Guid.NewGuid(),
            Name = name,
            FatherId = fatherId,
            Depth = father.Depth + 1,
            Path = $"{father.Path}.{Guid.NewGuid():N}"
        };

        await _db.AddPersonAsync(child, ct);
        await _db.SaveChangesAsync(ct);

        return child.Id;
    }
}
