using PlacementCellApi.Models;

namespace PlacementCellApi.Services;

public interface IDocumentService
{
    Task<Document> GetDocumentByIdAsync(int id);
    Task<IEnumerable<Document>> GetDocumentsByUserAsync(int userId);
    Task<IEnumerable<Document>> GetDocumentsByTypeAsync(string documentType);
    Task<Document> UploadDocumentAsync(Document document);
    Task UpdateDocumentAsync(Document document);
    Task DeleteDocumentAsync(int id);
    Task VerifyDocumentAsync(int documentId, int adminId, string status);
    Task<IEnumerable<Document>> GetPendingVerificationDocumentsAsync();
    Task<IEnumerable<Document>> GetDocumentsByVerificationStatusAsync(string status);
}