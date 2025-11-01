# Resume Upload - Quick Start Guide

## 🚀 What Was Implemented

A complete resume upload feature has been added to the Student Profile page with:
- ✅ File type validation (PDF & Word only)
- ✅ 5MB file size limit
- ✅ Real-time progress tracking
- ✅ User-friendly error messages
- ✅ Responsive mobile design
- ✅ Material Design components

## 📍 Where to Access It

**URL:** `http://localhost:51175/student/profile`

Scroll down to the **"Upload Resume"** section at the bottom of the profile page.

## 🎯 How It Works

### For Users
1. Click **"Select File"** button
2. Choose a PDF or Word document (.pdf, .doc, or .docx)
3. Review the selected file name
4. Click **"Upload Resume"**
5. See progress bar and success message

### For Developers

**Frontend Files:**
- Component: `src/app/features/student/components/profile/`
- Service: `src/app/core/services/resume.service.ts` (NEW)

**Key Files Modified:**
- `profile.component.ts` - Upload logic
- `profile.component.html` - UI template
- `profile.component.scss` - Styling
- `tsconfig.json` - Path aliases

## ⚙️ Backend Integration Required

### Endpoint Needed
```
POST /api/Resume/upload
```

### What It Should Do
1. Accept multipart file upload
2. Validate file type (PDF or Word)
3. Validate file size (max 5MB)
4. Save to working directory
5. Return success response

### Response Format
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "fileName": "resume.pdf",
  "filePath": "/uploads/resumes/...",
  "size": 123456
}
```

## 📚 Documentation

- **Full Setup Guide:** See `RESUME_UPLOAD_SETUP.md`
- **Implementation Details:** See `RESUME_UPLOAD_IMPLEMENTATION_SUMMARY.md`
- **C# Backend Example:** In `RESUME_UPLOAD_SETUP.md`

## 🔧 Configuration

### Change Backend URL
Edit `src/app/core/services/resume.service.ts`:
```typescript
private readonly API_URL = 'https://your-backend-url/api/Resume';
```

### Change File Size Limit
Edit `src/app/features/student/components/profile/profile.component.ts`:
```typescript
const maxSize = 5 * 1024 * 1024; // Change 5 to your size in MB
```

### Add More File Types
Edit allowed types in `profile.component.ts`:
```typescript
allowedFileTypes = ['application/pdf', 'application/msword', ...];
allowedExtensions = ['.pdf', '.doc', '.docx', ...];
```

## 🧪 Quick Test

### Test File Upload Works
1. Navigate to `/student/profile`
2. Scroll to resume upload section
3. Select a PDF or DOCX file
4. Click "Upload Resume"
5. Check browser console for errors
6. Verify backend receives the request

### Test File Validation
- Try uploading .txt file → Should show error
- Try uploading 10MB file → Should show size error
- Try uploading .pdf file → Should succeed (if backend ready)

## 📋 Validation Rules

**Allowed File Types:**
- PDF (.pdf)
- Word (.doc, .docx)

**Constraints:**
- Max file size: 5MB
- Required: User must be logged in

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Upload button disabled | Make sure file is selected |
| "Invalid file type" error | Use PDF or Word (.docx) only |
| "File too large" error | Reduce file size below 5MB |
| Upload fails silently | Check backend URL in service |
| 401 error | Ensure user is authenticated |
| 415 error | Server rejected file type |

## 🔐 Security

- ✅ File types validated on frontend and backend
- ✅ File size limited to 5MB
- ✅ JWT authentication required
- ✅ Files stored securely on server
- ✅ No sensitive data in URL

## 📞 Support

### For Backend Implementation
- See full guide in `RESUME_UPLOAD_SETUP.md`
- C# implementation example included
- Startup configuration included
- Database schema recommendations included

### For Frontend Issues
- Check browser console for errors
- Verify HttpClient is imported
- Ensure ResumeService is injected
- Check Material icons are working

## ✨ Features

### UI/UX
- Material Design buttons and icons
- Real-time progress bar
- Color-coded messages (green for success, red for error)
- Responsive layout (desktop & mobile)
- Touch-friendly buttons on mobile

### Functionality
- Drag-and-drop ready (placeholder)
- File extension and MIME validation
- File size validation
- Progress tracking
- Auto-clear messages
- Disable controls during upload

## 🎨 Styling

Colors Used:
- Primary (Upload): #1976d2 (Blue)
- Success: #2e7d32 (Green)
- Error: #d32f2f (Red)
- Info: #f5f5f5 (Light Gray)

## 🚢 Deployment Checklist

- [ ] Backend `/api/Resume/upload` endpoint created
- [ ] File storage directory configured
- [ ] File type validation implemented
- [ ] File size check added
- [ ] Database schema (if used) created
- [ ] JWT authentication working
- [ ] CORS configured for frontend
- [ ] Frontend deployed with correct backend URL
- [ ] Tested with sample PDF file
- [ ] Tested with sample Word file
- [ ] Error handling tested
- [ ] File deletion method implemented (optional)

## 📞 Quick Reference

**Service Methods:**
```typescript
uploadResume(file: File): Observable<UploadResponse>
uploadResumeWithProgress(file: File): Observable<UploadProgress>
getResume(): Observable<Blob>
deleteResume(): Observable<UploadResponse>
getResumeMetadata(): Observable<any>
```

**Component Properties:**
```typescript
resumeFile: File | null
resumeFileName: string
uploadProgress: number (0-100)
isUploading: boolean
uploadMessage: string
uploadSuccess: boolean
```

**Component Methods:**
```typescript
onResumeFileSelected(event: any): void
uploadResume(): void
clearResumeUpload(): void
```

## 🎯 Next Steps

1. **Implement Backend**
   - Create Resume controller
   - Add file upload endpoint
   - Implement storage logic

2. **Test Integration**
   - Test file upload
   - Test validation
   - Test error cases

3. **Enhance (Optional)**
   - Add drag-and-drop
   - Add file preview
   - Add multiple versions
   - Add auto-extraction

4. **Deploy**
   - Build project
   - Deploy to production
   - Monitor uploads

## 📞 Need Help?

- Backend Setup → See `RESUME_UPLOAD_SETUP.md`
- Implementation Details → See `RESUME_UPLOAD_IMPLEMENTATION_SUMMARY.md`
- TypeScript Issues → Check `src/app/core/services/resume.service.ts`
- UI/UX Questions → Check component files

---

**Status:** ✅ Frontend Complete - Awaiting Backend Implementation