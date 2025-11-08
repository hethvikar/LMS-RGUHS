import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import * as fromAuth from '../../../core/store/auth/auth.reducer';
import { AppState } from '../../../core/store';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student' | 'company';
  avatar?: string;
}

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
  children?: NavigationItem[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatDividerModule,
    MatTooltipModule,
    BreadcrumbComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;

  sidenavOpen = false;
  isMobile = false;
  unreadNotifications = 3;

  notifications = [
    {
      id: 1,
      type: 'info',
      title: 'New Course Available',
      message: 'Advanced JavaScript Concepts is now available',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Assignment Due Soon',
      message: 'UI/UX Project due in 2 days',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Assessment Completed',
      message: 'You scored 85% on JavaScript Quiz',
      time: '3 days ago'
    }
  ];

  navigationItems: NavigationItem[] = [
  ];

  constructor(private router: Router, private store: Store<AppState>, private dialog: MatDialog) {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    this.currentUser$ = this.store.select(fromAuth.selectUser);
  }

  ngOnInit() {
    // Subscribe to current user from store
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSidenav();
      });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  getHeaderClass(): string {
    const currentRoute = this.router.url;
    if (currentRoute.startsWith('/admin')) return 'admin';
    if (currentRoute.startsWith('/company')) return 'company';
    if (currentRoute.startsWith('/lms')) return 'lms';
    return '';
  }

  getVisibleNavigation(): NavigationItem[] {
    if (!this.currentUser) return [];
    return this.navigationItems.filter(item =>
      item.roles.includes(this.currentUser!.role)
    );
  }

  getRoleDisplayName(role?: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrator',
      'instructor': 'Instructor',
      'student': 'Student',
      'company': 'Company'
    };
    return roleMap[role || ''] || role || '';
  }

  getNotificationIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'info': 'info',
      'warning': 'warning',
      'success': 'check_circle',
      'error': 'error'
    };
    return iconMap[type] || 'info';
  }

  getNotificationIconClass(type: string): string {
    return type;
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  closeSidenav() {
    this.sidenavOpen = false;
  }

  getProfileRoute(): string {
    if (!this.currentUser) return '/profile';
    
    const roleRoutes: { [key: string]: string } = {
      'admin': '/admin/dashboard', // Admin doesn't have a profile page, redirect to dashboard
      'instructor': '/lms/dashboard', // Instructor uses LMS dashboard
      'student': '/student/profile',
      'company': '/company/profile'
    };
    
    return roleRoutes[this.currentUser.role] || '/profile';
  }

  isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }

  openChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '480px',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'change-password-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Password changed successfully');
      }
    });
  }

  logout() {
    // Dispatch logout action to clear auth state and session
    this.store.dispatch(AuthActions.logout());
  }
}
