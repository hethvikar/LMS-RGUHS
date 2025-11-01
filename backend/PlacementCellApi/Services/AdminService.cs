using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;

    public AdminService(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    public async Task<Admin> GetAdminProfileAsync(int adminId)
    {
        return await _adminRepository.GetAdminWithUserAsync(adminId);
    }

    public async Task<Admin> CreateAdminProfileAsync(Admin admin)
    {
        return await _adminRepository.AddAsync(admin);
    }

    public async Task UpdateAdminProfileAsync(Admin admin)
    {
        await _adminRepository.UpdateAsync(admin);
    }

    public async Task<Admin> GetAdminByUserIdAsync(int userId)
    {
        return await _adminRepository.GetAdminByUserIdAsync(userId);
    }

    public async Task<IEnumerable<Admin>> GetAllAdminsAsync()
    {
        return await _adminRepository.GetAllAdminsAsync();
    }

    public async Task<bool> IsUserAdminAsync(int userId)
    {
        var admin = await _adminRepository.GetAdminByUserIdAsync(userId);
        return admin != null;
    }
}