using PlacementCellApi.Models;
using PlacementCellApi.Repositories;

namespace PlacementCellApi.Services;

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;

    public DocumentService(IDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<Document> GetDocumentByIdAsync(int id)
    {
        return await _documentRepository.GetDocumentWithUserAsync(id);
    }

    public async Task<IEnumerable<Document>> GetDocumentsByUserAsync(int userId)
    {
        return await _documentRepository.GetDocumentsByUserAsync(userId);
    }

    public async Task<IEnumerable<Document>> GetDocumentsByTypeAsync(string documentType)
    {
        return await _documentRepository.GetDocumentsByTypeAsync(documentType);
    }

    public async Task<Document> UploadDocumentAsync(Document document)
    {
        document.UploadDate = DateTime.UtcNow;
        return await _documentRepository.AddAsync(document);
    }

    public async Task UpdateDocumentAsync(Document document)
    {
        await _documentRepository.UpdateAsync(document);
    }

    public async Task DeleteDocumentAsync(int id)
    {
        var document = await _documentRepository.GetByIdAsync(id);
        if (document != null)
        {
            await _documentRepository.DeleteAsync(document);
        }
    }

    public async Task VerifyDocumentAsync(int documentId, int adminId, string status)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);
        if (document != null)
        {
            document.VerificationStatus = status;
            document.VerifiedBy = adminId;
            document.VerifiedDate = DateTime.UtcNow;
            await _documentRepository.UpdateAsync(document);
        }
    }

    public async Task<IEnumerable<Document>> GetPendingVerificationDocumentsAsync()
    {
        return await _documentRepository.GetPendingVerificationDocumentsAsync();
    }

    public async Task<IEnumerable<Document>> GetDocumentsByVerificationStatusAsync(string status)
    {
        return await _documentRepository.GetDocumentsByVerificationStatusAsync(status);
    }
}