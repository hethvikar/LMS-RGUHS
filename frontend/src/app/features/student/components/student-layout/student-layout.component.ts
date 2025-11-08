import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-layout',
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
          <mat-icon>person</mat-icon>
          <h2>Student Portal</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/student/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <a mat-list-item routerLink="/student/jobs" routerLinkActive="active">
            <mat-icon matListItemIcon>work_outline</mat-icon>
            <span matListItemTitle>Jobs</span>
          </a>
          
          <a mat-list-item routerLink="/student/profile" routerLinkActive="active">
            <mat-icon matListItemIcon>account_circle</mat-icon>
            <span matListItemTitle>Profile</span>
          </a>
          
          <a mat-list-item routerLink="/student/applications" routerLinkActive="active">
            <mat-icon matListItemIcon>work</mat-icon>
            <span matListItemTitle>Applications</span>
          </a>
          
          <a mat-list-item routerLink="/student/interviews" routerLinkActive="active">
            <mat-icon matListItemIcon>video_call</mat-icon>
            <span matListItemTitle>Interviews</span>
          </a>
          
          <a mat-list-item routerLink="/student/liveinterview" routerLinkActive="active">
            <mat-icon matListItemIcon>video_call</mat-icon>
            <span matListItemTitle>Live Interviews</span>
          </a>

          <a mat-list-item routerLink="/student/placement-status" routerLinkActive="active">
            <mat-icon matListItemIcon>verified</mat-icon>
            <span matListItemTitle>Placement Status</span>
          </a>

          <!-- Learning Section -->
          <div class="nav-section-header">
            <mat-icon>school</mat-icon>
            <span>Learning</span>
          </div>
          
          <a mat-list-item routerLink="/student/courses" routerLinkActive="active">
            <mat-icon matListItemIcon>library_books</mat-icon>
            <span matListItemTitle>Search Courses</span>
          </a>
          
          <a mat-list-item routerLink="/student/assignments" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Assignments</span>
          </a>
          
          <a mat-list-item routerLink="/student/training-attendance" routerLinkActive="active">
            <mat-icon matListItemIcon>event_available</mat-icon>
            <span matListItemTitle>Training Attendance</span>
          </a>
          
          <a mat-list-item routerLink="/student/assessments" routerLinkActive="active">
            <mat-icon matListItemIcon>edit_note</mat-icon>
            <span matListItemTitle>Take Assessment</span>
          </a>
          
          <a mat-list-item routerLink="/student/progress" routerLinkActive="active">
            <mat-icon matListItemIcon>trending_up</mat-icon>
            <span matListItemTitle>Progress</span>
          </a>
          
          <a mat-list-item routerLink="/student/results" routerLinkActive="active">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Results</span>
          </a>
          
          <a mat-list-item routerLink="/student/certifications" routerLinkActive="active">
            <mat-icon matListItemIcon>workspace_premium</mat-icon>
            <span matListItemTitle>Certifications</span>
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
      background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      padding: 0;
      overflow-x: hidden;
      overflow-y: auto;
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

      .nav-section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 16px 8px 16px;
        margin-top: 16px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);

        &:first-of-type {
          margin-top: 8px;
          border-top: none;
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .sidenav-content {
      padding: 0;
      background: #f5f5f5;
      overflow-x: hidden;
      overflow-y: auto;
    }

    ::ng-deep .mat-drawer-inner-container {
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }

    ::ng-deep .mat-sidenav-container {
      overflow: hidden !important;
    }
  `]
})
export class StudentLayoutComponent {}
