import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface VerificationResult {
  isValid: boolean;
  message?: string;
  details?: any;
}

export interface WebsiteVerificationResult extends VerificationResult {
  domain?: string;
  sslValid?: boolean;
  companyInfoFound?: boolean;
}

export interface GstVerificationResult extends VerificationResult {
  gstNumber?: string;
  stateCode?: string;
  panNumber?: string;
  registrationDate?: string;
}

export interface RegistrationVerificationResult extends VerificationResult {
  registrationNumber?: string;
  registrationDate?: string;
  companyType?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyVerificationService {

  constructor(private http: HttpClient) { }

  /**
   * Verify company website
   */
  verifyWebsite(url: string): Observable<WebsiteVerificationResult> {
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the verification

    return this.http.get<any>(`/api/company/verify-website?url=${encodeURIComponent(url)}`)
      .pipe(
        map(response => ({
          isValid: response.isValid,
          message: response.message,
          domain: response.domain,
          sslValid: response.sslValid,
          companyInfoFound: response.companyInfoFound
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Verify GST number
   */
  verifyGstNumber(gstNumber: string): Observable<GstVerificationResult> {
    // In a real implementation, this would call GST verification API
    // For demo purposes, we'll simulate the verification

    return this.http.post<any>('/api/company/verify-gst', { gstNumber })
      .pipe(
        map(response => ({
          isValid: response.isValid,
          message: response.message,
          gstNumber: response.gstNumber,
          stateCode: response.stateCode,
          panNumber: response.panNumber,
          registrationDate: response.registrationDate
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Verify company registration number
   */
  verifyRegistrationNumber(registrationNumber: string): Observable<RegistrationVerificationResult> {
    // In a real implementation, this would call company registration verification API
    // For demo purposes, we'll simulate the verification

    return this.http.post<any>('/api/company/verify-registration', { registrationNumber })
      .pipe(
        map(response => ({
          isValid: response.isValid,
          message: response.message,
          registrationNumber: response.registrationNumber,
          registrationDate: response.registrationDate,
          companyType: response.companyType,
          status: response.status
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Mock verification methods for demo purposes
   * Remove these in production and use the real API calls above
   */
  mockVerifyWebsite(url: string): Observable<WebsiteVerificationResult> {
    return of({
      isValid: true,
      message: 'Website verified successfully',
      domain: new URL(url).hostname,
      sslValid: true,
      companyInfoFound: true
    });
  }

  mockVerifyGstNumber(gstNumber: string): Observable<GstVerificationResult> {
    // Basic GST validation
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (gstPattern.test(gstNumber)) {
      return of({
        isValid: true,
        message: 'GST number verified successfully',
        gstNumber: gstNumber,
        stateCode: gstNumber.substring(0, 2),
        panNumber: gstNumber.substring(2, 12),
        registrationDate: '2020-01-15'
      });
    } else {
      return of({
        isValid: false,
        message: 'Invalid GST number format'
      });
    }
  }

  mockVerifyRegistrationNumber(registrationNumber: string): Observable<RegistrationVerificationResult> {
    // Basic registration number validation
    const regPattern = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

    if (regPattern.test(registrationNumber)) {
      return of({
        isValid: true,
        message: 'Registration number verified successfully',
        registrationNumber: registrationNumber,
        registrationDate: '2018-08-15',
        companyType: 'Private Limited Company',
        status: 'Active'
      });
    } else {
      return of({
        isValid: false,
        message: 'Invalid registration number format'
      });
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('Verification service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}