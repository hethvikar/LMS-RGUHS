import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface InterviewData {
  id: number;
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewDate: Date;
  interviewType: string;
  interviewer: string;
  location: string;
  meetingLink?: string;
  notes?: string;
}

@Component({
  selector: 'app-join-interview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="join-interview-dialog">
      <div class="dialog-header">
        <mat-icon class="header-icon">video_call</mat-icon>
        <h1 class="dialog-title">Join Interview</h1>
        <button mat-icon-button class="close-button" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="interview-info-card">
          <div class="info-row">
            <mat-icon>person</mat-icon>
            <div class="info-content">
              <span class="label">Candidate</span>
              <span class="value">{{ interview.candidateName }}</span>
            </div>
          </div>

          <div class="info-row">
            <mat-icon>work</mat-icon>
            <div class="info-content">
              <span class="label">Position</span>
              <span class="value">{{ interview.position }}</span>
            </div>
          </div>

          <div class="info-row">
            <mat-icon>event</mat-icon>
            <div class="info-content">
              <span class="label">Date & Time</span>
              <span class="value">{{ interview.interviewDate | date:'medium' }}</span>
            </div>
          </div>

          <div class="info-row">
            <mat-icon>category</mat-icon>
            <div class="info-content">
              <span class="label">Interview Type</span>
              <span class="value">{{ getInterviewTypeLabel(interview.interviewType) }}</span>
            </div>
          </div>

          <div class="info-row">
            <mat-icon>person_outline</mat-icon>
            <div class="info-content">
              <span class="label">Interviewer</span>
              <span class="value">{{ interview.interviewer }}</span>
            </div>
          </div>

          <div class="info-row">
            <mat-icon>place</mat-icon>
            <div class="info-content">
              <span class="label">Location</span>
              <span class="value">{{ interview.location }}</span>
            </div>
          </div>
        </div>

        <div class="meeting-link-section" *ngIf="interview.location.includes('Online')">
          <div class="link-header">
            <mat-icon>link</mat-icon>
            <h3>Meeting Link</h3>
          </div>
          <div class="link-box">
            <input 
              type="text" 
              readonly 
              [value]="getMeetingLink()" 
              #linkInput
              class="link-input">
            <button mat-icon-button (click)="copyLink(linkInput.value)" matTooltip="Copy Link">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
          <p class="link-note">
            <mat-icon>info</mat-icon>
            Share this link with the candidate before the interview
          </p>
        </div>

        <div class="notes-section" *ngIf="interview.notes">
          <div class="notes-header">
            <mat-icon>notes</mat-icon>
            <h3>Interview Notes</h3>
          </div>
          <p class="notes-content">{{ interview.notes }}</p>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button mat-stroked-button class="action-btn">
              <mat-icon>description</mat-icon>
              View Resume
            </button>
            <button mat-stroked-button class="action-btn">
              <mat-icon>email</mat-icon>
              Send Email
            </button>
            <button mat-stroked-button class="action-btn">
              <mat-icon>event_repeat</mat-icon>
              Reschedule
            </button>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="closeDialog()">
          <mat-icon>close</mat-icon>
          Close
        </button>
        <button mat-raised-button color="primary" (click)="joinMeeting()" class="join-button">
          <mat-icon>video_call</mat-icon>
          Join Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    .join-interview-dialog {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }

    .dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .dialog-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0;
      flex: 1;
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      color: white;
    }

    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
      width: 100%;
      box-sizing: border-box;
    }

    .interview-info-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row mat-icon {
      color: #667eea;
      margin-top: 2px;
    }

    .info-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 0.85rem;
      color: #6c757d;
      font-weight: 500;
    }

    .value {
      font-size: 1rem;
      color: #212529;
      font-weight: 500;
    }

    .meeting-link-section {
      background: #e8f4fd;
      border: 1px solid #b3d9f5;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .link-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      width: 100%;
    }

    .link-header mat-icon {
      color: #0d6efd;
    }

    .link-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #0d6efd;
    }

    .link-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 2px solid #0d6efd;
      border-radius: 8px;
      padding: 4px 4px 4px 16px;
    }

    .link-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.95rem;
      color: #0d6efd;
      background: transparent;
      padding: 8px 0;
    }

    .link-note {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0 0 0;
      font-size: 0.85rem;
      color: #495057;
    }

    .link-note mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #0d6efd;
    }

    .notes-section {
      background: #fff8e1;
      border: 1px solid #ffd54f;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .notes-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      width: 100%;
    }

    .notes-header mat-icon {
      color: #f57c00;
    }

    .notes-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #f57c00;
    }

    .notes-content {
      margin: 0;
      font-size: 0.95rem;
      color: #212529;
      line-height: 1.6;
    }

    .quick-actions {
      margin-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .quick-actions h3 {
      font-size: 1.1rem;
      margin: 0 0 16px 0;
      color: #212529;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
    }

    .action-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .dialog-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
      width: 100%;
      box-sizing: border-box;
    }

    .dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .join-button {
      font-size: 1.1rem;
      padding: 12px 32px;
    }

    .join-button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    /* Scrollbar Styling */
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
        padding: 16px;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }

      .dialog-actions {
        flex-direction: column;
        gap: 12px;
      }

      .dialog-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class JoinInterviewDialogComponent {
  interview: InterviewData;

  constructor(
    private dialogRef: MatDialogRef<JoinInterviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterviewData
  ) {
    this.interview = data;
  }

  getInterviewTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'technical': 'Technical Interview',
      'hr': 'HR Round',
      'final': 'Final Round'
    };
    return types[type] || type;
  }

  getMeetingLink(): string {
    // Generate or retrieve the meeting link
    if (this.interview.meetingLink) {
      return this.interview.meetingLink;
    }
    // Generate a sample link based on location
    if (this.interview.location.includes('Zoom')) {
      return `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
    } else if (this.interview.location.includes('Teams')) {
      return `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(7)}`;
    }
    return 'https://meet.example.com/interview-' + this.interview.id;
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      // You could add a snackbar notification here
      console.log('Link copied to clipboard!');
    });
  }

  joinMeeting(): void {
    const meetingLink = this.getMeetingLink();
    // Open the meeting link in a new window
    window.open(meetingLink, '_blank');
    this.dialogRef.close({ action: 'joined' });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
