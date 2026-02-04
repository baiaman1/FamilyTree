using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Commands;

public record DeletePersonCommand(Guid Id);
