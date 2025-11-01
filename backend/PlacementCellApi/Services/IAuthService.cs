using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IAuthService
{
    Task<(bool Success, string Token, string Message, User user)> LoginAsync(string email, string password);
    Task<(bool Success, string Message)> RegisterAsync(User user, string password);
    Task<User> GetCurrentUserAsync(int userId);
    Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
    string GenerateJwtToken(User user);
}