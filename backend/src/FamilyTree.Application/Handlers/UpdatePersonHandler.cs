using Application.Commands;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Handlers;

public class UpdatePersonHandler
{
    private readonly IPersonService _service;

    public UpdatePersonHandler(IPersonService service)
    {
        _service = service;
    }

    public Task Handle(UpdatePersonCommand cmd, CancellationToken ct)
        => _service.UpdateAsync(cmd.Id, cmd.Name, ct);
}
