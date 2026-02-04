using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs;

public class PersonNodeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public bool HasChildren { get; set; }
}
