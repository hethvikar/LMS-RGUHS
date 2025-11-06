import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lms-layout',
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
          <mat-icon>school</mat-icon>
          <h2>LMS Portal</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/lms/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <a mat-list-item routerLink="/lms/courses" routerLinkActive="active">
            <mat-icon matListItemIcon>book</mat-icon>
            <span matListItemTitle>Courses</span>
          </a>
          
          <a mat-list-item routerLink="/lms/assignments" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Assignments</span>
          </a>
          
          <a mat-list-item routerLink="/lms/assessment-results" routerLinkActive="active">
            <mat-icon matListItemIcon>grading</mat-icon>
            <span matListItemTitle>Assessment Results</span>
          </a>
          
          <a mat-list-item routerLink="/lms/assessment-taking" routerLinkActive="active">
            <mat-icon matListItemIcon>quiz</mat-icon>
            <span matListItemTitle>Take Assessment</span>
          </a>
          
          <a mat-list-item routerLink="/lms/progress" routerLinkActive="active">
            <mat-icon matListItemIcon>trending_up</mat-icon>
            <span matListItemTitle>Progress</span>
          </a>
          
          <a mat-list-item routerLink="/lms/question-bank" routerLinkActive="active">
            <mat-icon matListItemIcon>help</mat-icon>
            <span matListItemTitle>Question Bank</span>
          </a>
          
          <a mat-list-item routerLink="/lms/resources" routerLinkActive="active">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Resources</span>
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
      background: linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%);
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
export class LmsLayoutComponent {}
