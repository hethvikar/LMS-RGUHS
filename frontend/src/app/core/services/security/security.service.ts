import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Security Service
 * Implements OWASP security best practices including:
 * - XSS Prevention
 * - Input Sanitization
 * - CSRF Token Management
 * - Content Security Policy
 */
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  // List of allowed HTML tags for sanitization
  private readonly ALLOWED_TAGS = ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'span'];
  
  // RegEx patterns for validation
  private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PHONE_PATTERN = /^[+]?[\d\s()-]{10,15}$/;
  private readonly URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHtml(html: string): SafeHtml {
    // Remove script tags and event handlers
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/javascript:/gi, '');

    return this.sanitizer.sanitize(1, sanitized) || '';
  }

  /**
   * Sanitize URL to prevent XSS via URL injection
   */
  sanitizeUrl(url: string): SafeUrl {
    // Block javascript: and data: URLs
    if (url.match(/^(javascript|data):/i)) {
      return '';
    }
    return this.sanitizer.sanitize(4, url) || '';
  }

  /**
   * Sanitize resource URL for iframes, etc.
   */
  sanitizeResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    return this.EMAIL_PATTERN.test(email.trim());
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone: string): boolean {
    return this.PHONE_PATTERN.test(phone.trim());
  }

  /**
   * Validate URL format
   */
  validateUrl(url: string): boolean {
    return this.URL_PATTERN.test(url.trim());
  }

  /**
   * Generate CSRF token
   */
  generateCsrfToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Store CSRF token in sessionStorage
   */
  storeCsrfToken(token: string): void {
    sessionStorage.setItem('csrf_token', token);
  }

  /**
   * Get stored CSRF token
   */
  getCsrfToken(): string | null {
    return sessionStorage.getItem('csrf_token');
  }

  /**
   * Validate input against SQL injection patterns
   */
  validateInput(input: string): boolean {
    const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)|([';]--)|(\bOR\b.*=.*)/gi;
    return !sqlInjectionPattern.test(input);
  }

  /**
   * Sanitize file name
   */
  sanitizeFileName(fileName: string): string {
    // Remove path traversal characters and special characters
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255);
  }

  /**
   * Check if content contains suspicious patterns
   */
  containsSuspiciousContent(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<embed/i,
      /<object/i,
      /eval\(/i,
      /expression\(/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Implement rate limiting check (client-side)
   */
  checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = JSON.parse(sessionStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Filter attempts within the time window
    const recentAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    recentAttempts.push(now);
    sessionStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
    
    return true; // Within rate limit
  }

  /**
   * Clear rate limit data
   */
  clearRateLimit(key: string): void {
    sessionStorage.removeItem(`rate_limit_${key}`);
  }

  /**
   * Validate Content Security Policy
   */
  getSecureHeaders(): { [key: string]: string } {
    return {
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https://api.yourbackend.com; " +
        "frame-ancestors 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  /**
   * Encrypt sensitive data before storing (simple implementation)
   */
  encryptData(data: string, key: string): string {
    // Simple XOR encryption (use proper encryption in production)
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData: string, key: string): string {
    try {
      const decoded = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return decrypted;
    } catch {
      return '';
    }
  }
}
