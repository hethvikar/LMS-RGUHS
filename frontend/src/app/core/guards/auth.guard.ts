import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): Observable<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return this.checkRoleAccess(url);
    }

    // Try to refresh token if available
    const token = this.authService.getToken();
    if (token) {
      return this.authService.refreshToken().pipe(
        map(() => this.checkRoleAccess(url)),
        catchError(() => {
          this.redirectToLogin(url);
          return of(false);
        })
      );
    }

    this.redirectToLogin(url);
    return false;
  }

  private checkRoleAccess(url: string): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.redirectToLogin(url);
      return false;
    }

    const role = String(user.role || '').toLowerCase();

    // Define role-based access control (case-insensitive keys)
    const rolePermissions: { [key: string]: string[] } = {
      admin: ['/admin', '/dashboard'],
      instructor: ['/lms', '/dashboard'],
      student: ['/student', '/lms', '/dashboard'],
      company: ['/company', '/dashboard']
    };

    const allowedPaths = rolePermissions[role] || [];

    // Check if the current URL matches any allowed path
    const hasAccess = allowedPaths.some(path => url.startsWith(path));

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      this.redirectToDashboard(role);
      return false;
    }

    return true;
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
      replaceUrl: true
    });
  }

  private redirectToDashboard(role: string): void {
    let dashboardUrl = '/dashboard';

    switch (String(role || '').toLowerCase()) {
      case 'admin':
        dashboardUrl = '/admin';
        break;
      case 'instructor':
      case 'student':
        dashboardUrl = '/lms';
        break;
      case 'company':
        dashboardUrl = '/company';
        break;
    }

    this.router.navigate([dashboardUrl]);
  }
}
