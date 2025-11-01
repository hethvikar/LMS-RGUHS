using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public interface IDocumentRepository : IRepository<Document>
{
    Task<IEnumerable<Document>> GetDocumentsByUserAsync(int userId);
    Task<IEnumerable<Document>> GetDocumentsByTypeAsync(string documentType);
    Task<IEnumerable<Document>> GetPendingVerificationDocumentsAsync();
    Task<Document> GetDocumentWithUserAsync(int documentId);
    Task<IEnumerable<Document>> GetDocumentsByVerificationStatusAsync(string status);
}