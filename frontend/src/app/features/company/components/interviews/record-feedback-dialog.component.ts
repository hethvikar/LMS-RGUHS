import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-record-feedback-dialog',
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
    MatChipsModule
  ],
  template: `
    <div class="feedback-dialog">
      <h2 mat-dialog-title>
        <mat-icon>rate_review</mat-icon>
        Record Interview Feedback - {{ getRoundLabel() }}
      </h2>

      <mat-dialog-content>
        <div class="interview-info">
          <h3>Interview Details</h3>
          <p><strong>Candidate:</strong> {{ data.candidate.candidateName }}</p>
          <p><strong>Position:</strong> {{ data.candidate.position }}</p>
          <p><strong>Round:</strong> {{ data.round.roundNumber }} of {{ data.candidate.totalRounds }}</p>
          <p><strong>Interviewer:</strong> {{ data.round.interviewer }}</p>
          <p><strong>Date:</strong> {{ formatDate(data.round.scheduledDate) }}</p>
        </div>

        <div class="rating-section">
          <h3>Overall Rating</h3>
          <div class="star-rating">
            <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                      (click)="setRating(star)"
                      [class.filled]="star <= rating"
                      class="star">
              {{ star <= rating ? 'star' : 'star_border' }}
            </mat-icon>
          </div>
          <p class="rating-label">{{ getRatingLabel() }}</p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Interview Feedback</mat-label>
          <textarea matInput [(ngModel)]="feedback" rows="6" required
                    placeholder="Please provide detailed feedback about the candidate's performance, technical skills, communication, problem-solving ability, etc."></textarea>
          <mat-hint>Be specific and constructive</mat-hint>
        </mat-form-field>

        <div class="result-section">
          <h3>Interview Result</h3>
          <mat-radio-group [(ngModel)]="result" required>
            <mat-radio-button value="pass">
              <mat-icon class="result-icon pass">check_circle</mat-icon>
              <span>Pass - Proceed to next round</span>
            </mat-radio-button>
            <mat-radio-button value="fail">
              <mat-icon class="result-icon fail">cancel</mat-icon>
              <span>Fail - Reject candidate</span>
            </mat-radio-button>
            <mat-radio-button value="on-hold">
              <mat-icon class="result-icon hold">pause_circle</mat-icon>
              <span>On Hold - Need more evaluation</span>
            </mat-radio-button>
          </mat-radio-group>
        </div>

        <mat-form-field appearance="outline" class="full-width" *ngIf="result">
          <mat-label>Additional Notes (Optional)</mat-label>
          <textarea matInput [(ngModel)]="notes" rows="3"
                    placeholder="Any additional comments, recommendations, or concerns"></textarea>
        </mat-form-field>

        <div class="next-step-info" *ngIf="result === 'pass' && !isLastRound()">
          <mat-icon>info</mat-icon>
          <p>Candidate will automatically advance to <strong>{{ getNextRoundLabel() }}</strong></p>
        </div>

        <div class="next-step-info final" *ngIf="result === 'pass' && isLastRound()">
          <mat-icon>celebration</mat-icon>
          <p>This is the final round. Candidate will proceed to final selection for offer letter.</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="submit()" 
                [disabled]="!rating || !feedback || !result">
          <mat-icon>save</mat-icon>
          Submit Feedback
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .feedback-dialog {
      min-width: 700px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #667eea;
    }

    .interview-info {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 24px;

      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #666;
        margin: 0 0 12px 0;
      }

      p {
        margin: 8px 0;
        font-size: 14px;
      }
    }

    .rating-section {
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
      }

      .star-rating {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;

        .star {
          font-size: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #ddd;

          &.filled {
            color: #ffc107;
          }

          &:hover {
            transform: scale(1.1);
          }
        }
      }

      .rating-label {
        font-size: 14px;
        font-weight: 500;
        color: #667eea;
        min-height: 20px;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .result-section {
      margin: 24px 0;

      h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      mat-radio-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      mat-radio-button {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f8f9fa;
        }

        span {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-icon {
          margin-right: 8px;

          &.pass {
            color: #4caf50;
          }

          &.fail {
            color: #f44336;
          }

          &.hold {
            color: #ff9800;
          }
        }
      }
    }

    .next-step-info {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e8eaf6;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin-top: 16px;

      mat-icon {
        color: #667eea;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #5a67d8;
      }

      &.final {
        background: #e8f5e9;
        border-left-color: #4caf50;

        mat-icon {
          color: #4caf50;
        }

        p {
          color: #388e3c;
        }
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
export class RecordFeedbackDialogComponent {
  rating: number = 0;
  feedback: string = '';
  result: 'pass' | 'fail' | 'on-hold' | null = null;
  notes: string = '';

  constructor(
    private dialogRef: MatDialogRef<RecordFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getRoundLabel(): string {
    const labels: { [key: string]: string } = {
      'technical': 'Technical Round',
      'hr': 'HR Round',
      'managerial': 'Managerial Round',
      'final': 'Final Round'
    };
    return labels[this.data.round.roundType] || `Round ${this.data.round.roundNumber}`;
  }

  getNextRoundLabel(): string {
    const nextRoundNumber = this.data.round.roundNumber + 1;
    const nextRound = this.data.candidate.rounds.find((r: any) => r.roundNumber === nextRoundNumber);
    if (nextRound) {
      const labels: { [key: string]: string } = {
        'technical': 'Technical Round',
        'hr': 'HR Round',
        'managerial': 'Managerial Round',
        'final': 'Final Round'
      };
      return labels[nextRound.roundType] || `Round ${nextRoundNumber}`;
    }
    return 'Next Round';
  }

  isLastRound(): boolean {
    return this.data.round.roundNumber === this.data.candidate.totalRounds;
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  getRatingLabel(): string {
    const labels = [
      '',
      'Poor - Major concerns',
      'Fair - Below expectations',
      'Good - Meets expectations',
      'Very Good - Exceeds expectations',
      'Excellent - Outstanding performance'
    ];
    return labels[this.rating] || '';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  submit() {
    if (!this.rating || !this.feedback || !this.result) {
      return;
    }

    this.dialogRef.close({
      action: 'submitted',
      rating: this.rating,
      feedback: this.feedback,
      result: this.result,
      notes: this.notes
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
