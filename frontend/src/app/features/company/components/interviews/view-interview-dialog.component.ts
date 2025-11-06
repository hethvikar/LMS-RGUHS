import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

interface InterviewData {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  position: string;
  interviewDate: Date;
  interviewType: string;
  status: string;
  interviewer: string;
  location: string;
  meetingLink?: string;
  notes?: string;
  feedback?: any;
  rating?: number;
  skills?: string[];
  experience?: string;
  resumeUrl?: string;
  coverLetter?: string;
}

@Component({
  selector: 'app-view-interview-dialog',
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
    <div class="view-interview-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">info</mat-icon>
          <div>
            <h1 class="dialog-title">Interview Details</h1>
            <p class="dialog-subtitle">Complete interview information</p>
          </div>
        </div>
        <button mat-icon-button class="close-button" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <mat-tab-group>
          <!-- Overview Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">overview</mat-icon>
              Overview
            </ng-template>
            <div class="tab-content">
              <!-- Status Badge -->
              <div class="status-banner" [ngClass]="getStatusClass(interview.status)">
                <mat-icon>{{ getStatusIcon(interview.status) }}</mat-icon>
                <span>{{ getStatusText(interview.status) }}</span>
              </div>

              <!-- Candidate Information -->
              <div class="info-section">
                <div class="section-header">
                  <mat-icon>person</mat-icon>
                  <h3>Candidate Information</h3>
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Name</span>
                    <span class="value">{{ interview.candidateName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Email</span>
                    <span class="value">{{ interview.candidateEmail }}</span>
                  </div>
                  <div class="info-item" *ngIf="interview.candidatePhone">
                    <span class="label">Phone</span>
                    <span class="value">{{ interview.candidatePhone }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Position</span>
                    <span class="value">{{ interview.position }}</span>
                  </div>
                  <div class="info-item" *ngIf="interview.experience">
                    <span class="label">Experience</span>
                    <span class="value">{{ interview.experience }}</span>
                  </div>
                </div>

                <div class="skills-section" *ngIf="interview.skills && interview.skills.length > 0">
                  <span class="label">Skills</span>
                  <div class="skills-chips">
                    <mat-chip *ngFor="let skill of interview.skills">{{ skill }}</mat-chip>
                  </div>
                </div>
              </div>

              <mat-divider></mat-divider>

              <!-- Interview Details -->
              <div class="info-section">
                <div class="section-header">
                  <mat-icon>event</mat-icon>
                  <h3>Interview Details</h3>
                </div>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Interview ID</span>
                    <span class="value">#{{ interview.id }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Date & Time</span>
                    <span class="value">{{ interview.interviewDate | date:'medium' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Interview Type</span>
                    <mat-chip [ngClass]="getTypeChipClass(interview.interviewType)">
                      {{ getInterviewTypeLabel(interview.interviewType) }}
                    </mat-chip>
                  </div>
                  <div class="info-item">
                    <span class="label">Interviewer</span>
                    <span class="value">{{ interview.interviewer }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Location</span>
                    <span class="value">{{ interview.location }}</span>
                  </div>
                </div>

                <div class="meeting-link-box" *ngIf="interview.location.includes('Online') && interview.meetingLink">
                  <mat-icon>link</mat-icon>
                  <div class="link-content">
                    <span class="link-label">Meeting Link</span>
                    <a [href]="interview.meetingLink" target="_blank" class="link-url">
                      {{ interview.meetingLink }}
                    </a>
                  </div>
                  <button mat-icon-button (click)="copyLink(interview.meetingLink)">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                </div>
              </div>

              <mat-divider></mat-divider>

              <!-- Notes -->
              <div class="info-section" *ngIf="interview.notes">
                <div class="section-header">
                  <mat-icon>notes</mat-icon>
                  <h3>Interview Notes</h3>
                </div>
                <div class="notes-content">
                  {{ interview.notes }}
                </div>
              </div>

              <!-- Rating -->
              <div class="info-section" *ngIf="interview.rating">
                <div class="section-header">
                  <mat-icon>star</mat-icon>
                  <h3>Overall Rating</h3>
                </div>
                <div class="rating-display">
                  <div class="stars">
                    <mat-icon *ngFor="let star of [1,2,3,4,5]" [class.filled]="star <= interview.rating">
                      {{ star <= interview.rating ? 'star' : 'star_border' }}
                    </mat-icon>
                  </div>
                  <span class="rating-text">{{ getRatingText(interview.rating) }}</span>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Feedback Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">rate_review</mat-icon>
              Feedback
            </ng-template>
            <div class="tab-content">
              <div *ngIf="!interview.feedback" class="no-feedback">
                <mat-icon>feedback</mat-icon>
                <h3>No Feedback Available</h3>
                <p>Feedback will be displayed here once the interview is completed and reviewed.</p>
              </div>
              <div *ngIf="interview.feedback">
              <div class="feedback-section">
                <div class="section-header">
                  <mat-icon>assessment</mat-icon>
                  <h3>Skills Assessment</h3>
                </div>
                <div class="skills-assessment">
                  <div class="assessment-item">
                    <span class="assessment-label">Technical Skills</span>
                    <div class="assessment-bar">
                      <div class="bar-fill" [style.width.%]="(interview.feedback.technicalSkills / 5) * 100"></div>
                    </div>
                    <span class="assessment-value">{{ getSkillLevel(interview.feedback.technicalSkills) }}</span>
                  </div>
                  <div class="assessment-item">
                    <span class="assessment-label">Communication</span>
                    <div class="assessment-bar">
                      <div class="bar-fill" [style.width.%]="(interview.feedback.communication / 5) * 100"></div>
                    </div>
                    <span class="assessment-value">{{ getSkillLevel(interview.feedback.communication) }}</span>
                  </div>
                  <div class="assessment-item">
                    <span class="assessment-label">Problem Solving</span>
                    <div class="assessment-bar">
                      <div class="bar-fill" [style.width.%]="(interview.feedback.problemSolving / 5) * 100"></div>
                    </div>
                    <span class="assessment-value">{{ getSkillLevel(interview.feedback.problemSolving) }}</span>
                  </div>
                  <div class="assessment-item">
                    <span class="assessment-label">Cultural Fit</span>
                    <div class="assessment-bar">
                      <div class="bar-fill" [style.width.%]="(interview.feedback.culturalFit / 5) * 100"></div>
                    </div>
                    <span class="assessment-value">{{ getSkillLevel(interview.feedback.culturalFit) }}</span>
                  </div>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="feedback-section">
                <div class="section-header">
                  <mat-icon>trending_up</mat-icon>
                  <h3>Key Strengths</h3>
                </div>
                <p class="feedback-text">{{ interview.feedback.strengths }}</p>
              </div>

              <mat-divider></mat-divider>

              <div class="feedback-section">
                <div class="section-header">
                  <mat-icon>trending_down</mat-icon>
                  <h3>Areas for Improvement</h3>
                </div>
                <p class="feedback-text">{{ interview.feedback.improvements }}</p>
              </div>

              <mat-divider></mat-divider>

              <div class="feedback-section" *ngIf="interview.feedback.comments">
                <div class="section-header">
                  <mat-icon>comment</mat-icon>
                  <h3>Additional Comments</h3>
                </div>
                <p class="feedback-text">{{ interview.feedback.comments }}</p>
              </div>

              <div class="feedback-section" *ngIf="interview.feedback.decision">
                <div class="section-header">
                  <mat-icon>decision</mat-icon>
                  <h3>Interview Decision</h3>
                </div>
                <mat-chip [ngClass]="getDecisionClass(interview.feedback.decision)">
                  <mat-icon>{{ getDecisionIcon(interview.feedback.decision) }}</mat-icon>
                  {{ getDecisionText(interview.feedback.decision) }}
                </mat-chip>
              </div>
              </div>
            </div>
          </mat-tab>

          <!-- Documents Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">description</mat-icon>
              Documents
            </ng-template>
            <div class="tab-content">
              <div class="documents-section">
                <div class="document-item" *ngIf="interview.resumeUrl">
                  <mat-icon class="doc-icon">picture_as_pdf</mat-icon>
                  <div class="doc-info">
                    <span class="doc-name">Resume.pdf</span>
                    <span class="doc-meta">Uploaded on {{ interview.interviewDate | date:'shortDate' }}</span>
                  </div>
                  <button mat-icon-button (click)="downloadDocument(interview.resumeUrl)">
                    <mat-icon>download</mat-icon>
                  </button>
                </div>

                <div class="document-item" *ngIf="interview.coverLetter">
                  <mat-icon class="doc-icon">article</mat-icon>
                  <div class="doc-info">
                    <span class="doc-name">Cover Letter</span>
                    <span class="doc-meta">Uploaded on {{ interview.interviewDate | date:'shortDate' }}</span>
                  </div>
                  <button mat-icon-button (click)="viewCoverLetter()">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </div>

                <div class="no-documents" *ngIf="!interview.resumeUrl && !interview.coverLetter">
                  <mat-icon>folder_open</mat-icon>
                  <p>No documents available</p>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="closeDialog()">
          <mat-icon>close</mat-icon>
          Close
        </button>
        <button mat-stroked-button color="primary" (click)="sendEmail()">
          <mat-icon>email</mat-icon>
          Send Email
        </button>
        <button mat-raised-button color="primary" (click)="editInterview()">
          <mat-icon>edit</mat-icon>
          Edit Details
        </button>
      </div>
    </div>
  `,
  styles: [`
    .view-interview-dialog {
      width: 100%;
      max-width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
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
      flex: 1;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    ::ng-deep .mat-mdc-tab-group {
      width: 100%;
      height: 100%;
    }

    ::ng-deep .mat-mdc-tab-body-wrapper {
      width: 100%;
    }

    ::ng-deep .mat-mdc-tab-body-content {
      overflow-y: auto !important;
      max-height: calc(90vh - 280px);
      width: 100%;
      box-sizing: border-box;
    }

    .tab-icon {
      margin-right: 8px;
    }

    .tab-content {
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    /* Status Banner */
    .status-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .status-banner mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .status-banner.scheduled {
      background: #e7f3ff;
      color: #0d6efd;
    }

    .status-banner.completed {
      background: #d1f2eb;
      color: #198754;
    }

    .status-banner.cancelled {
      background: #f8d7da;
      color: #dc3545;
    }

    /* Info Sections */
    .info-section {
      margin-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      width: 100%;
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

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-size: 0.85rem;
      color: #6c757d;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 1rem;
      color: #212529;
      font-weight: 500;
    }

    /* Skills */
    .skills-section {
      margin-top: 16px;
    }

    .skills-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    /* Meeting Link */
    .meeting-link-box {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #e7f3ff;
      border: 2px solid #0d6efd;
      border-radius: 12px;
      padding: 16px;
      margin-top: 16px;
    }

    .meeting-link-box mat-icon:first-child {
      color: #0d6efd;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .link-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .link-label {
      font-size: 0.85rem;
      color: #6c757d;
      font-weight: 500;
    }

    .link-url {
      color: #0d6efd;
      text-decoration: none;
      font-weight: 500;
    }

    .link-url:hover {
      text-decoration: underline;
    }

    /* Notes */
    .notes-content {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      line-height: 1.6;
      color: #212529;
    }

    /* Rating Display */
    .rating-display {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stars {
      display: flex;
      gap: 4px;
    }

    .stars mat-icon {
      color: #ddd;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .stars mat-icon.filled {
      color: #ffc107;
    }

    .rating-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: #667eea;
    }

    /* Feedback Section */
    .feedback-section {
      margin-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .skills-assessment {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
    }

    .assessment-item {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .assessment-label {
      min-width: 140px;
      font-weight: 500;
      color: #495057;
    }

    .assessment-bar {
      flex: 1;
      height: 12px;
      background: #e9ecef;
      border-radius: 6px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .assessment-value {
      min-width: 80px;
      text-align: right;
      font-weight: 600;
      color: #667eea;
    }

    .feedback-text {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      line-height: 1.6;
      color: #212529;
      margin: 0;
    }

    /* No Feedback State */
    .no-feedback {
      text-align: center;
      padding: 64px 24px;
      color: #6c757d;
    }

    .no-feedback mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .no-feedback h3 {
      font-size: 1.3rem;
      margin: 0 0 12px 0;
      color: #495057;
    }

    .no-feedback p {
      font-size: 1rem;
      margin: 0;
      max-width: 400px;
      margin: 0 auto;
    }

    /* Decision Chip */
    .decision-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
    }

    .decision-chip mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .decision-proceed {
      background: #d1f2eb !important;
      color: #198754 !important;
    }

    .decision-hold {
      background: #fff3cd !important;
      color: #f57c00 !important;
    }

    .decision-reject {
      background: #f8d7da !important;
      color: #dc3545 !important;
    }

    /* Documents */
    .documents-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      width: 100%;
      box-sizing: border-box;
    }

    .doc-icon {
      color: #dc3545;
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .doc-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .doc-name {
      font-weight: 600;
      color: #212529;
    }

    .doc-meta {
      font-size: 0.85rem;
      color: #6c757d;
    }

    .no-documents {
      text-align: center;
      padding: 48px 24px;
      color: #6c757d;
    }

    .no-documents mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.3;
    }

    /* Chip Classes */
    .type-technical {
      background: #e7f3ff !important;
      color: #0d6efd !important;
    }

    .type-hr {
      background: #d1f2eb !important;
      color: #198754 !important;
    }

    .type-final {
      background: #fff3cd !important;
      color: #f57c00 !important;
    }

    /* Dialog Actions */
    .dialog-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    .dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .view-interview-dialog {
        width: 100vw;
        max-width: 100vw;
      }

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

      .tab-content {
        padding: 16px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .dialog-actions {
        flex-wrap: wrap;
        gap: 12px;
      }

      .dialog-actions button {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
})
export class ViewInterviewDialogComponent {
  interview: InterviewData;

  constructor(
    private dialogRef: MatDialogRef<ViewInterviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterviewData
  ) {
    this.interview = data;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'scheduled': 'schedule',
      'completed': 'check_circle',
      'cancelled': 'cancel',
      'rescheduled': 'event_repeat'
    };
    return icons[status.toLowerCase()] || 'event';
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getInterviewTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'technical': 'Technical Interview',
      'hr': 'HR Round',
      'final': 'Final Round'
    };
    return types[type] || type;
  }

  getTypeChipClass(type: string): string {
    return 'type-' + type.toLowerCase();
  }

  getRatingText(rating: number): string {
    const labels: { [key: number]: string } = {
      1: 'Poor',
      2: 'Below Average',
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return labels[rating] || 'Not Rated';
  }

  getSkillLevel(level: number): string {
    const levels: { [key: number]: string } = {
      1: 'Poor',
      2: 'Below Average',
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return levels[level] || '-';
  }

  getDecisionClass(decision: string): string {
    return 'decision-chip decision-' + decision.toLowerCase();
  }

  getDecisionIcon(decision: string): string {
    const icons: { [key: string]: string } = {
      'proceed': 'thumb_up',
      'hold': 'pause_circle',
      'reject': 'thumb_down'
    };
    return icons[decision] || 'help';
  }

  getDecisionText(decision: string): string {
    const texts: { [key: string]: string } = {
      'proceed': 'Proceed to Next Round',
      'hold': 'Keep on Hold',
      'reject': 'Rejected'
    };
    return texts[decision] || decision;
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      console.log('Link copied to clipboard!');
    });
  }

  downloadDocument(url: string): void {
    window.open(url, '_blank');
  }

  viewCoverLetter(): void {
    console.log('View cover letter');
  }

  sendEmail(): void {
    const mailto = `mailto:${this.interview.candidateEmail}?subject=Interview with ${this.interview.position}`;
    window.location.href = mailto;
  }

  editInterview(): void {
    this.dialogRef.close({ action: 'edit', data: this.interview });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
