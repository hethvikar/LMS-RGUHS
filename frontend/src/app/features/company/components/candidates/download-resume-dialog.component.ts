import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-download-resume-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  template: `
    <div class="download-resume-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>description</mat-icon>
          Resume Download
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="candidate-section">
          <div class="candidate-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <div class="candidate-info">
            <h3>{{ data.name }}</h3>
            <p>{{ data.appliedPosition }}</p>
            <div class="candidate-meta">
              <span><mat-icon>email</mat-icon> {{ data.email }}</span>
              <span><mat-icon>phone</mat-icon> {{ data.phone }}</span>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="resume-section">
          <div class="resume-info">
            <div class="resume-icon">
              <mat-icon>picture_as_pdf</mat-icon>
            </div>
            <div class="resume-details">
              <h4>{{ getFileName() }}</h4>
              <p>PDF Document • {{ getFileSize() }}</p>
              <p class="upload-date">Uploaded: {{ data.appliedDate | date:'medium' }}</p>
            </div>
          </div>

          <div class="download-options">
            <h4>
              <mat-icon>cloud_download</mat-icon>
              Download Options
            </h4>
            
            <div class="option-cards">
              <div class="option-card" (click)="downloadOriginal()">
                <mat-icon>description</mat-icon>
                <div class="option-content">
                  <h5>Original Format</h5>
                  <p>Download the original resume file</p>
                </div>
                <button mat-icon-button color="primary">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>

              <div class="option-card" (click)="viewInBrowser()">
                <mat-icon>visibility</mat-icon>
                <div class="option-content">
                  <h5>View in Browser</h5>
                  <p>Open resume in a new tab</p>
                </div>
                <button mat-icon-button color="primary">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>

              <div class="option-card" (click)="printResume()">
                <mat-icon>print</mat-icon>
                <div class="option-content">
                  <h5>Print Resume</h5>
                  <p>Open print dialog</p>
                </div>
                <button mat-icon-button color="primary">
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="additional-documents" *ngIf="hasAdditionalDocuments()">
            <h4>
              <mat-icon>folder</mat-icon>
              Additional Documents
            </h4>
            <div class="document-list">
              <div class="document-item" *ngIf="data.coverLetter">
                <mat-icon>article</mat-icon>
                <div class="document-info">
                  <h5>Cover Letter</h5>
                  <p>Text document</p>
                </div>
                <button mat-icon-button (click)="viewCoverLetter()">
                  <mat-icon>visibility</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h4>
              <mat-icon>bolt</mat-icon>
              Quick Actions
            </h4>
            <div class="action-buttons">
              <button mat-stroked-button (click)="scheduleInterview()">
                <mat-icon>event</mat-icon>
                Schedule Interview
              </button>
              <button mat-stroked-button (click)="viewProfile()">
                <mat-icon>person</mat-icon>
                View Full Profile
              </button>
              <button mat-stroked-button (click)="updateStatus()">
                <mat-icon>edit</mat-icon>
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div class="download-progress" *ngIf="isDownloading">
          <div class="progress-info">
            <mat-icon>cloud_download</mat-icon>
            <span>Downloading resume...</span>
          </div>
          <mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" (click)="downloadOriginal()">
          <mat-icon>download</mat-icon>
          Download Resume
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .download-resume-dialog {
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

    .candidate-section {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 12px;
      margin-bottom: 24px;

      .candidate-avatar {
        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #667eea;
        }
      }

      .candidate-info {
        flex: 1;

        h3 {
          margin: 0 0 6px 0;
          font-size: 22px;
          color: #333;
        }

        p {
          margin: 0 0 12px 0;
          color: #666;
          font-size: 15px;
        }

        .candidate-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;

          span {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #666;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #667eea;
            }
          }
        }
      }
    }

    mat-divider {
      margin: 24px 0;
    }

    .resume-section {
      width: 100%;

      .resume-info {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
        margin-bottom: 32px;

        .resume-icon {
          mat-icon {
            font-size: 56px;
            width: 56px;
            height: 56px;
            color: #d32f2f;
          }
        }

        .resume-details {
          flex: 1;

          h4 {
            margin: 0 0 6px 0;
            font-size: 18px;
            color: #333;
          }

          p {
            margin: 0 0 4px 0;
            color: #666;
            font-size: 14px;

            &.upload-date {
              color: #999;
              font-size: 13px;
            }
          }
        }
      }

      h4 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 20px 0;
        color: #333;
        font-size: 18px;
        font-weight: 500;

        mat-icon {
          color: #667eea;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
    }

    .download-options {
      margin-bottom: 32px;

      .option-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;

        .option-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, #667eea05 0%, #764ba205 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          }

          > mat-icon {
            font-size: 40px;
            width: 40px;
            height: 40px;
            color: #667eea;
          }

          .option-content {
            flex: 1;

            h5 {
              margin: 0 0 4px 0;
              font-size: 16px;
              color: #333;
            }

            p {
              margin: 0;
              font-size: 13px;
              color: #666;
            }
          }
        }
      }
    }

    .additional-documents {
      margin-bottom: 32px;

      .document-list {
        .document-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 12px;

          > mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: #667eea;
          }

          .document-info {
            flex: 1;

            h5 {
              margin: 0 0 4px 0;
              font-size: 15px;
              color: #333;
            }

            p {
              margin: 0;
              font-size: 13px;
              color: #666;
            }
          }
        }
      }
    }

    .quick-actions {
      .action-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;

        button {
          mat-icon {
            margin-right: 8px;
          }
        }
      }
    }

    .download-progress {
      margin-top: 24px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;

      .progress-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        color: #1976d2;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }

        span {
          font-weight: 500;
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
  `]
})
export class DownloadResumeDialogComponent {
  isDownloading = false;

  constructor(
    public dialogRef: MatDialogRef<DownloadResumeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getFileName(): string {
    if (this.data.resumeUrl) {
      return this.data.resumeUrl.split('/').pop() || `${this.data.name}_Resume.pdf`;
    }
    return `${this.data.name}_Resume.pdf`;
  }

  getFileSize(): string {
    // Mock file size - in real scenario, this would come from server
    return '245 KB';
  }

  hasAdditionalDocuments(): boolean {
    return !!this.data.coverLetter;
  }

  downloadOriginal(): void {
    this.isDownloading = true;
    
    setTimeout(() => {
      if (this.data.resumeUrl) {
        const link = document.createElement('a');
        link.href = this.data.resumeUrl;
        link.download = this.getFileName();
        link.click();
      }
      this.isDownloading = false;
    }, 1000);
  }

  viewInBrowser(): void {
    if (this.data.resumeUrl) {
      window.open(this.data.resumeUrl, '_blank');
    }
  }

  printResume(): void {
    if (this.data.resumeUrl) {
      const printWindow = window.open(this.data.resumeUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  }

  viewCoverLetter(): void {
    this.dialogRef.close({ action: 'viewCoverLetter', candidate: this.data });
  }

  scheduleInterview(): void {
    this.dialogRef.close({ action: 'scheduleInterview', candidate: this.data });
  }

  viewProfile(): void {
    this.dialogRef.close({ action: 'viewProfile', candidate: this.data });
  }

  updateStatus(): void {
    this.dialogRef.close({ action: 'updateStatus', candidate: this.data });
  }
}
