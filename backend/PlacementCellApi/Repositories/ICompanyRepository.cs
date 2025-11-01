using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface ICompanyRepository : IRepository<Company>
{
    Task<Company> GetCompanyWithUserAsync(int companyId);
    Task<IEnumerable<Company>> GetCompaniesByIndustryAsync(string industry);
    Task<Company> GetCompanyByUserIdAsync(int userId);
    Task<IEnumerable<Company>> GetVerifiedCompaniesAsync();
}