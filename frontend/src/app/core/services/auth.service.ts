import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { User } from '../store/auth/auth.reducer';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor' | 'company';
  agreeToTerms: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:44353/api/Auth'; // Backend API URL
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    const user = this.getUser();

    if (token && user) {
      // Check if token is still valid
      if (this.isTokenExpired(token)) {
        this.logout();
      } else {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  login(credentials: LoginRequest): Observable<{ success: boolean; data?: User; token?: string; message?: string }> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        map(response => ({
          success: true,
          data: response.user,
          token: response.token,
          message: 'Login successful'
        })),
        tap(response => {
          if (response.success && response.data && response.token) {
            this.setSession({
              user: response.data,
              token: response.token,
              expiresIn: 3600
            });
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => ({
            success: false,
            message: error.message || 'Login failed'
          }));
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Call logout endpoint to invalidate server-side token
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.API_URL}/logout`, {}).subscribe();
    }

    // Clear local storage
    this.clearSession();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email })
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, newPassword })
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-email`, { token })
      .pipe(
        catchError(this.handleError)
      );
  }

  private setSession(authResult: AuthResponse): void {
    // Normalize role casing to avoid routing/guard mismatches
    const normalizedUser: User = {
      ...authResult.user,
      role: String(authResult.user?.role || '').toLowerCase() as User['role']
    } as User;

    // Store token and user; avoid storing a local expires timestamp — rely on JWT 'exp' claim when available
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(normalizedUser));

    if (authResult.user) {
      // Persist real refresh token when backend provides it
      // Keeping a placeholder will cause refresh attempts to fail; so don't set it unless provided
      // localStorage.setItem(this.REFRESH_TOKEN_KEY, realRefreshToken)
    }

    this.currentUserSubject.next(normalizedUser);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);


    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      // Decode JWT payload and check 'exp' claim (seconds since epoch)
      const parts = token.split('.');
      if (parts.length < 2) return true;
      const payload = parts[1];
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      if (json && json.exp) {
        const expMs = json.exp * 1000;
        return Date.now() > expMs;
      }
      // If no exp claim is present, assume token is valid
      return false;
    } catch (e) {
      return true;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Invalid credentials. Please try again.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Service not found.';
          break;
        case 409:
          errorMessage = 'User already exists with this email.';
          break;
        case 422:
          errorMessage = 'Validation failed. Please check your input.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
    }

    console.error('AuthService Error:', error);
    return throwError(errorMessage);
  }

  // Mock methods for development (remove in production)
  mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const mockUser: User = {
          id: 1,
          name: 'John Doe',
          email: credentials.email,
          role: 'admin', // Change based on email for testing
          avatar: '',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser,
          expiresIn: 3600 // 1 hour
        };

        this.setSession(mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  mockRegister(userData: RegisterRequest): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ message: 'Registration successful' });
        observer.complete();
      }, 1000);
    });
  }
}
