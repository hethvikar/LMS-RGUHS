import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface InterviewData {
  id: number;
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewDate: Date;
  interviewType: string;
  interviewer: string;
}

@Component({
  selector: 'app-add-feedback-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="feedback-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">rate_review</mat-icon>
          <div>
            <h1 class="dialog-title">Interview Feedback</h1>
            <p class="dialog-subtitle">{{ interview.candidateName }} - {{ interview.position }}</p>
          </div>
        </div>
        <button mat-icon-button class="close-button" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()" class="dialog-content">
        <!-- Overall Rating -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon>star</mat-icon>
            <h3>Overall Rating</h3>
          </div>
          <div class="rating-container">
            <div class="star-rating">
              <mat-icon 
                *ngFor="let star of [1,2,3,4,5]" 
                (click)="setRating(star)"
                [class.selected]="star <= selectedRating"
                class="star">
                {{ star <= selectedRating ? 'star' : 'star_border' }}
              </mat-icon>
            </div>
            <span class="rating-text">{{ getRatingText(selectedRating) }}</span>
          </div>
        </div>

        <!-- Interview Decision -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon>check_circle</mat-icon>
            <h3>Interview Decision</h3>
          </div>
          <mat-radio-group formControlName="decision" class="decision-group">
            <mat-radio-button value="proceed" class="decision-option proceed">
              <div class="decision-content">
                <mat-icon>thumb_up</mat-icon>
                <span>Proceed to Next Round</span>
              </div>
            </mat-radio-button>
            <mat-radio-button value="hold" class="decision-option hold">
              <div class="decision-content">
                <mat-icon>pause_circle</mat-icon>
                <span>Keep on Hold</span>
              </div>
            </mat-radio-button>
            <mat-radio-button value="reject" class="decision-option reject">
              <div class="decision-content">
                <mat-icon>thumb_down</mat-icon>
                <span>Reject Candidate</span>
              </div>
            </mat-radio-button>
          </mat-radio-group>
        </div>

        <!-- Skills Assessment -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon>psychology</mat-icon>
            <h3>Skills Assessment</h3>
          </div>
          <div class="skills-grid">
            <mat-form-field appearance="outline" class="skill-field">
              <mat-label>Technical Skills</mat-label>
              <mat-select formControlName="technicalSkills">
                <mat-option value="1">Poor</mat-option>
                <mat-option value="2">Below Average</mat-option>
                <mat-option value="3">Average</mat-option>
                <mat-option value="4">Good</mat-option>
                <mat-option value="5">Excellent</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="skill-field">
              <mat-label>Communication</mat-label>
              <mat-select formControlName="communication">
                <mat-option value="1">Poor</mat-option>
                <mat-option value="2">Below Average</mat-option>
                <mat-option value="3">Average</mat-option>
                <mat-option value="4">Good</mat-option>
                <mat-option value="5">Excellent</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="skill-field">
              <mat-label>Problem Solving</mat-label>
              <mat-select formControlName="problemSolving">
                <mat-option value="1">Poor</mat-option>
                <mat-option value="2">Below Average</mat-option>
                <mat-option value="3">Average</mat-option>
                <mat-option value="4">Good</mat-option>
                <mat-option value="5">Excellent</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="skill-field">
              <mat-label>Cultural Fit</mat-label>
              <mat-select formControlName="culturalFit">
                <mat-option value="1">Poor</mat-option>
                <mat-option value="2">Below Average</mat-option>
                <mat-option value="3">Average</mat-option>
                <mat-option value="4">Good</mat-option>
                <mat-option value="5">Excellent</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Strengths -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon>trending_up</mat-icon>
            <h3>Key Strengths</h3>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>What are the candidate's strengths?</mat-label>
            <textarea 
              matInput 
              formControlName="strengths" 
              rows="3"
              placeholder="e.g., Strong problem-solving skills, excellent communication..."></textarea>
          </mat-form-field>
        </div>

        <!-- Areas for Improvement -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon>trending_down</mat-icon>
            <h3>Areas for Improvement</h3>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>What areas need improvement?</mat-label>
            <textarea 
              matInput 
              formControlName="improvements" 
              rows="3"
              placeholder="e.g., Needs more experience with frameworks..."></textarea>
          </mat-form-field>
        </div>

        <!-- Additional Comments -->
        <div class="form-section">
          <div class="section-header">
            <mat-icon>comment</mat-icon>
            <h3>Additional Comments</h3>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Any additional feedback?</mat-label>
            <textarea 
              matInput 
              formControlName="comments" 
              rows="4"
              placeholder="Any other observations or recommendations..."></textarea>
          </mat-form-field>
        </div>

        <!-- Salary Recommendation (Optional) -->
        <div class="form-section" *ngIf="feedbackForm.get('decision')?.value === 'proceed'">
          <div class="section-header">
            <mat-icon>attach_money</mat-icon>
            <h3>Salary Recommendation (Optional)</h3>
          </div>
          <div class="salary-row">
            <mat-form-field appearance="outline" class="salary-field">
              <mat-label>Minimum</mat-label>
              <input matInput type="number" formControlName="salaryMin" placeholder="50000">
              <span matPrefix>$&nbsp;</span>
            </mat-form-field>
            <span class="salary-separator">to</span>
            <mat-form-field appearance="outline" class="salary-field">
              <mat-label>Maximum</mat-label>
              <input matInput type="number" formControlName="salaryMax" placeholder="70000">
              <span matPrefix>$&nbsp;</span>
            </mat-form-field>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="dialog-actions">
          <button mat-button type="button" (click)="closeDialog()">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!feedbackForm.valid">
            <mat-icon>send</mat-icon>
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .feedback-dialog {
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      flex: 1;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .dialog-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .dialog-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
    }

    .close-button {
      color: white;
    }

    .dialog-content {
      padding: 32px;
      overflow-y: auto;
      flex: 1;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .section-header mat-icon {
      color: #667eea;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #212529;
    }

    /* Rating Section */
    .rating-container {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .star-rating {
      display: flex;
      gap: 8px;
    }

    .star {
      font-size: 40px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      color: #ddd;
      transition: all 0.2s ease;
    }

    .star:hover,
    .star.selected {
      color: #ffc107;
      transform: scale(1.1);
    }

    .rating-text {
      font-size: 1.2rem;
      font-weight: 600;
      color: #667eea;
    }

    /* Decision Section */
    .decision-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .decision-option {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 16px 20px;
      transition: all 0.3s ease;
    }

    .decision-option:hover {
      border-color: #667eea;
      background: #f8f9fa;
    }

    .decision-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .decision-content mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .decision-option.proceed .decision-content mat-icon {
      color: #28a745;
    }

    .decision-option.hold .decision-content mat-icon {
      color: #ffc107;
    }

    .decision-option.reject .decision-content mat-icon {
      color: #dc3545;
    }

    ::ng-deep .mat-mdc-radio-button.mat-accent.mat-mdc-radio-checked .mdc-radio__background {
      border-color: #667eea !important;
    }

    ::ng-deep .mat-mdc-radio-button.mat-accent .mdc-radio__inner-circle {
      background-color: #667eea !important;
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .skill-field {
      width: 100%;
    }

    /* Full Width Fields */
    .full-width {
      width: 100%;
    }

    /* Salary Section */
    .salary-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .salary-field {
      flex: 1;
    }

    .salary-separator {
      font-weight: 600;
      color: #6c757d;
      padding: 0 8px;
    }

    /* Action Buttons */
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
      margin-top: 32px;
    }

    .dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Scrollbar */
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dialog-header {
        padding: 24px;
      }

      .header-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }

      .dialog-title {
        font-size: 1.5rem;
      }

      .dialog-content {
        padding: 24px;
      }

      .rating-container {
        flex-direction: column;
        align-items: flex-start;
      }

      .star {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .skills-grid {
        grid-template-columns: 1fr;
      }

      .salary-row {
        flex-direction: column;
        align-items: stretch;
      }

      .salary-separator {
        text-align: center;
      }

      .dialog-actions {
        flex-direction: column;
      }

      .dialog-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AddFeedbackDialogComponent {
  feedbackForm: FormGroup;
  interview: InterviewData;
  selectedRating: number = 0;

  ratingLabels: { [key: number]: string } = {
    1: 'Poor',
    2: 'Below Average',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddFeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterviewData
  ) {
    this.interview = data;

    this.feedbackForm = this.fb.group({
      overallRating: [0, [Validators.required, Validators.min(1)]],
      decision: ['', [Validators.required]],
      technicalSkills: ['', [Validators.required]],
      communication: ['', [Validators.required]],
      problemSolving: ['', [Validators.required]],
      culturalFit: ['', [Validators.required]],
      strengths: ['', [Validators.required]],
      improvements: ['', [Validators.required]],
      comments: [''],
      salaryMin: [''],
      salaryMax: ['']
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.feedbackForm.patchValue({ overallRating: rating });
  }

  getRatingText(rating: number): string {
    return this.ratingLabels[rating] || 'Not Rated';
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const feedbackData = {
        interviewId: this.interview.id,
        candidate: {
          name: this.interview.candidateName,
          email: this.interview.candidateEmail,
          position: this.interview.position
        },
        feedback: {
          ...this.feedbackForm.value,
          interviewer: this.interview.interviewer,
          interviewDate: this.interview.interviewDate,
          submittedAt: new Date()
        }
      };

      this.dialogRef.close({ action: 'submitted', data: feedbackData });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
