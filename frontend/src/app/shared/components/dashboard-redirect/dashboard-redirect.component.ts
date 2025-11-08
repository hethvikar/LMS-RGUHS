import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: `<div>Redirecting...</div>`
})
export class DashboardRedirectComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const authCheck = this.authService.isAuthenticatedWithValidRole();
    
    if (authCheck.isValid && authCheck.user && authCheck.shouldRedirect) {
      // User is authenticated, redirect based on role
      this.redirectBasedOnRole(authCheck.user.role);
    } else {
      // User is not authenticated or has invalid role, redirect to home
      this.router.navigate(['/']);
    }
  }

  private redirectBasedOnRole(role: string): void {
    const r = String(role || '').toLowerCase();
    switch (r) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'instructor':
        this.router.navigate(['/lms']);
        break;
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'company':
        this.router.navigate(['/company']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}