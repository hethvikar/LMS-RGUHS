using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlacementCellApi.Models;
using PlacementCellApi.Services;

namespace PlacementCellApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDocument(int id)
    {
        var document = await _documentService.GetDocumentByIdAsync(id);
        if (document == null)
            return NotFound(new { success = false, message = "Document not found" });

        return Ok(new { success = true, data = document });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetDocumentsByUser(int userId)
    {
        var documents = await _documentService.GetDocumentsByUserAsync(userId);
        return Ok(new { success = true, data = documents });
    }

    [HttpGet("type/{documentType}")]
    public async Task<IActionResult> GetDocumentsByType(string documentType)
    {
        var documents = await _documentService.GetDocumentsByTypeAsync(documentType);
        return Ok(new { success = true, data = documents });
    }

    [HttpPost]
    public async Task<IActionResult> UploadDocument([FromBody] Document document)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid document data" });

        var uploadedDocument = await _documentService.UploadDocumentAsync(document);
        return CreatedAtAction(nameof(GetDocument), new { id = uploadedDocument.Id },
            new { success = true, data = uploadedDocument, message = "Document uploaded successfully" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDocument(int id, [FromBody] Document document)
    {
        if (id != document.Id)
            return BadRequest(new { success = false, message = "Document ID mismatch" });

        var existingDocument = await _documentService.GetDocumentByIdAsync(id);
        if (existingDocument == null)
            return NotFound(new { success = false, message = "Document not found" });

        await _documentService.UpdateDocumentAsync(document);
        return Ok(new { success = true, message = "Document updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDocument(int id)
    {
        var document = await _documentService.GetDocumentByIdAsync(id);
        if (document == null)
            return NotFound(new { success = false, message = "Document not found" });

        await _documentService.DeleteDocumentAsync(id);
        return Ok(new { success = true, message = "Document deleted successfully" });
    }

    [HttpPut("{id}/verify")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> VerifyDocument(int id, [FromBody] VerificationRequest request)
    {
        // Get admin ID from JWT token
        var adminIdClaim = User.FindFirst("sub");
        if (adminIdClaim == null || !int.TryParse(adminIdClaim.Value, out int adminId))
            return Unauthorized();

        await _documentService.VerifyDocumentAsync(id, adminId, request.Status);
        return Ok(new { success = true, message = "Document verification updated successfully" });
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPendingVerificationDocuments()
    {
        var documents = await _documentService.GetPendingVerificationDocumentsAsync();
        return Ok(new { success = true, data = documents });
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetDocumentsByVerificationStatus(string status)
    {
        var documents = await _documentService.GetDocumentsByVerificationStatusAsync(status);
        return Ok(new { success = true, data = documents });
    }
}

public class VerificationRequest
{
    public string Status { get; set; } // "Verified", "Rejected"
}