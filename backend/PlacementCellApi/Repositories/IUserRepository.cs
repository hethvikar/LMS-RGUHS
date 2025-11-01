using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
    Task<bool> IsEmailUniqueAsync(string email, int? excludeUserId = null);
    Task<User> GetUserWithDetailsAsync(int id);
}