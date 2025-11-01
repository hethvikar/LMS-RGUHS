using Microsoft.EntityFrameworkCore;
using PlacementCellApi.Data;
using PlacementCellApi.Models;

namespace PlacementCellApi.Repositories;

public class DocumentRepository : Repository<Document>, IDocumentRepository
{
    public DocumentRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Document>> GetDocumentsByUserAsync(int userId)
    {
        return await _context.Documents
            .Include(d => d.User)
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.UploadDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Document>> GetDocumentsByTypeAsync(string documentType)
    {
        return await _context.Documents
            .Include(d => d.User)
            .Where(d => d.DocumentType == documentType)
            .OrderByDescending(d => d.UploadDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Document>> GetPendingVerificationDocumentsAsync()
    {
        return await _context.Documents
            .Include(d => d.User)
            .Where(d => d.VerificationStatus == "Pending")
            .OrderBy(d => d.UploadDate)
            .ToListAsync();
    }

    public async Task<Document> GetDocumentWithUserAsync(int documentId)
    {
        return await _context.Documents
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == documentId);
    }

    public async Task<IEnumerable<Document>> GetDocumentsByVerificationStatusAsync(string status)
    {
        return await _context.Documents
            .Include(d => d.User)
            .Where(d => d.VerificationStatus == status)
            .OrderByDescending(d => d.UploadDate)
            .ToListAsync();
    }
}