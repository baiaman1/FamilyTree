using Application.Commands;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Handlers;

public class DeletePersonHandler
{
    private readonly IPersonService _service;

    public DeletePersonHandler(IPersonService service)
    {
        _service = service;
    }

    public Task Handle(DeletePersonCommand cmd, CancellationToken ct)
        => _service.DeleteAsync(cmd.Id, ct);
}
