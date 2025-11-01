import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { environment } from '../../../environments/environment';
import OpenAI from 'openai';
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

export interface ExtractedProfileData {
  // Personal Information
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  location?: string;
  linkedInProfile?: string;

  // Academic Information
  enrollmentNumber?: string;
  course?: string;
  branch?: string;
  yearOfStudy?: string;
  cgpa?: string;

  // Employment History
  employmentHistory?: EmploymentData[];

  // Education
  education?: EducationData[];

  // Certifications
  certifications?: CertificationData[];

  // Skills
  skills?: string[];
}

export interface EmploymentData {
  currentCompany?: string;
  jobTitle?: string;
  experienceYears?: number;
  experienceMonths?: number;
  currentCTC?: string;
  noticePeriod?: string;
}

export interface EducationData {
  university?: string;
  degree?: string;
  specialization?: string;
  completedYear?: string;
  percentage?: number;
  location?: string;
}

export interface CertificationData {
  certificateName?: string;
  certificateValidTill?: string;
  providerName?: string;
}

export interface ExtractionResponse {
  success: boolean;
  message: string;
  extractedData?: ExtractedProfileData;
  confidence?: number; // 0-100, how confident the AI is in the extraction
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private readonly API_URL = 'https://localhost:44353/api/Resume'; // Backend API URL

  constructor(private http: HttpClient) {
    // Configure PDF.js worker to use local worker from assets
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';
    }
  }

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

  /**
   * Extract text from PDF file
   * @param file - The PDF file to extract text from
   * @returns Promise with extracted text
   */
  async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  }

  /**
   * Extract text from Word document
   * @param file - The Word file to extract text from
   * @returns Promise with extracted text
   */
  async extractTextFromWord(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  /**
   * Extract text from resume file (PDF or Word)
   * @param file - The resume file to extract text from
   * @returns Promise with extracted text
   */
  async extractTextFromResume(file: File): Promise<string> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return this.extractTextFromPDF(file);
    } else if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx')
    ) {
      return this.extractTextFromWord(file);
    } else {
      throw new Error('Unsupported file type. Only PDF and Word documents are supported.');
    }
  }

  /**
   * Extract profile data from resume text using AI analysis
   * @param resumeText - The extracted text from the resume
   * @returns Observable of extraction response with parsed profile data
   */
// Uncomment the following import if you have installed the openai npm package
// import OpenAI from 'openai';

// Uncomment the following import if you have installed the openai npm package
// import OpenAI from 'openai';

async extractProfileDataFromText(resumeText: string): Promise<ExtractionResponse> {
  // Prefer Angular environment config; fall back to process.env or globalThis if available
  const apiKey =
    (environment as any)?.openAiApiKey ??
    (typeof process !== 'undefined' ? (process.env as any)['OPENAI_API_KEY'] : undefined) ??
    (globalThis as any)?.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      message: 'OpenAI API key not configured. Set it in environment.ts as openAiApiKey or in process/global env.'
    };
  }

  const openai = new OpenAI({ apiKey });

  const prompt = `
    You are a resume parser AI. Extract the following details as JSON:
    {
      "firstName": "",
      
      "email": "",
      "phone": "",
      "location": "",
      "skills": [],
      "education": [],
      "experience": [],
      "projects": [],
      "certifications": []
    }
    Resume Text:
    ${resumeText}
  `;

  try {
    const completion: any = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Extract structured resume data and return JSON only." },
        { role: "user", content: resumeText }],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const rawOutput: string = completion?.choices?.[0]?.message?.content ?? '';

    debugger;
    let structuredData: any;
    try {
      structuredData = JSON.parse(rawOutput);
    } catch {
      structuredData = { raw: rawOutput };
    }

    const extraction: ExtractionResponse = {
      success: true,
      message: 'Extraction successful',
      extractedData: structuredData as ExtractedProfileData,
      confidence: 75
    };

    return extraction;
  } catch (err: unknown) {
    console.error('Failed to extract resume data', err);
    return {
      success: false,
      message: 'Failed to extract resume data'
    };
  }
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

  private handleExtractionError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during data extraction';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request for data extraction.';
          break;
        case 401:
          errorMessage = 'You must be logged in to extract data.';
          break;
        case 403:
          errorMessage = 'You do not have permission to extract data.';
          break;
        case 404:
          errorMessage = 'Resume file not found for extraction.';
          break;
        case 415:
          errorMessage = 'Unsupported file format for extraction.';
          break;
        case 422:
          errorMessage = 'Unable to extract data from the resume. Please fill manually.';
          break;
        case 500:
          errorMessage = 'Server error during extraction. Please try again later.';
          break;
        default:
          errorMessage = `Extraction error: ${error.message}`;
      }
    }

    console.error('ResumeService Extraction Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}