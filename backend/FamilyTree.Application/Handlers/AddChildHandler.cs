using Application.Commands;
using Application.Interfaces;

namespace Application.Handlers;

public class AddChildHandler
{
    private readonly IPersonService _service;

    public AddChildHandler(IPersonService service)
    {
        _service = service;
    }

    public Task<Guid> Handle(AddChildCommand command, CancellationToken ct)
        => _service.AddChildAsync(command.FatherId, command.Name, ct);
}
