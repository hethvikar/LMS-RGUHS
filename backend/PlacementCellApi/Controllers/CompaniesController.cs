using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompanyProfile(int id)
    {
        var company = await _companyService.GetCompanyProfileAsync(id);
        if (company == null)
            return NotFound(new { success = false, message = "Company not found" });

        return Ok(new { success = true, data = company });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetCompanyByUserId(int userId)
    {
        var company = await _companyService.GetCompanyByUserIdAsync(userId);
        if (company == null)
            return NotFound(new { success = false, message = "Company profile not found" });

        return Ok(new { success = true, data = company });
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> CreateCompanyProfile([FromBody] Company company)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid company data" });

        var createdCompany = await _companyService.CreateCompanyProfileAsync(company);
        return CreatedAtAction(nameof(GetCompanyProfile), new { id = createdCompany.Id },
            new { success = true, data = createdCompany, message = "Company profile created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateCompanyProfile(int id, [FromBody] Company company)
    {
        if (id != company.Id)
            return BadRequest(new { success = false, message = "Company ID mismatch" });

        var existingCompany = await _companyService.GetCompanyProfileAsync(id);
        if (existingCompany == null)
            return NotFound(new { success = false, message = "Company not found" });

        await _companyService.UpdateCompanyProfileAsync(company);
        return Ok(new { success = true, message = "Company profile updated successfully" });
    }

    [HttpPut("{id}/kyc")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateKYCStatus(int id, [FromBody] string status)
    {
        await _companyService.UpdateCompanyKYCStatusAsync(id, status);
        return Ok(new { success = true, message = "KYC status updated successfully" });
    }

    [HttpGet("industry/{industry}")]
    public async Task<IActionResult> GetCompaniesByIndustry(string industry)
    {
        var companies = await _companyService.GetCompaniesByIndustryAsync(industry);
        return Ok(new { success = true, data = companies });
    }

    [HttpGet("verified")]
    public async Task<IActionResult> GetVerifiedCompanies()
    {
        var companies = await _companyService.GetVerifiedCompaniesAsync();
        return Ok(new { success = true, data = companies });
    }
}