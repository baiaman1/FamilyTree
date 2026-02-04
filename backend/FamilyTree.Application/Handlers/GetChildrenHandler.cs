using Application.DTOs;
using Application.Interfaces;
using Application.Queries;

namespace Application.Handlers;

public class GetChildrenHandler
{
    private readonly IPersonService _service;

    public GetChildrenHandler(IPersonService service)
    {
        _service = service;
    }

    public Task<List<PersonNodeDto>> Handle(GetChildrenQuery query, CancellationToken ct)
        => _service.GetChildrenAsync(query.FatherId, ct);
}

