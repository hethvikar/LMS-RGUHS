import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-schedule-multi-round-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="schedule-dialog">
      <h2 mat-dialog-title>
        <mat-icon>event</mat-icon>
        Schedule Interview - {{ getRoundLabel() }}
      </h2>

      <mat-dialog-content>
        <div class="candidate-info">
          <h3>Candidate Information</h3>
          <p><strong>Name:</strong> {{ data.candidate.candidateName }}</p>
          <p><strong>Position:</strong> {{ data.candidate.position }}</p>
          <p><strong>Round:</strong> {{ data.round.roundNumber }} of {{ data.candidate.totalRounds }}</p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Interview Date</mat-label>
          <input matInput [matDatepicker]="datePicker" [(ngModel)]="interviewDate" required>
          <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
          <mat-datepicker #datePicker></mat-datepicker>
        </mat-form-field>

        <div class="time-row">
          <mat-form-field appearance="outline">
            <mat-label>Hour</mat-label>
            <mat-select [(ngModel)]="hour" required>
              <mat-option *ngFor="let h of hours" [value]="h">{{ h }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Minute</mat-label>
            <mat-select [(ngModel)]="minute" required>
              <mat-option value="00">00</mat-option>
              <mat-option value="15">15</mat-option>
              <mat-option value="30">30</mat-option>
              <mat-option value="45">45</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Period</mat-label>
            <mat-select [(ngModel)]="period" required>
              <mat-option value="AM">AM</mat-option>
              <mat-option value="PM">PM</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Interviewer</mat-label>
          <mat-select [(ngModel)]="interviewer" required>
            <mat-option value="Sarah Johnson">Sarah Johnson (Tech Lead)</mat-option>
            <mat-option value="Mike Chen">Mike Chen (HR Manager)</mat-option>
            <mat-option value="Dr. Emily Davis">Dr. Emily Davis (CTO)</mat-option>
            <mat-option value="Robert Smith">Robert Smith (CEO)</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Location / Platform</mat-label>
          <mat-select [(ngModel)]="location" required>
            <mat-option value="Online (Zoom)">Online (Zoom)</mat-option>
            <mat-option value="Online (Teams)">Online (Microsoft Teams)</mat-option>
            <mat-option value="Online (Meet)">Online (Google Meet)</mat-option>
            <mat-option value="Company Office">Company Office</mat-option>
            <mat-option value="Phone Interview">Phone Interview</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Additional Notes (Optional)</mat-label>
          <textarea matInput [(ngModel)]="notes" rows="3"
                    placeholder="Topics to cover, special instructions, etc."></textarea>
        </mat-form-field>

        <div class="notification-info">
          <mat-icon>notifications_active</mat-icon>
          <p>Candidate will receive automated email and SMS notification with interview details.</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="schedule()" 
                [disabled]="!interviewDate || !hour || !minute || !interviewer || !location">
          <mat-icon>event_available</mat-icon>
          Schedule Interview
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .schedule-dialog {
      min-width: 600px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #667eea;
    }

    .candidate-info {
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

    .time-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .notification-info {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
      margin-top: 16px;

      mat-icon {
        color: #2196f3;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #1976d2;
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
export class ScheduleMultiRoundDialogComponent {
  interviewDate: Date | null = null;
  hour: string = '10';
  minute: string = '00';
  period: string = 'AM';
  interviewer: string = '';
  location: string = '';
  notes: string = '';

  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  constructor(
    private dialogRef: MatDialogRef<ScheduleMultiRoundDialogComponent>,
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

  schedule() {
    if (!this.interviewDate || !this.hour || !this.minute || !this.interviewer || !this.location) {
      return;
    }

    // Combine date and time
    const scheduledDateTime = new Date(this.interviewDate);
    let hourNum = parseInt(this.hour);
    if (this.period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (this.period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }
    scheduledDateTime.setHours(hourNum, parseInt(this.minute), 0, 0);

    this.dialogRef.close({
      action: 'scheduled',
      date: scheduledDateTime,
      interviewer: this.interviewer,
      location: this.location,
      notes: this.notes
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
