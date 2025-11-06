import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  template: `
    <div class="update-status-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>edit</mat-icon>
          Update Candidate Status
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="candidate-info">
          <div class="candidate-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <div class="candidate-details">
            <h3>{{ data.name }}</h3>
            <p>{{ data.appliedPosition }}</p>
            <div class="current-status">
              <span class="label">Current Status:</span>
              <span class="status-badge" [ngClass]="'status-' + data.status">
                {{ data.status | titlecase }}
              </span>
            </div>
          </div>
        </div>

        <form [formGroup]="statusForm" class="status-form">
          <div class="form-section">
            <h4>
              <mat-icon>flag</mat-icon>
              Select New Status
            </h4>
            <mat-radio-group formControlName="newStatus" class="status-options">
              <mat-radio-button value="new" class="status-option">
                <div class="option-content">
                  <mat-icon>fiber_new</mat-icon>
                  <div>
                    <strong>New</strong>
                    <p>Application just received</p>
                  </div>
                </div>
              </mat-radio-button>

              <mat-radio-button value="reviewed" class="status-option">
                <div class="option-content">
                  <mat-icon>visibility</mat-icon>
                  <div>
                    <strong>Reviewed</strong>
                    <p>Application has been reviewed</p>
                  </div>
                </div>
              </mat-radio-button>

              <mat-radio-button value="shortlisted" class="status-option">
                <div class="option-content">
                  <mat-icon>star</mat-icon>
                  <div>
                    <strong>Shortlisted</strong>
                    <p>Candidate selected for interview</p>
                  </div>
                </div>
              </mat-radio-button>

              <mat-radio-button value="interviewed" class="status-option">
                <div class="option-content">
                  <mat-icon>how_to_reg</mat-icon>
                  <div>
                    <strong>Interviewed</strong>
                    <p>Interview completed</p>
                  </div>
                </div>
              </mat-radio-button>

              <mat-radio-button value="offered" class="status-option">
                <div class="option-content">
                  <mat-icon>card_giftcard</mat-icon>
                  <div>
                    <strong>Offered</strong>
                    <p>Job offer extended</p>
                  </div>
                </div>
              </mat-radio-button>

              <mat-radio-button value="hired" class="status-option">
                <div class="option-content">
                  <mat-icon>check_circle</mat-icon>
                  <div>
                    <strong>Hired</strong>
                    <p>Candidate accepted offer</p>
                  </div>
                </div>
              </mat-radio-button>

              <mat-radio-button value="rejected" class="status-option">
                <div class="option-content">
                  <mat-icon>cancel</mat-icon>
                  <div>
                    <strong>Rejected</strong>
                    <p>Application declined</p>
                  </div>
                </div>
              </mat-radio-button>
            </mat-radio-group>
            <mat-error *ngIf="statusForm.get('newStatus')?.hasError('required') && statusForm.get('newStatus')?.touched">
              Please select a status
            </mat-error>
          </div>

          <div class="form-section">
            <h4>
              <mat-icon>note</mat-icon>
              Additional Notes
            </h4>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason for Status Change</mat-label>
              <textarea matInput formControlName="notes" rows="4" 
                        placeholder="Provide context for this status change (optional)"></textarea>
            </mat-form-field>
          </div>

          <div class="form-section" *ngIf="showRejectionReason">
            <h4>
              <mat-icon>report</mat-icon>
              Rejection Reason
            </h4>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Reason</mat-label>
              <mat-select formControlName="rejectionReason">
                <mat-option value="qualifications">Insufficient qualifications</mat-option>
                <mat-option value="experience">Lack of required experience</mat-option>
                <mat-option value="skills">Skills mismatch</mat-option>
                <mat-option value="interview">Poor interview performance</mat-option>
                <mat-option value="position-filled">Position already filled</mat-option>
                <mat-option value="other">Other</mat-option>
              </mat-select>
              <mat-error *ngIf="statusForm.get('rejectionReason')?.hasError('required')">
                Rejection reason is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-section notification-section">
            <mat-checkbox formControlName="notifyCandidate">
              <div class="checkbox-content">
                <mat-icon>email</mat-icon>
                <div>
                  <strong>Notify Candidate</strong>
                  <p>Send email notification about status change</p>
                </div>
              </div>
            </mat-checkbox>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="updateStatus()" [disabled]="statusForm.invalid">
          <mat-icon>save</mat-icon>
          Update Status
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .update-status-dialog {
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

    .candidate-info {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 12px;
      margin-bottom: 32px;

      .candidate-avatar {
        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #667eea;
        }
      }

      .candidate-details {
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

        .current-status {
          display: flex;
          align-items: center;
          gap: 12px;

          .label {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }

          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 13px;
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
    }

    .status-form {
      width: 100%;

      .form-section {
        margin-bottom: 32px;

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

        mat-form-field {
          &.full-width {
            width: 100%;
          }
        }
      }

      .status-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;

        .status-option {
          padding: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          transition: all 0.3s ease;
          width: 100%;

          &:hover {
            border-color: #667eea;
            background: #667eea05;
          }

          &.mat-radio-checked {
            border-color: #667eea;
            background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
          }

          .option-content {
            display: flex;
            align-items: center;
            gap: 16px;
            width: 100%;

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
              color: #667eea;
            }

            strong {
              display: block;
              margin-bottom: 4px;
              color: #333;
              font-size: 16px;
            }

            p {
              margin: 0;
              color: #666;
              font-size: 13px;
            }
          }
        }
      }

      .notification-section {
        mat-checkbox {
          .checkbox-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-left: 12px;

            mat-icon {
              color: #667eea;
              margin-top: 2px;
            }

            strong {
              display: block;
              margin-bottom: 4px;
              color: #333;
            }

            p {
              margin: 0;
              color: #666;
              font-size: 13px;
            }
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

    mat-error {
      margin-top: 8px;
      display: block;
    }
  `]
})
export class UpdateStatusDialogComponent {
  statusForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.statusForm = this.fb.group({
      newStatus: ['', Validators.required],
      notes: [''],
      rejectionReason: [''],
      notifyCandidate: [true]
    });

    // Watch for status changes to show/hide rejection reason
    this.statusForm.get('newStatus')?.valueChanges.subscribe(value => {
      if (value === 'rejected') {
        this.statusForm.get('rejectionReason')?.setValidators(Validators.required);
      } else {
        this.statusForm.get('rejectionReason')?.clearValidators();
      }
      this.statusForm.get('rejectionReason')?.updateValueAndValidity();
    });
  }

  get showRejectionReason(): boolean {
    return this.statusForm.get('newStatus')?.value === 'rejected';
  }

  updateStatus(): void {
    if (this.statusForm.valid) {
      const statusData = {
        ...this.statusForm.value,
        candidate: this.data,
        previousStatus: this.data.status
      };
      this.dialogRef.close(statusData);
    }
  }
}
