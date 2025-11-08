import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-view-request-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <div class="request-details-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>{{ getRequestIcon() }}</mat-icon>
          Candidate Request Details
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <!-- Company & Job Information -->
        <div class="info-section">
          <h3>
            <mat-icon>business</mat-icon>
            Company & Job Information
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Company Name</label>
              <p>{{ data.request.companyName }}</p>
            </div>
            <div class="info-item">
              <label>Job Title</label>
              <p>{{ data.request.jobTitle }}</p>
            </div>
            <div class="info-item">
              <label>Request Type</label>
              <p>
                <mat-chip [class]="data.request.requestType === 'open-job' ? 'type-open' : 'type-direct'">
                  {{ getRequestTypeLabel() }}
                </mat-chip>
              </p>
            </div>
            <div class="info-item">
              <label>Priority</label>
              <p>
                <mat-chip [class]="'priority-' + data.request.priority">
                  {{ data.request.priority.toUpperCase() }}
                </mat-chip>
              </p>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Request Status -->
        <div class="info-section">
          <h3>
            <mat-icon>timeline</mat-icon>
            Request Status & Progress
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Current Status</label>
              <p>
                <mat-chip [class]="'status-' + data.request.status">
                  {{ data.request.status.toUpperCase() }}
                </mat-chip>
              </p>
            </div>
            <div class="info-item">
              <label>Requested Date</label>
              <p>{{ data.request.requestedDate | date:'medium' }}</p>
            </div>
            <div class="info-item">
              <label>Candidates Needed</label>
              <p class="highlight">{{ data.request.numberOfCandidates }}</p>
            </div>
            <div class="info-item">
              <label>Candidates Matched</label>
              <p class="highlight">{{ data.request.matchedCandidates }}</p>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-label">
              <span>Progress: {{ getProgressPercentage() }}%</span>
              <span>{{ data.request.matchedCandidates }}/{{ data.request.numberOfCandidates }}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Assignment -->
        <div class="info-section">
          <h3>
            <mat-icon>person</mat-icon>
            Assignment
          </h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Assigned Placement Officer</mat-label>
            <mat-select [(ngModel)]="data.request.assignedOfficer">
              <mat-option [value]="undefined">Unassigned</mat-option>
              <mat-option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</mat-option>
              <mat-option value="Prof. Sunita Sharma">Prof. Sunita Sharma</mat-option>
              <mat-option value="Dr. Anita Desai">Dr. Anita Desai</mat-option>
              <mat-option value="Prof. Vikram Singh">Prof. Vikram Singh</mat-option>
              <mat-option value="Dr. Priya Patel">Dr. Priya Patel</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-divider></mat-divider>

        <!-- Requirements -->
        <div class="info-section">
          <h3>
            <mat-icon>checklist</mat-icon>
            Requirements
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Experience</label>
              <p>{{ data.request.experience }}</p>
            </div>
            <div class="info-item">
              <label>Education</label>
              <p>{{ data.request.education }}</p>
            </div>
          </div>

          <div class="chips-section">
            <label>Required Skills</label>
            <div class="chips-container">
              <mat-chip *ngFor="let skill of data.request.requiredSkills">
                {{ skill }}
              </mat-chip>
            </div>
          </div>

          <div class="chips-section">
            <label>Batch Preference</label>
            <div class="chips-container">
              <mat-chip *ngFor="let batch of data.request.batchPreference" class="batch-chip">
                {{ batch }}
              </mat-chip>
            </div>
          </div>
        </div>

        <mat-divider *ngIf="data.request.notes"></mat-divider>

        <!-- Notes -->
        <div class="info-section" *ngIf="data.request.notes">
          <h3>
            <mat-icon>note</mat-icon>
            Additional Notes
          </h3>
          <p class="notes-text">{{ data.request.notes }}</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Close</button>
        <button mat-raised-button color="primary" (click)="saveChanges()">
          <mat-icon>save</mat-icon>
          Save Changes
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .request-details-dialog {
      max-width: 800px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px 8px 0 0;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;

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
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .info-section {
      margin-bottom: 24px;

      h3 {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 16px 0;

        mat-icon {
          color: #667eea;
        }
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 16px;
    }

    .info-item {
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
          font-size: 20px;
          color: #667eea;
          font-weight: 700;
        }
      }
    }

    .progress-bar {
      margin-top: 16px;

      .progress-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #2c3e50;
      }

      .progress-track {
        height: 24px;
        background: #e9ecef;
        border-radius: 12px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }

    .chips-section {
      margin-top: 16px;

      label {
        display: block;
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .chips-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .notes-text {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin: 0;
      line-height: 1.6;
      color: #2c3e50;
    }

    .full-width {
      width: 100%;
    }

    mat-chip {
      font-weight: 500;

      &.type-open {
        background: #4caf50;
        color: white;
      }

      &.type-direct {
        background: #2196f3;
        color: white;
      }

      &.priority-high {
        background: #f44336;
        color: white;
      }

      &.priority-medium {
        background: #ff9800;
        color: white;
      }

      &.priority-low {
        background: #9e9e9e;
        color: white;
      }

      &.status-pending {
        background: #ffc107;
        color: #333;
      }

      &.status-in-progress {
        background: #2196f3;
        color: white;
      }

      &.status-fulfilled {
        background: #4caf50;
        color: white;
      }

      &.status-cancelled {
        background: #9e9e9e;
        color: white;
      }

      &.batch-chip {
        background: #667eea;
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
export class ViewRequestDetailsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewRequestDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getRequestIcon(): string {
    return this.data.request.requestType === 'open-job' ? 'public' : 'person_search';
  }

  getRequestTypeLabel(): string {
    return this.data.request.requestType === 'open-job' ? 'Open Job Posting' : 'Direct Candidate Request';
  }

  getProgressPercentage(): number {
    return this.data.request.numberOfCandidates > 0
      ? Math.round((this.data.request.matchedCandidates / this.data.request.numberOfCandidates) * 100)
      : 0;
  }

  saveChanges() {
    this.dialogRef.close({ action: 'updated', request: this.data.request });
  }

  close() {
    this.dialogRef.close();
  }
}
