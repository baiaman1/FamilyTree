using FamilyTree.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces;

public interface IAppDbContext
{
    // READ
    IQueryable<Person> Persons { get; }

    // WRITE
    Task AddPersonAsync(Person person, CancellationToken ct);
    Task RemovePersonAsync(Person person, CancellationToken ct);

    Task<int> SaveChangesAsync(CancellationToken ct);
}