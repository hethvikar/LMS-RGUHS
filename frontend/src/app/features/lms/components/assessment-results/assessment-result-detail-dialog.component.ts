import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface DetailedResult {
  assessmentId: number;
  questionId: number;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  explanation?: string;
}

interface AssessmentResult {
  id: number;
  assessmentTitle: string;
  courseName: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  status: 'passed' | 'failed';
  submittedDate: Date;
  timeTaken: number;
  attempts: number;
  maxAttempts: number;
  instructorFeedback?: string;
  nextAttemptDate?: Date;
}

export interface DialogData {
  result: AssessmentResult;
  detailedResults: DetailedResult[];
}

@Component({
  selector: 'app-assessment-result-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="detailed-result-dialog">
      <mat-dialog-content>
        <div class="dialog-header">
          <div class="header-content-modal">
            <mat-icon class="header-icon">assessment</mat-icon>
            <h2 mat-dialog-title>{{ data.result.assessmentTitle }} - Detailed Results</h2>
          </div>
          <button mat-icon-button class="close-btn" (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="result-summary">
          <div class="summary-metric">
            <mat-icon>grade</mat-icon>
            <div class="metric-info">
              <h3>{{ data.result.score }}/{{ data.result.maxScore }}</h3>
              <p>Total Score</p>
            </div>
          </div>
          <div class="summary-metric">
            <mat-icon>percent</mat-icon>
            <div class="metric-info">
              <h3>{{ data.result.percentage }}%</h3>
              <p>Percentage</p>
            </div>
          </div>
          <div class="summary-metric">
            <mat-icon>emoji_events</mat-icon>
            <div class="metric-info">
              <h3>{{ data.result.grade }}</h3>
              <p>Grade</p>
            </div>
          </div>
          <div class="summary-metric">
            <mat-icon>schedule</mat-icon>
            <div class="metric-info">
              <h3>{{ data.result.timeTaken }} min</h3>
              <p>Time Taken</p>
            </div>
          </div>
        </div>

        <div class="question-review">
          <h4>
            <mat-icon>quiz</mat-icon>
            Question by Question Review
          </h4>
          <div class="question-item" *ngFor="let detail of data.detailedResults">
            <div class="question-header">
              <span class="question-number">Question {{ detail.questionId }}</span>
              <mat-chip [class.correct]="detail.isCorrect" [class.incorrect]="!detail.isCorrect">
                <mat-icon>{{ detail.isCorrect ? 'check_circle' : 'cancel' }}</mat-icon>
                {{ detail.isCorrect ? 'Correct' : 'Incorrect' }}
              </mat-chip>
              <span class="question-points">{{ detail.points }}/{{ detail.maxPoints }} points</span>
            </div>
            <div class="question-text">{{ detail.question }}</div>
            <div class="answer-comparison">
              <div class="your-answer">
                <mat-icon>person</mat-icon>
                <div>
                  <strong>Your Answer</strong>
                  <p>{{ detail.yourAnswer }}</p>
                </div>
              </div>
              <div class="correct-answer">
                <mat-icon>done</mat-icon>
                <div>
                  <strong>Correct Answer</strong>
                  <p>{{ detail.correctAnswer }}</p>
                </div>
              </div>
              <div class="explanation" *ngIf="detail.explanation">
                <mat-icon>lightbulb</mat-icon>
                <div>
                  <strong>Explanation</strong>
                  <p>{{ detail.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button class="cancel-btn" (click)="onClose()">
          <mat-icon>close</mat-icon>
          Close
        </button>
        <button mat-raised-button color="primary">
          <mat-icon>download</mat-icon>
          Download Report
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .detailed-result-dialog {
      max-width: 900px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 24px;
      margin: -24px -24px 24px -24px;
      border-radius: 4px 4px 0 0;

      .header-content-modal {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }
      }

      .close-btn {
        color: white;
        transition: all 0.3s ease;

        &:hover {
          transform: rotate(90deg) scale(1.1);
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }

    ::ng-deep .mat-mdc-dialog-content {
      padding: 24px !important;
      max-height: 70vh;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;

        &:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      }
    }

    .result-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 16px;
      border: 2px solid #90caf9;

      .summary-metric {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
        }

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: #667eea;
        }

        .metric-info {
          h3 {
            margin: 0 0 4px 0;
            font-size: 1.75rem;
            font-weight: 700;
            color: #2c3e50;
          }

          p {
            margin: 0;
            font-size: 0.9rem;
            color: #6c757d;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }
      }
    }

    .question-review {
      h4 {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0 0 24px 0;
        padding: 16px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        border-left: 4px solid #667eea;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          color: #667eea;
        }
      }
    }

    .question-item {
      margin-bottom: 24px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      border: 2px solid #e3e8ee;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
        border-color: #90caf9;
      }

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid #e9ecef;
        flex-wrap: wrap;
        gap: 12px;

        .question-number {
          font-weight: 700;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        mat-chip {
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }

          &.correct {
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            color: #2e7d32;
            border: 2px solid #a5d6a7;
          }

          &.incorrect {
            background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
            color: #d32f2f;
            border: 2px solid #ef9a9a;
          }
        }

        .question-points {
          font-weight: 700;
          color: #667eea;
          font-size: 1rem;
        }
      }

      .question-text {
        margin-bottom: 20px;
        color: #2c3e50;
        font-size: 1.1rem;
        line-height: 1.7;
        font-weight: 500;
      }

      .answer-comparison {
        display: grid;
        gap: 16px;

        .your-answer, .correct-answer, .explanation {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border-radius: 12px;
          font-size: 15px;
          line-height: 1.6;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          div {
            flex: 1;

            strong {
              display: block;
              margin-bottom: 8px;
              font-weight: 700;
              font-size: 0.95rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            p {
              margin: 0;
              color: #495057;
            }
          }
        }

        .your-answer {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-left: 4px solid #1976d2;

          mat-icon {
            color: #1976d2;
          }
        }

        .correct-answer {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border-left: 4px solid #2e7d32;

          mat-icon {
            color: #2e7d32;
          }
        }

        .explanation {
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-left: 4px solid #f57c00;

          mat-icon {
            color: #f57c00;
          }
        }
      }
    }

    ::ng-deep .mat-mdc-dialog-actions {
      padding: 20px 24px !important;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-top: 2px solid #dee2e6;
      margin: 24px -24px -24px -24px;

      button {
        border-radius: 10px;
        font-weight: 600;
        padding: 10px 24px;
        transition: all 0.3s cubic-bezier(.4,0,.2,1);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        mat-icon {
          margin-right: 6px;
        }
      }

      .cancel-btn {
        color: #6c757d;

        &:hover {
          background: #dee2e6;
        }
      }
    }

    @media (max-width: 768px) {
      .result-summary {
        grid-template-columns: repeat(2, 1fr);
      }

      .question-item {
        padding: 16px;
      }

      .question-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class AssessmentResultDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AssessmentResultDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
