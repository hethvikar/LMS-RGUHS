import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  status: 'earned' | 'in-progress' | 'expired';
  credentialUrl?: string;
  badgeUrl?: string;
  description: string;
  skills: string[];
  progress?: number;
}

@Component({
  selector: 'app-student-certifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDialogModule,
    MatBadgeModule
  ],
  template: `
    <div class="certifications-container">
      <div class="header">
        <h1>
          <mat-icon>workspace_premium</mat-icon>
          My Certifications
        </h1>
        <p class="subtitle">Track your earned certificates and certifications</p>
      </div>

      <div class="stats-cards">
        <mat-card class="stat-card earned">
          <mat-card-content>
            <div class="stat-number">{{ earnedCount }}</div>
            <div class="stat-label">Earned</div>
            <mat-icon>verified</mat-icon>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card in-progress">
          <mat-card-content>
            <div class="stat-number">{{ inProgressCount }}</div>
            <div class="stat-label">In Progress</div>
            <mat-icon>schedule</mat-icon>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card expired">
          <mat-card-content>
            <div class="stat-number">{{ expiredCount }}</div>
            <div class="stat-label">Expired</div>
            <mat-icon>report_problem</mat-icon>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="certificates-grid">
        @for (certificate of certificates; track certificate.id) {
          <mat-card class="certificate-card" [ngClass]="certificate.status">
            <mat-card-header>
              <div class="certificate-avatar">
                <mat-icon [matBadge]="certificate.status === 'earned' ? '✓' : ''" 
                         [matBadgeColor]="certificate.status === 'earned' ? 'accent' : 'warn'">
                  workspace_premium
                </mat-icon>
              </div>
              <mat-card-title>{{ certificate.name }}</mat-card-title>
              <mat-card-subtitle>{{ certificate.issuer }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p class="description">{{ certificate.description }}</p>
              
              <div class="certificate-dates">
                <div class="date-item">
                  <mat-icon>event</mat-icon>
                  <span>Issued: {{ certificate.issueDate | date:'mediumDate' }}</span>
                </div>
                @if (certificate.expiryDate) {
                  <div class="date-item">
                    <mat-icon>event_available</mat-icon>
                    <span>Expires: {{ certificate.expiryDate | date:'mediumDate' }}</span>
                  </div>
                }
              </div>

              @if (certificate.status === 'in-progress' && certificate.progress !== undefined) {
                <div class="progress-section">
                  <div class="progress-header">
                    <span>Progress</span>
                    <span>{{ certificate.progress }}%</span>
                  </div>
                  <mat-progress-bar [value]="certificate.progress" mode="determinate"></mat-progress-bar>
                </div>
              }

              <div class="skills-section">
                <h4>Skills Validated:</h4>
                <div class="skills-chips">
                  @for (skill of certificate.skills; track skill) {
                    <mat-chip>{{ skill }}</mat-chip>
                  }
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              @if (certificate.status === 'earned' && certificate.credentialUrl) {
                <button mat-raised-button color="primary" (click)="viewCredential(certificate)">
                  <mat-icon>open_in_new</mat-icon>
                  View Credential
                </button>
              }
              @if (certificate.status === 'in-progress') {
                <button mat-raised-button color="accent" (click)="continueCertification(certificate)">
                  <mat-icon>play_arrow</mat-icon>
                  Continue
                </button>
              }
              @if (certificate.status === 'expired') {
                <button mat-raised-button color="warn" (click)="renewCertification(certificate)">
                  <mat-icon>refresh</mat-icon>
                  Renew
                </button>
              }
              <button mat-button (click)="shareCertificate(certificate)">
                <mat-icon>share</mat-icon>
                Share
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>

      @if (certificates.length === 0) {
        <div class="empty-state">
          <mat-icon>workspace_premium</mat-icon>
          <h2>No Certifications Yet</h2>
          <p>Start earning certifications by completing courses and assessments</p>
          <button mat-raised-button color="primary" routerLink="/student/courses">
            Browse Courses
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .certifications-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 8px 0;
        color: #1976d2;
        font-size: 2rem;
        font-weight: 500;
      }

      .subtitle {
        color: #666;
        margin: 0;
        font-size: 1.1rem;
      }
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;

      .stat-card {
        mat-card-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px !important;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 600;
          margin: 0;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          opacity: 0.7;
        }

        &.earned {
          border-left: 4px solid #4caf50;
          .stat-number { color: #4caf50; }
        }

        &.in-progress {
          border-left: 4px solid #ff9800;
          .stat-number { color: #ff9800; }
        }

        &.expired {
          border-left: 4px solid #f44336;
          .stat-number { color: #f44336; }
        }
      }
    }

    .certificates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .certificate-card {
      &.earned {
        border-top: 4px solid #4caf50;
      }

      &.in-progress {
        border-top: 4px solid #ff9800;
      }

      &.expired {
        border-top: 4px solid #f44336;
      }

      .certificate-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: #f5f5f5;
        border-radius: 50%;

        mat-icon {
          color: #1976d2;
        }
      }

      .description {
        margin: 16px 0;
        line-height: 1.5;
        color: #666;
      }

      .certificate-dates {
        margin: 16px 0;

        .date-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: #666;

          mat-icon {
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }

      .progress-section {
        margin: 16px 0;

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }
      }

      .skills-section {
        margin: 16px 0;

        h4 {
          margin: 0 0 12px 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
        }

        .skills-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          mat-chip {
            font-size: 0.8rem;
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 64px 32px;
      color: #666;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 16px;
        color: #ccc;
      }

      h2 {
        margin: 16px 0;
        color: #333;
      }

      p {
        margin-bottom: 24px;
        font-size: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .certifications-container {
        padding: 16px;
      }

      .certificates-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .stats-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentCertificationsComponent implements OnInit {
  certificates: Certificate[] = [
    {
      id: 1,
      name: 'Angular Development Certification',
      issuer: 'RGUHS Learning Platform',
      issueDate: new Date('2024-10-15'),
      expiryDate: new Date('2026-10-15'),
      status: 'earned',
      credentialUrl: 'https://example.com/credential/123',
      description: 'Comprehensive certification covering Angular framework fundamentals, advanced concepts, and best practices.',
      skills: ['Angular', 'TypeScript', 'RxJS', 'Component Architecture', 'Routing'],
      progress: 100
    },
    {
      id: 2,
      name: 'Full Stack Development',
      issuer: 'RGUHS Learning Platform',
      issueDate: new Date('2024-11-01'),
      status: 'in-progress',
      description: 'Complete full-stack development certification covering frontend, backend, and database technologies.',
      skills: ['Node.js', 'Express', 'MongoDB', 'React', 'API Development'],
      progress: 75
    },
    {
      id: 3,
      name: 'Java Programming Fundamentals',
      issuer: 'RGUHS Learning Platform',
      issueDate: new Date('2024-09-01'),
      expiryDate: new Date('2024-11-01'),
      status: 'expired',
      description: 'Basic Java programming certification covering object-oriented programming concepts.',
      skills: ['Java', 'OOP', 'Collections', 'Exception Handling'],
      progress: 100
    },
    {
      id: 4,
      name: 'Database Design & Management',
      issuer: 'RGUHS Learning Platform',
      issueDate: new Date('2024-10-01'),
      status: 'in-progress',
      description: 'Comprehensive database certification covering design, optimization, and management.',
      skills: ['SQL', 'Database Design', 'Normalization', 'Performance Tuning'],
      progress: 45
    }
  ];

  get earnedCount(): number {
    return this.certificates.filter(cert => cert.status === 'earned').length;
  }

  get inProgressCount(): number {
    return this.certificates.filter(cert => cert.status === 'in-progress').length;
  }

  get expiredCount(): number {
    return this.certificates.filter(cert => cert.status === 'expired').length;
  }

  ngOnInit(): void {
    // Load certificates data
    this.loadCertifications();
  }

  loadCertifications(): void {
    // In a real app, this would load from a service
    console.log('Loading certifications...');
  }

  viewCredential(certificate: Certificate): void {
    if (certificate.credentialUrl) {
      window.open(certificate.credentialUrl, '_blank');
    }
  }

  continueCertification(certificate: Certificate): void {
    // Navigate to the appropriate course or assessment
    console.log('Continue certification:', certificate.name);
  }

  renewCertification(certificate: Certificate): void {
    // Start renewal process
    console.log('Renew certification:', certificate.name);
  }

  shareCertificate(certificate: Certificate): void {
    // Open share dialog
    console.log('Share certificate:', certificate.name);
  }
}