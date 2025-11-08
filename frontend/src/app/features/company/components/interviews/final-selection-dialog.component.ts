import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-final-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  template: `
    <div class="final-selection-dialog">
      <h2 mat-dialog-title>
        <mat-icon>assignment_turned_in</mat-icon>
        Final Selection Decision
      </h2>

      <mat-dialog-content>
        <div class="candidate-summary">
          <h3>Candidate Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Name:</span>
              <span class="value">{{ data.candidate.candidateName }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Position:</span>
              <span class="value">{{ data.candidate.position }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Rounds:</span>
              <span class="value">{{ data.candidate.totalRounds }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Average Rating:</span>
              <span class="value">
                <mat-icon class="rating-star">star</mat-icon>
                {{ getAverageRating() }}/5
              </span>
            </div>
          </div>
        </div>

        <div class="interview-rounds">
          <h3>Interview Performance</h3>
          <div class="rounds-list">
            <div *ngFor="let round of data.candidate.rounds" class="round-item">
              <div class="round-header">
                <span class="round-type">{{ getRoundLabel(round.roundType) }}</span>
                <span class="round-rating" *ngIf="round.rating">
                  <mat-icon>star</mat-icon>
                  {{ round.rating }}/5
                </span>
              </div>
              <div class="round-result" [class]="round.result">
                <mat-icon>{{ getResultIcon(round.result) }}</mat-icon>
                {{ round.result || 'Pending' }}
              </div>
            </div>
          </div>
        </div>

        <div class="decision-section">
          <h3>Final Decision</h3>
          <mat-radio-group [(ngModel)]="decision" required>
            <mat-radio-button value="selected">
              <mat-icon class="decision-icon selected">verified</mat-icon>
              <span>Select Candidate - Proceed with offer</span>
            </mat-radio-button>
            <mat-radio-button value="rejected">
              <mat-icon class="decision-icon rejected">cancel</mat-icon>
              <span>Reject Candidate</span>
            </mat-radio-button>
            <mat-radio-button value="on-hold">
              <mat-icon class="decision-icon hold">schedule</mat-icon>
              <span>Put On Hold - Need more time to decide</span>
            </mat-radio-button>
          </mat-radio-group>
        </div>

        <div class="offer-section" *ngIf="decision === 'selected'">
          <h3>Offer Letter Details</h3>
          
          <div class="file-upload">
            <input type="file" #fileInput (change)="onFileSelected($event)" 
                   accept=".pdf,.doc,.docx" style="display: none;">
            <button mat-stroked-button (click)="fileInput.click()" type="button">
              <mat-icon>upload_file</mat-icon>
              {{ selectedFile ? 'Change File' : 'Upload Offer Letter' }}
            </button>
            <span class="file-name" *ngIf="selectedFile">
              <mat-icon>description</mat-icon>
              {{ selectedFile.name }}
            </span>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Package (CTC in LPA)</mat-label>
            <input matInput type="number" [(ngModel)]="packageAmount" 
                   placeholder="e.g., 6.5" step="0.5" min="0">
            <span matSuffix>LPA</span>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Joining Date</mat-label>
            <input matInput type="date" [(ngModel)]="joiningDate">
          </mat-form-field>

          <div class="notification-options">
            <mat-checkbox [(ngModel)]="sendEmail">
              <mat-icon>email</mat-icon>
              Send offer letter via email
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="notifyPlacement">
              <mat-icon>notifications</mat-icon>
              Notify placement cell
            </mat-checkbox>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width" *ngIf="decision">
          <mat-label>Remarks (Optional)</mat-label>
          <textarea matInput [(ngModel)]="remarks" rows="4"
                    placeholder="Additional comments, reasons for decision, special conditions, etc."></textarea>
        </mat-form-field>

        <div class="warning-box" *ngIf="decision === 'rejected'">
          <mat-icon>warning</mat-icon>
          <p>This candidate will be marked as rejected. This action cannot be undone easily.</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="submit()" 
                [disabled]="!decision || (decision === 'selected' && !selectedFile)">
          <mat-icon>{{ decision === 'selected' ? 'send' : 'save' }}</mat-icon>
          {{ getSubmitLabel() }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .final-selection-dialog {
      min-width: 750px;
      max-height: 90vh;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #667eea;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    }

    .candidate-summary {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      margin-bottom: 24px;
      color: white;

      h3 {
        color: white;
        margin-bottom: 16px;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .summary-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 12px;
          opacity: 0.9;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;

          .rating-star {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #ffc107;
          }
        }
      }
    }

    .interview-rounds {
      margin-bottom: 24px;

      .rounds-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .round-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #fafafa;

        .round-header {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .round-type {
            font-weight: 600;
            font-size: 14px;
          }

          .round-rating {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: #666;

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
              color: #ffc107;
            }
          }
        }

        .round-result {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
          text-transform: capitalize;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }

          &.pass {
            background: #e8f5e9;
            color: #2e7d32;

            mat-icon {
              color: #2e7d32;
            }
          }

          &.fail {
            background: #ffebee;
            color: #c62828;

            mat-icon {
              color: #c62828;
            }
          }

          &.on-hold {
            background: #fff3e0;
            color: #f57c00;

            mat-icon {
              color: #f57c00;
            }
          }
        }
      }
    }

    .decision-section {
      margin: 24px 0;

      mat-radio-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      mat-radio-button {
        padding: 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          background-color: #f8f9fa;
          border-color: #667eea;
        }

        span {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .decision-icon {
          &.selected {
            color: #4caf50;
          }

          &.rejected {
            color: #f44336;
          }

          &.hold {
            color: #ff9800;
          }
        }
      }
    }

    .offer-section {
      padding: 20px;
      background: #e8f5e9;
      border-radius: 8px;
      margin: 24px 0;

      .file-upload {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 16px;

        button {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-name {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border-radius: 4px;
          font-size: 14px;

          mat-icon {
            color: #667eea;
          }
        }
      }

      .notification-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;

        mat-checkbox {
          ::ng-deep .mdc-checkbox__background {
            border-color: #4caf50 !important;
          }

          ::ng-deep .mdc-checkbox--selected .mdc-checkbox__background {
            background-color: #4caf50 !important;
          }

          span {
            display: flex;
            align-items: center;
            gap: 8px;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #4caf50;
            }
          }
        }
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .warning-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fff3e0;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
      margin-top: 16px;

      mat-icon {
        color: #ff9800;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #f57c00;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class FinalSelectionDialogComponent {
  decision: 'selected' | 'rejected' | 'on-hold' | null = null;
  selectedFile: File | null = null;
  packageAmount: number | null = null;
  joiningDate: string = '';
  sendEmail: boolean = true;
  notifyPlacement: boolean = true;
  remarks: string = '';

  constructor(
    private dialogRef: MatDialogRef<FinalSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getRoundLabel(roundType: string): string {
    const labels: { [key: string]: string } = {
      'technical': 'Technical Round',
      'hr': 'HR Round',
      'managerial': 'Managerial Round',
      'final': 'Final Round'
    };
    return labels[roundType] || roundType;
  }

  getResultIcon(result: string | undefined): string {
    const icons: { [key: string]: string } = {
      'pass': 'check_circle',
      'fail': 'cancel',
      'on-hold': 'schedule'
    };
    return icons[result || ''] || 'help_outline';
  }

  getAverageRating(): number {
    const rounds = this.data.candidate.rounds.filter((r: any) => r.rating);
    if (rounds.length === 0) return 0;
    const sum = rounds.reduce((acc: number, r: any) => acc + r.rating, 0);
    return Math.round((sum / rounds.length) * 10) / 10;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      this.selectedFile = file;
    }
  }

  getSubmitLabel(): string {
    if (this.decision === 'selected') {
      return 'Send Offer Letter';
    } else if (this.decision === 'rejected') {
      return 'Confirm Rejection';
    } else if (this.decision === 'on-hold') {
      return 'Put On Hold';
    }
    return 'Submit';
  }

  submit() {
    if (!this.decision) {
      return;
    }

    if (this.decision === 'selected' && !this.selectedFile) {
      alert('Please upload the offer letter');
      return;
    }

    // In a real application, you would upload the file here
    // For now, we'll just pass the file object
    this.dialogRef.close({
      action: 'submitted',
      decision: this.decision,
      offerLetter: this.selectedFile,
      packageAmount: this.packageAmount,
      joiningDate: this.joiningDate,
      sendEmail: this.sendEmail,
      notifyPlacement: this.notifyPlacement,
      remarks: this.remarks
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
