import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-view-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule
  ],
  template: `
    <div class="view-profile-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>person</mat-icon>
          Candidate Profile
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <mat-tab-group>
          <!-- Personal Information Tab -->
          <mat-tab label="Personal Info">
            <div class="tab-content">
              <div class="profile-section">
                <div class="profile-header">
                  <div class="profile-avatar">
                    <mat-icon>account_circle</mat-icon>
                  </div>
                  <div class="profile-basic">
                    <h3>{{ data.name }}</h3>
                    <p class="position">Applied for: {{ data.appliedPosition }}</p>
                    <div class="status-badge" [ngClass]="'status-' + data.status">
                      {{ data.status | titlecase }}
                    </div>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="info-grid">
                  <div class="info-item">
                    <mat-icon>email</mat-icon>
                    <div>
                      <label>Email</label>
                      <p>{{ data.email }}</p>
                    </div>
                  </div>

                  <div class="info-item">
                    <mat-icon>phone</mat-icon>
                    <div>
                      <label>Phone</label>
                      <p>{{ data.phone }}</p>
                    </div>
                  </div>

                  <div class="info-item">
                    <mat-icon>event</mat-icon>
                    <div>
                      <label>Applied Date</label>
                      <p>{{ data.appliedDate | date:'medium' }}</p>
                    </div>
                  </div>

                  <div class="info-item">
                    <mat-icon>work</mat-icon>
                    <div>
                      <label>Experience</label>
                      <p>{{ data.experience }}</p>
                    </div>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="skills-section">
                  <h4>
                    <mat-icon>emoji_objects</mat-icon>
                    Skills & Expertise
                  </h4>
                  <div class="skills-chips">
                    <mat-chip *ngFor="let skill of data.skills">
                      {{ skill }}
                    </mat-chip>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Resume Tab -->
          <mat-tab label="Resume">
            <div class="tab-content">
              <div class="resume-section">
                <div class="resume-header">
                  <mat-icon>description</mat-icon>
                  <h4>Resume Document</h4>
                </div>
                <div class="resume-actions">
                  <button mat-raised-button color="primary" (click)="viewResume()">
                    <mat-icon>visibility</mat-icon>
                    View Resume
                  </button>
                  <button mat-raised-button (click)="downloadResume()">
                    <mat-icon>download</mat-icon>
                    Download Resume
                  </button>
                </div>
                <div class="resume-info" *ngIf="data.resumeUrl">
                  <p><strong>File:</strong> {{ getFileName(data.resumeUrl) }}</p>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Cover Letter Tab -->
          <mat-tab label="Cover Letter">
            <div class="tab-content">
              <div class="cover-letter-section">
                <div class="cover-letter-header">
                  <mat-icon>article</mat-icon>
                  <h4>Cover Letter</h4>
                </div>
                <div class="cover-letter-content" *ngIf="data.coverLetter; else noCoverLetter">
                  <p>{{ data.coverLetter }}</p>
                </div>
                <ng-template #noCoverLetter>
                  <div class="empty-state">
                    <mat-icon>inbox</mat-icon>
                    <p>No cover letter submitted</p>
                  </div>
                </ng-template>
              </div>
            </div>
          </mat-tab>

          <!-- Activity Tab -->
          <mat-tab label="Activity">
            <div class="tab-content">
              <div class="activity-section">
                <div class="activity-header">
                  <mat-icon>history</mat-icon>
                  <h4>Application Timeline</h4>
                </div>
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-icon">
                      <mat-icon>send</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <h5>Application Submitted</h5>
                      <p>{{ data.appliedDate | date:'medium' }}</p>
                    </div>
                  </div>
                  <div class="timeline-item" *ngIf="data.status !== 'new'">
                    <div class="timeline-icon">
                      <mat-icon>visibility</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <h5>Application Reviewed</h5>
                      <p>Status updated to {{ data.status }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" (click)="scheduleInterview()">
          <mat-icon>event</mat-icon>
          Schedule Interview
        </button>
        <button mat-raised-button color="accent" (click)="updateStatus()">
          <mat-icon>edit</mat-icon>
          Update Status
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .view-profile-dialog {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 0 -24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 24px;
        font-weight: 500;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      button {
        color: white;
      }
    }

    mat-dialog-content {
      flex: 1;
      padding: 24px !important;
      overflow-y: auto;
      width: 100%;
    }

    .tab-content {
      padding: 24px 0;
      width: 100%;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;

      .profile-avatar {
        mat-icon {
          font-size: 80px;
          width: 80px;
          height: 80px;
          color: #667eea;
        }
      }

      .profile-basic {
        flex: 1;

        h3 {
          margin: 0 0 8px 0;
          font-size: 28px;
          color: #333;
        }

        .position {
          margin: 0 0 12px 0;
          color: #666;
          font-size: 16px;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;

          &.status-new {
            background: #e3f2fd;
            color: #1976d2;
          }

          &.status-reviewed {
            background: #f3e5f5;
            color: #7b1fa2;
          }

          &.status-shortlisted {
            background: #fff3e0;
            color: #f57c00;
          }

          &.status-interviewed {
            background: #e8f5e9;
            color: #388e3c;
          }

          &.status-offered {
            background: #e0f2f1;
            color: #00796b;
          }

          &.status-rejected {
            background: #ffebee;
            color: #c62828;
          }

          &.status-hired {
            background: #e8f5e9;
            color: #2e7d32;
          }
        }
      }
    }

    mat-divider {
      margin: 24px 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin: 24px 0;

      .info-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
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
          color: #666;
          margin-bottom: 4px;
          text-transform: uppercase;
          font-weight: 500;
        }

        p {
          margin: 0;
          color: #333;
          font-size: 16px;
        }
      }
    }

    .skills-section {
      h4 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 16px 0;
        color: #333;
        font-size: 18px;

        mat-icon {
          color: #667eea;
        }
      }

      .skills-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        mat-chip {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
    }

    .resume-section,
    .cover-letter-section,
    .activity-section {
      width: 100%;

      .resume-header,
      .cover-letter-header,
      .activity-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;

        mat-icon {
          color: #667eea;
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        h4 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }
      }

      .resume-actions {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;

        button {
          mat-icon {
            margin-right: 8px;
          }
        }
      }

      .resume-info {
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;

        p {
          margin: 0;
          color: #666;
        }
      }

      .cover-letter-content {
        padding: 24px;
        background: #f8f9fa;
        border-radius: 8px;
        line-height: 1.8;

        p {
          margin: 0;
          color: #333;
          white-space: pre-wrap;
        }
      }

      .empty-state {
        text-align: center;
        padding: 48px;
        color: #999;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }

        p {
          margin: 0;
          font-size: 16px;
        }
      }
    }

    .timeline {
      position: relative;
      padding-left: 40px;

      &::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #e0e0e0;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 32px;

        .timeline-icon {
          position: absolute;
          left: -40px;
          top: 0;
          width: 32px;
          height: 32px;
          background: white;
          border: 2px solid #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #667eea;
          }
        }

        .timeline-content {
          h5 {
            margin: 0 0 8px 0;
            color: #333;
            font-size: 16px;
          }

          p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 0 -24px -24px -24px;
      justify-content: flex-end;
      gap: 12px;

      button {
        mat-icon {
          margin-right: 8px;
        }
      }
    }

    ::ng-deep .mat-mdc-tab-body-content {
      overflow: visible !important;
    }
  `]
})
export class ViewProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getFileName(url: string): string {
    return url.split('/').pop() || 'resume.pdf';
  }

  viewResume(): void {
    if (this.data.resumeUrl) {
      window.open(this.data.resumeUrl, '_blank');
    }
  }

  downloadResume(): void {
    if (this.data.resumeUrl) {
      const link = document.createElement('a');
      link.href = this.data.resumeUrl;
      link.download = this.getFileName(this.data.resumeUrl);
      link.click();
    }
  }

  scheduleInterview(): void {
    this.dialogRef.close({ action: 'scheduleInterview', candidate: this.data });
  }

  updateStatus(): void {
    this.dialogRef.close({ action: 'updateStatus', candidate: this.data });
  }
}
