import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-request-more-profiles-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="request-dialog">
      <h2 mat-dialog-title>
        <mat-icon>person_add</mat-icon>
        Request More Candidate Profiles
      </h2>

      <mat-dialog-content>
        <div class="current-stats">
          <h3>Current Status</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <label>Job Position</label>
              <p>{{ data.job.jobTitle }}</p>
            </div>
            <div class="stat-item">
              <label>Candidates Needed</label>
              <p>{{ data.job.candidatesNeeded }}</p>
            </div>
            <div class="stat-item">
              <label>Received So Far</label>
              <p>{{ data.job.candidatesReceived }}</p>
            </div>
            <div class="stat-item">
              <label>Shortlisted</label>
              <p class="highlight">{{ data.job.shortlisted }}</p>
            </div>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Additional Candidates Needed</mat-label>
          <input matInput type="number" [(ngModel)]="additionalCount" min="1" placeholder="e.g., 3">
          <mat-hint>How many more profiles do you need?</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Priority Level</mat-label>
          <mat-select [(ngModel)]="priority">
            <mat-option value="urgent">Urgent (Within 24 hours)</mat-option>
            <mat-option value="high">High (Within 3 days)</mat-option>
            <mat-option value="normal">Normal (Within a week)</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Additional Requirements (Optional)</mat-label>
          <textarea matInput [(ngModel)]="additionalRequirements" rows="4"
                    placeholder="Specify any additional skills, experience, or preferences..."></textarea>
        </mat-form-field>

        <div class="info-note">
          <mat-icon>info</mat-icon>
          <p>Your request will be sent to the placement cell. They will search for matching candidates and share profiles with you.</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="submit()" [disabled]="!additionalCount || additionalCount < 1">
          <mat-icon>send</mat-icon>
          Send Request
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .request-dialog {
      min-width: 500px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #667eea;
      margin-bottom: 24px;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .current-stats {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 24px;

      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        margin: 0 0 16px 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .stat-item {
          label {
            display: block;
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          p {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;

            &.highlight {
              color: #667eea;
            }
          }
        }
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .info-note {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
      margin-top: 16px;

      mat-icon {
        color: #2196f3;
        flex-shrink: 0;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #1976d2;
        line-height: 1.6;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class RequestMoreProfilesDialogComponent {
  additionalCount: number = 0;
  priority: string = 'normal';
  additionalRequirements: string = '';

  constructor(
    private dialogRef: MatDialogRef<RequestMoreProfilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    if (!this.additionalCount || this.additionalCount < 1) {
      return;
    }

    this.dialogRef.close({
      action: 'requested',
      count: this.additionalCount,
      priority: this.priority,
      requirements: this.additionalRequirements
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
