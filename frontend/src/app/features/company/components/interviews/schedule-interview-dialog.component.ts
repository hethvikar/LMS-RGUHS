import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedPosition: string;
  appliedDate: Date;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected' | 'hired';
  experience: string;
  skills: string[];
  resumeUrl?: string;
  coverLetter?: string;
}

@Component({
  selector: 'app-schedule-interview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  template: `
    <div class="schedule-dialog">
      <div class="dialog-header">
        <h1 class="dialog-title">Schedule Interview</h1>
        <p class="dialog-subtitle">Select candidate and schedule interview details</p>
      </div>

      <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="schedule-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Select Candidate</mat-label>
            <mat-select formControlName="candidateId">
              <mat-option *ngFor="let candidate of candidates" [value]="candidate.id">
                {{ candidate.name }} - {{ candidate.appliedPosition }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Interview Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="interviewDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Interview Time</mat-label>
            <mat-select formControlName="interviewTime">
              <mat-option *ngFor="let time of timeSlots" [value]="time">
                {{ time }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Interview Type</mat-label>
            <mat-select formControlName="interviewType">
              <mat-option value="technical">Technical Interview</mat-option>
              <mat-option value="hr">HR Round</mat-option>
              <mat-option value="final">Final Round</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Interviewer</mat-label>
            <input matInput formControlName="interviewer" placeholder="e.g., John Smith">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Location</mat-label>
            <mat-select formControlName="location">
              <mat-option value="Online (Zoom)">Online (Zoom)</mat-option>
              <mat-option value="Online (Teams)">Online (Teams)</mat-option>
              <mat-option value="Company Office">Company Office</mat-option>
              <mat-option value="Hybrid">Hybrid</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="form-field full-width">
          <mat-label>Notes (Optional)</mat-label>
          <textarea matInput formControlName="notes" rows="3"
                    placeholder="Any additional notes or preparation requirements..."></textarea>
        </mat-form-field>

        <div class="form-actions">
          <button mat-button type="button" (click)="closeDialog()">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!scheduleForm.valid">
            Schedule Interview
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .schedule-dialog {
      max-width: 700px;
      padding: 0;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 12px 12px 0 0;
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

    .schedule-form {
      padding: 32px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-field {
      flex: 1;
    }

    .form-field.full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }

    .form-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .dialog-header {
        padding: 24px;
      }

      .dialog-title {
        font-size: 1.5rem;
      }

      .schedule-form {
        padding: 24px;
      }

      .form-row {
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ScheduleInterviewDialogComponent {
  scheduleForm: FormGroup;
  timeSlots: string[] = [];
  candidates: Candidate[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-234-567-8900',
      appliedPosition: 'Frontend Developer',
      appliedDate: new Date('2024-01-15'),
      status: 'shortlisted',
      experience: '3-5 years',
      skills: ['React', 'Angular', 'TypeScript']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-234-567-8901',
      appliedPosition: 'Backend Developer',
      appliedDate: new Date('2024-01-20'),
      status: 'shortlisted',
      experience: '2-3 years',
      skills: ['Node.js', 'Python', 'MongoDB']
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1-234-567-8902',
      appliedPosition: 'UI/UX Designer',
      appliedDate: new Date('2024-01-18'),
      status: 'reviewed',
      experience: '4-6 years',
      skills: ['Figma', 'Sketch', 'Adobe XD']
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '+1-234-567-8903',
      appliedPosition: 'Full Stack Developer',
      appliedDate: new Date('2024-01-22'),
      status: 'new',
      experience: '1-2 years',
      skills: ['JavaScript', 'React', 'Node.js']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ScheduleInterviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    // Generate time slots from 8:00 AM to 6:00 PM in 30-minute intervals
    this.timeSlots = this.generateTimeSlots();
    
    this.scheduleForm = this.fb.group({
      candidateId: ['', [Validators.required]],
      interviewDate: ['', [Validators.required]],
      interviewTime: ['', [Validators.required]],
      interviewType: ['technical', [Validators.required]],
      interviewer: ['', [Validators.required]],
      location: ['Online (Zoom)', [Validators.required]],
      notes: ['']
    });
  }

  generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        const timeString = `${displayHour}:${displayMinute} ${period}`;
        const valueString = `${hour.toString().padStart(2, '0')}:${displayMinute}`;
        slots.push(timeString);
      }
    }
    return slots;
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const formValue = this.scheduleForm.value;
      const selectedCandidate = this.candidates.find(c => c.id === formValue.candidateId);

      if (selectedCandidate) {
        // Combine date and time
        const interviewDateTime = new Date(formValue.interviewDate);
        
        // Parse time from format "HH:MM AM/PM"
        const timeStr = formValue.interviewTime;
        const [time, period] = timeStr.split(' ');
        const [hourStr, minuteStr] = time.split(':');
        let hours = parseInt(hourStr);
        const minutes = parseInt(minuteStr);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        interviewDateTime.setHours(hours, minutes);

        const interviewData = {
          candidate: selectedCandidate,
          interviewDate: interviewDateTime,
          interviewType: formValue.interviewType,
          interviewer: formValue.interviewer,
          location: formValue.location,
          notes: formValue.notes
        };

        this.dialogRef.close({ action: 'schedule', data: interviewData });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}