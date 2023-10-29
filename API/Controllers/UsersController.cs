using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpGet(template: "{id}")]
    public async Task<ActionResult<UserDTO>> GetUserById(Guid id)
    {
        var result = await _usersService.GetByIdAsync(id);
        return Ok(result);
    }

    [HttpGet(template: "{emailAddress}")]
    public async Task<ActionResult<UserDTO>> GetUserByEmailAddress(string emailAddress)
    {
        var result = await _usersService.GetByEmailAddressAsync(emailAddress);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await _usersService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UserDTO>> Register(RegisterUserDTO dto)
    {
        var result = await _usersService.Register(dto);
        return Created("", result);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO dto)
    {
        var result = await _usersService.Login(dto);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<BaseResponse>> EditUser(EditUserDTO dto)
    {
        var result = await _usersService.EditUser(dto);
        return Ok(result);
    }
}
