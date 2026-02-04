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
        var root = await _db.Persons
            .Where(x => x.FatherId == null)
            .Select(x => new { x.Id, x.Name })
            .FirstOrDefaultAsync(ct);

        if (root == null)
            return null;

        var hasChildren = await _db.Persons
            .AnyAsync(x => x.FatherId == root.Id, ct);

        return new PersonNodeDto
        {
            Id = root.Id,
            Name = root.Name,
            HasChildren = hasChildren
        };
    }

    public async Task<List<PersonNodeDto>> GetChildrenAsync(Guid fatherId, CancellationToken ct)
    {
        // 1. Получаем всех детей
        var children = await _db.Persons
            .Where(x => x.FatherId == fatherId)
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name
            })
            .ToListAsync(ct);

        if (children.Count == 0)
            return new List<PersonNodeDto>();

        var childIds = children.Select(x => x.Id).ToList();

        // 2. Один запрос: у кого из них есть дети
        var parentsWithChildren = await _db.Persons
            .Where(x => x.FatherId != null && childIds.Contains(x.FatherId.Value))
            .Select(x => x.FatherId!.Value)
            .Distinct()
            .ToListAsync(ct);

        var parentsSet = parentsWithChildren.ToHashSet();

        // 3. Собираем DTO
        return children.Select(x => new PersonNodeDto
        {
            Id = x.Id,
            Name = x.Name,
            HasChildren = parentsSet.Contains(x.Id)
        }).ToList();
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

    public async Task UpdateAsync(Guid id, string name, CancellationToken ct)
    {
        var person = await _db.Persons.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new Exception("Person not found");

        person.Name = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var hasChildren = await _db.Persons.AnyAsync(x => x.FatherId == id, ct);
        if (hasChildren)
            throw new InvalidOperationException("Cannot delete person with children");

        var person = await _db.Persons
            .FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new Exception("Person not found");

        await _db.RemovePersonAsync(person, ct);
        await _db.SaveChangesAsync(ct);
    }
}
