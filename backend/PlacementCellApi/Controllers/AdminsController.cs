using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminsController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminsController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdminProfile(int id)
    {
        var admin = await _adminService.GetAdminProfileAsync(id);
        if (admin == null)
            return NotFound(new { success = false, message = "Admin not found" });

        return Ok(new { success = true, data = admin });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetAdminByUserId(int userId)
    {
        var admin = await _adminService.GetAdminByUserIdAsync(userId);
        if (admin == null)
            return NotFound(new { success = false, message = "Admin profile not found" });

        return Ok(new { success = true, data = admin });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAdmins()
    {
        var admins = await _adminService.GetAllAdminsAsync();
        return Ok(new { success = true, data = admins });
    }

    [HttpPost]
    public async Task<IActionResult> CreateAdminProfile([FromBody] Admin admin)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid admin data" });

        var createdAdmin = await _adminService.CreateAdminProfileAsync(admin);
        return CreatedAtAction(nameof(GetAdminProfile), new { id = createdAdmin.Id },
            new { success = true, data = createdAdmin, message = "Admin profile created successfully" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAdminProfile(int id, [FromBody] Admin admin)
    {
        if (id != admin.Id)
            return BadRequest(new { success = false, message = "Admin ID mismatch" });

        var existingAdmin = await _adminService.GetAdminProfileAsync(id);
        if (existingAdmin == null)
            return NotFound(new { success = false, message = "Admin not found" });

        await _adminService.UpdateAdminProfileAsync(admin);
        return Ok(new { success = true, message = "Admin profile updated successfully" });
    }

    [HttpGet("check/{userId}")]
    public async Task<IActionResult> CheckAdminStatus(int userId)
    {
        var isAdmin = await _adminService.IsUserAdminAsync(userId);
        return Ok(new { success = true, isAdmin });
    }
}