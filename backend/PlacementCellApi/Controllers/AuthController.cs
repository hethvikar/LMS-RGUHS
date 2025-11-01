using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (success, token, message, user) = await _authService.LoginAsync(request.Email, request.Password);

        if (!success)
            return BadRequest(new { message });

        return Ok(new { token, message, user });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Role = request.Role
        };

        var (success, message) = await _authService.RegisterAsync(user, request.Password);

        if (!success)
            return BadRequest(new { message });

        return Ok(new { message });
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        // Get user ID from JWT token
        var userIdClaim = User.FindFirst("sub");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            return Unauthorized();

        var success = await _authService.ChangePasswordAsync(userId, request.OldPassword, request.NewPassword);

        if (!success)
            return BadRequest(new { message = "Invalid old password" });

        return Ok(new { message = "Password changed successfully" });
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Phone { get; set; }
    public string Role { get; set; }
}

public class ChangePasswordRequest
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}