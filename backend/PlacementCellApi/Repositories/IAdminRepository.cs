using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IAdminRepository : IRepository<Admin>
{
    Task<Admin> GetAdminWithUserAsync(int adminId);
    Task<Admin> GetAdminByUserIdAsync(int userId);
    Task<IEnumerable<Admin>> GetAllAdminsAsync();
}