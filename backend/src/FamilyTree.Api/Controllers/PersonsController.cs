using Application.Commands;
using Application.DTOs;
using Application.Handlers;
using Application.Queries;
using FamilyTree.Application.Services;
using Microsoft.AspNetCore.Mvc;
using WebApi.Models;

namespace WebApi.Controllers;

[ApiController]
[Route("api/persons")]
public class PersonsController : ControllerBase
{
    private readonly GetRootPersonHandler _getRootHandler;
    private readonly GetChildrenHandler _getChildrenHandler;
    private readonly AddChildHandler _addChildHandler;
    private readonly UpdatePersonHandler _updateHandler;
    private readonly DeletePersonHandler _deleteHandler;

    public PersonsController(
        GetRootPersonHandler getRootHandler,
        GetChildrenHandler getChildrenHandler,
        AddChildHandler addChildHandler,
        UpdatePersonHandler updatePersonHandler,
        DeletePersonHandler deletePersonHandler)
    {
        _getRootHandler = getRootHandler;
        _getChildrenHandler = getChildrenHandler;
        _addChildHandler = addChildHandler;
        _updateHandler = updatePersonHandler;
        _deleteHandler = deletePersonHandler;
    }

    /// <summary>
    /// Получить корневого предка
    /// </summary>
    [HttpGet("root")]
    public async Task<IActionResult> GetRoot(CancellationToken ct)
    {
        var result = await _getRootHandler.Handle(new GetRootPersonQuery(), ct);
        return result == null ? NotFound() : Ok(result);
    }

    /// <summary>
    /// Получить детей узла (lazy loading)
    /// </summary>
    [HttpGet("{id:guid}/children")]
    public async Task<IActionResult> GetChildren(Guid id, CancellationToken ct)
    {
        var result = await _getChildrenHandler.Handle(
            new GetChildrenQuery(id), ct);

        return Ok(result);
    }

    /// <summary>
    /// Добавить сына
    /// </summary>
    [HttpPost("{id:guid}/children")]
    public async Task<IActionResult> AddChild(
        Guid id,
        [FromBody] AddChildRequest request,
        CancellationToken ct)
    {
        var newId = await _addChildHandler.Handle(
            new AddChildCommand(id, request.Name), ct);

        return Ok(new { Id = newId });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
    Guid id,
    [FromBody] UpdatePersonDto dto,
    CancellationToken ct)
    {
        await _updateHandler.Handle(new UpdatePersonCommand(id, dto.Name), ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _deleteHandler.Handle(new DeletePersonCommand(id), ct);
        return NoContent();
    }

}