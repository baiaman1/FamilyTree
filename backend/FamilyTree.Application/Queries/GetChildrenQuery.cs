using System;
using System.Collections.Generic;
using System.Text;
using Application.DTOs;

namespace Application.Queries;


public record GetChildrenQuery(Guid FatherId);
