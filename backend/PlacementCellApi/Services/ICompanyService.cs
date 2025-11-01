using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface ICompanyService
{
    Task<Company> GetCompanyProfileAsync(int companyId);
    Task<Company> CreateCompanyProfileAsync(Company company);
    Task UpdateCompanyProfileAsync(Company company);
    Task UpdateCompanyKYCStatusAsync(int companyId, string status);
    Task<IEnumerable<Company>> GetCompaniesByIndustryAsync(string industry);
    Task<Company> GetCompanyByUserIdAsync(int userId);
    Task<IEnumerable<Company>> GetVerifiedCompaniesAsync();
}