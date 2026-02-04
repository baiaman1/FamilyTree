using System;
using System.Collections.Generic;
using System.Text;

namespace FamilyTree.Domain.Entities;

public class Person
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public Guid? FatherId { get; set; }
    public Person? Father { get; set; }

    public ICollection<Person> Children { get; set; } = new List<Person>();

    // Для производительности
    public string Path { get; set; } = null!;
    public int Depth { get; set; }

    public DateTime CreatedAt { get; set; }
}