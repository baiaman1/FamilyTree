using Application.DTOs;
using Application.Interfaces;
using Application.Queries;

namespace Application.Handlers;

public class GetRootPersonHandler
{
    private readonly IPersonService _service;

    public GetRootPersonHandler(IPersonService service)
    {
        _service = service;
    }

    public Task<PersonNodeDto?> Handle(GetRootPersonQuery _, CancellationToken ct)
        => _service.GetRootAsync(ct);
}
