using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces;

public interface IPersonService
{
    Task<PersonNodeDto?> GetRootAsync(CancellationToken ct);
    Task<List<PersonNodeDto>> GetChildrenAsync(Guid fatherId, CancellationToken ct);
    Task<Guid> AddChildAsync(Guid fatherId, string name, CancellationToken ct);
}