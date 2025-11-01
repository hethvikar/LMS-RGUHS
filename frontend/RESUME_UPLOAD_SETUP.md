# Resume Upload Feature - Setup Guide

## Overview
The resume upload feature has been added to the Student Profile page. This guide explains how to set up the backend to handle resume file uploads.

## Frontend Implementation Details

### Files Modified
1. **profile.component.ts** - Added resume upload logic and file validation
2. **profile.component.html** - Added upload UI controls
3. **profile.component.scss** - Added styling for upload section
4. **resume.service.ts** (NEW) - Service for handling resume API calls

### Frontend Features
- **File Type Validation**: Only PDF (.pdf) and Word (.doc, .docx) files are accepted
- **File Size Validation**: Maximum 5MB file size limit
- **Upload Progress**: Real-time progress bar during upload
- **User Feedback**: Success/error messages displayed to user
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design**: Integrated with Angular Material components

### Allowed File Types
- `application/pdf` (.pdf)
- `application/msword` (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)

## Backend Implementation

### Required Endpoint
**POST** `/api/Resume/upload`

### Request Format
```
Content-Type: multipart/form-data
Authorization: Bearer [JWT Token]

Body:
{
  "file": [File object from multipart form]
}
```

### Response Format (Success - 200 OK)
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "fileName": "john_doe_resume.pdf",
  "filePath": "/uploads/resumes/user_123/john_doe_resume.pdf",
  "size": 245632
}
```

### Response Format (Error)
Various HTTP status codes with error messages:
- **400** - Invalid file (not PDF or Word)
- **401** - User not authenticated
- **403** - User not authorized
- **413** - File too large (>5MB)
- **415** - Unsupported file type

## Backend Setup Instructions

### C# / .NET Implementation Example

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IO;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResumeController : ControllerBase
{
    private readonly string _uploadDirectory = "Uploads/Resumes";
    private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB
    private readonly string[] _allowedExtensions = { ".pdf", ".doc", ".docx" };

    [HttpPost("upload")]
    public async Task<IActionResult> UploadResume(IFormFile file)
    {
        try
        {
            // Validate file
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file provided" });

            // Check file size
            if (file.Length > _maxFileSize)
                return StatusCode(413, new { 
                    success = false, 
                    message = "File too large. Maximum size is 5MB" 
                });

            // Check file extension
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            if (!_allowedExtensions.Contains(fileExtension))
                return StatusCode(415, new { 
                    success = false, 
                    message = "Unsupported file type. Only PDF and Word documents are allowed" 
                });

            // Get current user ID (from JWT token)
            var userId = User.FindFirst("sub")?.Value; // Adjust claim name as needed

            // Create user-specific directory
            var userDirectory = Path.Combine(_uploadDirectory, userId);
            Directory.CreateDirectory(userDirectory);

            // Generate unique filename
            var fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{DateTime.Now:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(userDirectory, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return success response
            return Ok(new
            {
                success = true,
                message = "Resume uploaded successfully",
                fileName = fileName,
                filePath = $"/uploads/resumes/{userId}/{fileName}",
                size = file.Length
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false, 
                message = "Server error during upload",
                error = ex.Message 
            });
        }
    }

    [HttpGet("download")]
    public async Task<IActionResult> DownloadResume()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            var userDirectory = Path.Combine(_uploadDirectory, userId);

            if (!Directory.Exists(userDirectory))
                return NotFound(new { success = false, message = "No resume found" });

            var files = Directory.GetFiles(userDirectory, "*.*");
            if (files.Length == 0)
                return NotFound(new { success = false, message = "No resume found" });

            // Get most recent file
            var latestFile = new DirectoryInfo(userDirectory)
                .GetFiles()
                .OrderByDescending(f => f.CreationTime)
                .First();

            var fileBytes = System.IO.File.ReadAllBytes(latestFile.FullName);
            return File(fileBytes, "application/octet-stream", latestFile.Name);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false, 
                message = "Error downloading resume",
                error = ex.Message 
            });
        }
    }

    [HttpDelete("delete")]
    public IActionResult DeleteResume()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            var userDirectory = Path.Combine(_uploadDirectory, userId);

            if (!Directory.Exists(userDirectory))
                return NotFound(new { success = false, message = "No resume found" });

            Directory.Delete(userDirectory, true);
            return Ok(new { success = true, message = "Resume deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false, 
                message = "Error deleting resume",
                error = ex.Message 
            });
        }
    }

    [HttpGet("metadata")]
    public IActionResult GetResumeMetadata()
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            var userDirectory = Path.Combine(_uploadDirectory, userId);

            if (!Directory.Exists(userDirectory))
                return NotFound(new { success = false, message = "No resume found" });

            var files = Directory.GetFiles(userDirectory, "*.*");
            if (files.Length == 0)
                return NotFound(new { success = false, message = "No resume found" });

            var latestFile = new DirectoryInfo(userDirectory)
                .GetFiles()
                .OrderByDescending(f => f.CreationTime)
                .First();

            return Ok(new
            {
                success = true,
                fileName = latestFile.Name,
                fileSize = latestFile.Length,
                uploadedDate = latestFile.CreationTime
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                success = false, 
                message = "Error retrieving metadata",
                error = ex.Message 
            });
        }
    }
}
```

### Startup Configuration (Program.cs or Startup.cs)

```csharp
// Add this in Program.cs or ConfigureServices

// Enable multipart form data
services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 5242880; // 5MB
});

// Ensure uploads directory exists
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Resumes");
Directory.CreateDirectory(uploadsPath);
```

### Additional Backend Considerations

1. **Database Storage** (Optional): Consider storing resume metadata in database:
   - User ID
   - File name
   - Upload date
   - File size
   - File path

2. **Virus Scanning**: Implement virus scanning for uploaded files:
   - Use ClamAV or Windows Defender API
   - Scan before saving to disk

3. **File Retention Policy**: 
   - Delete old resumes automatically
   - Keep only the latest 3 versions
   - Implement cleanup tasks

4. **Logging**:
   - Log all upload attempts
   - Track file sizes and types
   - Monitor for abuse

5. **Security**:
   - Validate file contents (magic bytes)
   - Store files outside web root
   - Implement rate limiting
   - Use secure file names

## API URL Configuration

The frontend currently points to:
```
https://localhost:44353/api/Resume
```

If your backend is on a different URL, update the `ResumeService`:
```typescript
private readonly API_URL = 'https://your-backend-url/api/Resume';
```

## Testing

### Manual Testing Steps
1. Navigate to `/student/profile`
2. Scroll to "Upload Resume" section
3. Click "Select File" button
4. Choose a PDF or Word document
5. Click "Upload Resume"
6. Verify success/error message

### Automated Testing
```typescript
// Example test case
it('should upload resume file', () => {
  const mockFile = new File(['test content'], 'resume.pdf', { type: 'application/pdf' });
  component.onResumeFileSelected({ target: { files: [mockFile] } });
  expect(component.resumeFile).toBe(mockFile);
  expect(component.uploadSuccess).toBe(true);
});
```

## Troubleshooting

### Common Issues

**File upload fails with 400 error**
- Check that file is in supported format (PDF or Word)
- Verify file size is under 5MB
- Ensure file is not corrupted

**File upload fails with 401 error**
- User is not authenticated
- Check JWT token validity
- Verify user is logged in

**File upload fails with 413 error**
- File size exceeds 5MB limit
- Reduce file size or compress

**Progress bar not showing**
- Ensure backend supports chunked transfer encoding
- Check browser console for errors
- Verify HttpClient interceptors aren't blocking progress events

## Future Enhancements

1. **Drag and Drop**: Add drag-and-drop file upload
2. **Multiple Resumes**: Allow storing multiple resume versions
3. **Resume Preview**: Display PDF/Word preview before upload
4. **Automatic Extraction**: Extract resume data (name, email, skills)
5. **Version Control**: Track resume versions with timestamps
6. **Integration**: Link resume to job applications

## Support

For issues or questions, refer to the Angular Material documentation or contact the development team.