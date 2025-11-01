using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class CompanyRepository : Repository<Company>, ICompanyRepository
{
    public CompanyRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Company> GetCompanyWithUserAsync(int companyId)
    {
        return await _context.Companies
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == companyId);
    }

    public async Task<IEnumerable<Company>> GetCompaniesByIndustryAsync(string industry)
    {
        return await _context.Companies
            .Include(c => c.User)
            .Where(c => c.Industry.Contains(industry))
            .ToListAsync();
    }

    public async Task<Company> GetCompanyByUserIdAsync(int userId)
    {
        return await _context.Companies
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == userId);
    }

    public async Task<IEnumerable<Company>> GetVerifiedCompaniesAsync()
    {
        return await _context.Companies
            .Include(c => c.User)
            .Where(c => c.KYCStatus == "Approved")
            .ToListAsync();
    }
}