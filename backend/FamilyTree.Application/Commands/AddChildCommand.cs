using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Commands;

public record AddChildCommand(Guid FatherId, string Name);
