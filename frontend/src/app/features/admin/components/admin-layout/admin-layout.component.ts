import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidebar-header">
          <mat-icon>admin_panel_settings</mat-icon>
          <h2>Admin Portal</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <a mat-list-item routerLink="/admin/user-management" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>User Management</span>
          </a>
          
          <a mat-list-item routerLink="/admin/user-roles" routerLinkActive="active">
            <mat-icon matListItemIcon>security</mat-icon>
            <span matListItemTitle>User Roles</span>
          </a>
          
          <a mat-list-item routerLink="/admin/course-enrollment" routerLinkActive="active">
            <mat-icon matListItemIcon>school</mat-icon>
            <span matListItemTitle>Course Enrollment</span>
          </a>
          
          <a mat-list-item routerLink="/admin/assessment-assignment" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Assessment Assignment</span>
          </a>
          
          <a mat-list-item routerLink="/admin/company-verification" routerLinkActive="active">
            <mat-icon matListItemIcon>verified</mat-icon>
            <span matListItemTitle>Company Verification</span>
          </a>
          
          <a mat-list-item routerLink="/admin/candidate-search" routerLinkActive="active">
            <mat-icon matListItemIcon>manage_search</mat-icon>
            <span matListItemTitle>Candidate Search</span>
          </a>
          
          <a mat-list-item routerLink="/admin/request-tracker" routerLinkActive="active">
            <mat-icon matListItemIcon>track_changes</mat-icon>
            <span matListItemTitle>Request Tracker</span>
          </a>
          
          <a mat-list-item routerLink="/admin/user-activity" routerLinkActive="active">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>User Activity</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      width: 100%;
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 0;
    }

    .sidebar-header {
      padding: 24px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: white;
      }

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: white;
      }
    }

    mat-nav-list {
      padding-top: 16px;

      a {
        color: rgba(255, 255, 255, 0.8);
        margin: 4px 8px;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        &.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 500;

          mat-icon {
            color: white;
          }
        }

        mat-icon {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .sidenav-content {
      padding: 0;
      background: #f5f5f5;
      overflow-x: hidden;
    }

    ::ng-deep .mat-drawer-inner-container {
      overflow: visible !important;
    }
  `]
})
export class AdminLayoutComponent {}
