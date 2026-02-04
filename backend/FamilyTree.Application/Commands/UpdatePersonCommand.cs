using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Commands;

public record UpdatePersonCommand(Guid Id, string Name);
