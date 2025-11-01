import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UploadResponse {
  success: boolean;
  message: string;
  fileName?: string;
  filePath?: string;
  size?: number;
}

export interface UploadProgress {
  type: HttpEventType;
  percent?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private readonly API_URL = 'https://localhost:44353/api/Resume'; // Backend API URL

  constructor(private http: HttpClient) { }

  /**
   * Upload resume file to the server
   * @param file - The resume file to upload
   * @returns Observable of upload response
   */
  uploadResume(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(
      `${this.API_URL}/upload`,
      formData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Upload resume with progress tracking
   * @param file - The resume file to upload
   * @returns Observable of upload progress events
   */
  uploadResumeWithProgress(file: File): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.API_URL}/upload`,
      formData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    ).pipe(
      map((event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          return { type: HttpEventType.UploadProgress, percent };
        }
        if (event.type === HttpEventType.Response) {
          return { type: HttpEventType.Response };
        }
        return { type: event.type };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get resume file for the current user
   * @returns Observable of resume file blob
   */
  getResume(): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/download`,
      { responseType: 'blob' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete resume file for the current user
   * @returns Observable of deletion response
   */
  deleteResume(): Observable<UploadResponse> {
    return this.http.delete<UploadResponse>(
      `${this.API_URL}/delete`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get resume metadata (file name, upload date, size)
   * @returns Observable of resume metadata
   */
  getResumeMetadata(): Observable<any> {
    return this.http.get(
      `${this.API_URL}/metadata`
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during file upload';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid file. Please ensure it is a PDF or Word document.';
          break;
        case 401:
          errorMessage = 'You must be logged in to upload a resume.';
          break;
        case 403:
          errorMessage = 'You do not have permission to upload a resume.';
          break;
        case 404:
          errorMessage = 'Upload endpoint not found.';
          break;
        case 413:
          errorMessage = 'File is too large. Maximum size is 5MB.';
          break;
        case 415:
          errorMessage = 'Unsupported file type. Only PDF and Word documents are allowed.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
    }

    console.error('ResumeService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}