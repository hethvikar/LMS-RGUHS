using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;

    public CompanyService(ICompanyRepository companyRepository)
    {
        _companyRepository = companyRepository;
    }

    public async Task<Company> GetCompanyProfileAsync(int companyId)
    {
        return await _companyRepository.GetCompanyWithUserAsync(companyId);
    }

    public async Task<Company> CreateCompanyProfileAsync(Company company)
    {
        return await _companyRepository.AddAsync(company);
    }

    public async Task UpdateCompanyProfileAsync(Company company)
    {
        await _companyRepository.UpdateAsync(company);
    }

    public async Task UpdateCompanyKYCStatusAsync(int companyId, string status)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company != null)
        {
            company.KYCStatus = status;
            await _companyRepository.UpdateAsync(company);
        }
    }

    public async Task<IEnumerable<Company>> GetCompaniesByIndustryAsync(string industry)
    {
        return await _companyRepository.GetCompaniesByIndustryAsync(industry);
    }

    public async Task<Company> GetCompanyByUserIdAsync(int userId)
    {
        return await _companyRepository.GetCompanyByUserIdAsync(userId);
    }

    public async Task<IEnumerable<Company>> GetVerifiedCompaniesAsync()
    {
        return await _companyRepository.GetVerifiedCompaniesAsync();
    }
}