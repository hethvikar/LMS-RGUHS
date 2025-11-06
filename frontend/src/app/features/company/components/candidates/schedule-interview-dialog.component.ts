import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-interview-dialog',
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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  template: `
    <div class="schedule-interview-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>event</mat-icon>
          Schedule Interview
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="candidate-info">
          <mat-icon>person</mat-icon>
          <div>
            <h3>{{ data.name }}</h3>
            <p>{{ data.appliedPosition }}</p>
          </div>
        </div>

        <form [formGroup]="interviewForm" class="interview-form">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Interview Title</mat-label>
              <input matInput formControlName="title" placeholder="e.g., Technical Round 1">
              <mat-icon matPrefix>title</mat-icon>
              <mat-error *ngIf="interviewForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row two-columns">
            <mat-form-field appearance="outline">
              <mat-label>Interview Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" placeholder="Select date">
              <mat-datepicker-toggle matPrefix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="interviewForm.get('date')?.hasError('required')">
                Date is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Interview Time</mat-label>
              <mat-select formControlName="time" placeholder="Select time">
                <mat-option *ngFor="let slot of timeSlots" [value]="slot">
                  {{ slot }}
                </mat-option>
              </mat-select>
              <mat-icon matPrefix>schedule</mat-icon>
              <mat-error *ngIf="interviewForm.get('time')?.hasError('required')">
                Time is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Duration (minutes)</mat-label>
              <mat-select formControlName="duration">
                <mat-option [value]="30">30 minutes</mat-option>
                <mat-option [value]="45">45 minutes</mat-option>
                <mat-option [value]="60">1 hour</mat-option>
                <mat-option [value]="90">1.5 hours</mat-option>
                <mat-option [value]="120">2 hours</mat-option>
              </mat-select>
              <mat-icon matPrefix>timer</mat-icon>
              <mat-error *ngIf="interviewForm.get('duration')?.hasError('required')">
                Duration is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Interview Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="video">Video Call</mat-option>
                <mat-option value="phone">Phone Call</mat-option>
                <mat-option value="in-person">In-Person</mat-option>
                <mat-option value="technical">Technical Assessment</mat-option>
              </mat-select>
              <mat-icon matPrefix>video_call</mat-icon>
              <mat-error *ngIf="interviewForm.get('type')?.hasError('required')">
                Type is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Meeting Link / Location</mat-label>
              <input matInput formControlName="location" placeholder="Enter meeting link or location">
              <mat-icon matPrefix>place</mat-icon>
              <mat-error *ngIf="interviewForm.get('location')?.hasError('required')">
                Location is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Interviewer(s)</mat-label>
              <mat-select formControlName="interviewers" multiple>
                <mat-option value="John Smith">John Smith (CTO)</mat-option>
                <mat-option value="Sarah Johnson">Sarah Johnson (Tech Lead)</mat-option>
                <mat-option value="Mike Wilson">Mike Wilson (Senior Developer)</mat-option>
                <mat-option value="Emily Davis">Emily Davis (HR Manager)</mat-option>
              </mat-select>
              <mat-icon matPrefix>people</mat-icon>
              <mat-error *ngIf="interviewForm.get('interviewers')?.hasError('required')">
                At least one interviewer is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes / Instructions</mat-label>
              <textarea matInput formControlName="notes" rows="4" 
                        placeholder="Additional notes or instructions for the candidate"></textarea>
              <mat-icon matPrefix>note</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Candidate Email</mat-label>
              <input matInput formControlName="candidateEmail" [value]="data.email" readonly>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="scheduleInterview()" [disabled]="interviewForm.invalid">
          <mat-icon>event_available</mat-icon>
          Schedule Interview
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .schedule-interview-dialog {
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
      gap: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 8px;
      margin-bottom: 24px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #667eea;
      }

      h3 {
        margin: 0 0 4px 0;
        font-size: 20px;
        color: #333;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }

    .interview-form {
      width: 100%;

      .form-row {
        margin-bottom: 16px;
        width: 100%;

        &.two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        mat-form-field {
          width: 100%;

          &.full-width {
            width: 100%;
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
  `]
})
export class ScheduleInterviewDialogComponent implements OnInit {
  interviewForm: FormGroup;
  timeSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleInterviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.interviewForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      duration: [60, Validators.required],
      type: ['video', Validators.required],
      location: ['', Validators.required],
      interviewers: [[], Validators.required],
      notes: [''],
      candidateEmail: [this.data.email]
    });
  }

  ngOnInit(): void {
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    const slots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        slots.push(`${displayHour}:${displayMinute} ${period}`);
      }
    }
    this.timeSlots = slots;
  }

  scheduleInterview(): void {
    if (this.interviewForm.valid) {
      const interviewData = {
        ...this.interviewForm.value,
        candidate: this.data
      };
      this.dialogRef.close(interviewData);
    }
  }
}
