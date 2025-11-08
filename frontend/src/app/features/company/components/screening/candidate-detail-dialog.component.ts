import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-candidate-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="candidate-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon>person</mat-icon>
          <h2>{{ data.candidate.name }}</h2>
        </div>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <mat-tab-group>
          <!-- Personal Information Tab -->
          <mat-tab label="Personal Info">
            <div class="tab-content">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>email</mat-icon>
                  <div>
                    <label>Email</label>
                    <p>{{ data.candidate.email }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>phone</mat-icon>
                  <div>
                    <label>Phone</label>
                    <p>{{ data.candidate.phone }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>location_on</mat-icon>
                  <div>
                    <label>Location</label>
                    <p>{{ data.candidate.currentLocation }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>calendar_today</mat-icon>
                  <div>
                    <label>Batch</label>
                    <p>{{ data.candidate.batch }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>school</mat-icon>
                  <div>
                    <label>Department</label>
                    <p>{{ data.candidate.department }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>grade</mat-icon>
                  <div>
                    <label>CGPA</label>
                    <p class="highlight">{{ data.candidate.cgpa.toFixed(2) }}</p>
                  </div>
                </div>

                <div class="info-item" *ngIf="data.candidate.experience">
                  <mat-icon>work</mat-icon>
                  <div>
                    <label>Experience</label>
                    <p>{{ data.candidate.experience }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>assessment</mat-icon>
                  <div>
                    <label>Assessment Score</label>
                    <p class="highlight">{{ data.candidate.assessmentScore }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Skills & Certifications Tab -->
          <mat-tab label="Skills & Certifications">
            <div class="tab-content">
              <div class="skills-section">
                <h3>
                  <mat-icon>code</mat-icon>
                  Technical Skills
                </h3>
                <div class="chips-container">
                  <mat-chip *ngFor="let skill of data.candidate.skills">
                    {{ skill }}
                  </mat-chip>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="certifications-section">
                <h3>
                  <mat-icon>verified</mat-icon>
                  Certifications
                </h3>
                <div *ngIf="data.candidate.certifications.length > 0" class="cert-list">
                  <div class="cert-item" *ngFor="let cert of data.candidate.certifications">
                    <mat-icon>check_circle</mat-icon>
                    <span>{{ cert }}</span>
                  </div>
                </div>
                <p *ngIf="data.candidate.certifications.length === 0" class="no-data">
                  No certifications listed
                </p>
              </div>
            </div>
          </mat-tab>

          <!-- Application Info Tab -->
          <mat-tab label="Application">
            <div class="tab-content">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>work</mat-icon>
                  <div>
                    <label>Applied Position</label>
                    <p>{{ data.candidate.appliedPosition }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>event</mat-icon>
                  <div>
                    <label>Applied Date</label>
                    <p>{{ data.candidate.appliedDate | date:'medium' }}</p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>{{ getSourceIcon() }}</mat-icon>
                  <div>
                    <label>Source</label>
                    <p>
                      <mat-chip [class]="data.candidate.source === 'admin-shared' ? 'source-admin' : 'source-direct'">
                        {{ getSourceLabel() }}
                      </mat-chip>
                    </p>
                  </div>
                </div>

                <div class="info-item">
                  <mat-icon>{{ getStatusIcon() }}</mat-icon>
                  <div>
                    <label>Current Status</label>
                    <p>
                      <mat-chip [class]="'status-' + data.candidate.status">
                        {{ data.candidate.status.replace('-', ' ').toUpperCase() }}
                      </mat-chip>
                    </p>
                  </div>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="resume-section">
                <h3>
                  <mat-icon>description</mat-icon>
                  Resume/CV
                </h3>
                <button mat-raised-button color="primary" (click)="downloadResume()">
                  <mat-icon>download</mat-icon>
                  Download Resume
                </button>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Close</button>
        <button mat-raised-button color="warn" (click)="reject()" 
                *ngIf="data.candidate.status === 'pending'">
          <mat-icon>cancel</mat-icon>
          Reject
        </button>
        <button mat-raised-button color="primary" (click)="shortlist()" 
                *ngIf="data.candidate.status === 'pending'">
          <mat-icon>check_circle</mat-icon>
          Shortlist
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .candidate-dialog {
      max-width: 900px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;

        mat-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
        }

        h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
        }
      }

      button {
        color: white;
      }
    }

    mat-dialog-content {
      padding: 0;
      max-height: 70vh;
      overflow-y: auto;
    }

    .tab-content {
      padding: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;

      mat-icon {
        color: #667eea;
        margin-top: 4px;
      }

      label {
        display: block;
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 6px;
      }

      p {
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
        font-weight: 500;

        &.highlight {
          color: #667eea;
          font-weight: 700;
          font-size: 18px;
        }
      }
    }

    .skills-section,
    .certifications-section,
    .resume-section {
      margin: 24px 0;

      h3 {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 16px;

        mat-icon {
          color: #667eea;
        }
      }
    }

    .chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .cert-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .cert-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;

        mat-icon {
          color: #4caf50;
        }

        span {
          font-weight: 500;
          color: #2c3e50;
        }
      }
    }

    .no-data {
      color: #7f8c8d;
      font-style: italic;
    }

    mat-chip {
      font-weight: 500;

      &.source-admin {
        background: #2196f3;
        color: white;
      }

      &.source-direct {
        background: #4caf50;
        color: white;
      }

      &.status-pending {
        background: #ffc107;
        color: #333;
      }

      &.status-shortlisted {
        background: #4caf50;
        color: white;
      }

      &.status-rejected {
        background: #f44336;
        color: white;
      }

      &.status-interview-scheduled {
        background: #2196f3;
        color: white;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e9ecef;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CandidateDetailDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CandidateDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getSourceLabel(): string {
    return this.data.candidate.source === 'direct-apply' ? 'Direct Apply' : 'Admin Shared';
  }

  getSourceIcon(): string {
    return this.data.candidate.source === 'direct-apply' ? 'person' : 'admin_panel_settings';
  }

  getStatusIcon(): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'schedule',
      'shortlisted': 'check_circle',
      'rejected': 'cancel',
      'interview-scheduled': 'event'
    };
    return iconMap[this.data.candidate.status] || 'help';
  }

  downloadResume() {
    window.open(this.data.candidate.resumeUrl, '_blank');
  }

  shortlist() {
    this.dialogRef.close({ action: 'shortlist' });
  }

  reject() {
    this.dialogRef.close({ action: 'reject' });
  }

  close() {
    this.dialogRef.close();
  }
}
