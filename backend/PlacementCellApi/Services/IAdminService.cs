using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IAdminService
{
    Task<Admin> GetAdminProfileAsync(int adminId);
    Task<Admin> CreateAdminProfileAsync(Admin admin);
    Task UpdateAdminProfileAsync(Admin admin);
    Task<Admin> GetAdminByUserIdAsync(int userId);
    Task<IEnumerable<Admin>> GetAllAdminsAsync();
    Task<bool> IsUserAdminAsync(int userId);
}