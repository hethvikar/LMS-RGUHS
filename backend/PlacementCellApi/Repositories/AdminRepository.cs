using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class AdminRepository : Repository<Admin>, IAdminRepository
{
    public AdminRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Admin> GetAdminWithUserAsync(int adminId)
    {
        return await _context.Admins
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == adminId);
    }

    public async Task<Admin> GetAdminByUserIdAsync(int userId)
    {
        return await _context.Admins
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == userId);
    }

    public async Task<IEnumerable<Admin>> GetAllAdminsAsync()
    {
        return await _context.Admins
            .Include(a => a.User)
            .ToListAsync();
    }
}