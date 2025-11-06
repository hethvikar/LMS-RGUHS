import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ScheduleInterviewDialogComponent } from './schedule-interview-dialog.component';
import { JoinInterviewDialogComponent } from './join-interview-dialog.component';
import { AddFeedbackDialogComponent } from './add-feedback-dialog.component';
import { ViewInterviewDialogComponent } from './view-interview-dialog.component';
import { CalendarModule, CalendarUtils } from 'angular-calendar';
import { CalendarEvent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DateAdapter } from 'angular-calendar';

interface CompanyInterview {
  id: number;
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewDate: Date;
  interviewType: 'technical' | 'hr' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  interviewer: string;
  location: string;
  notes?: string;
  feedback?: string;
  rating?: number;
}

@Component({
  selector: 'app-company-interviews',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatTabsModule,
    CalendarModule
  ],
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class CompanyInterviewsComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  interviews: CompanyInterview[] = [
    {
      id: 1,
      candidateName: 'John Doe',
      candidateEmail: 'john.doe@example.com',
      position: 'Frontend Developer',
      interviewDate: new Date('2025-10-15T10:00:00'),
      interviewType: 'technical',
      status: 'scheduled',
      interviewer: 'Sarah Johnson',
      location: 'Online (Zoom)',
      notes: 'Technical interview for React and Angular skills'
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      candidateEmail: 'jane.smith@example.com',
      position: 'Backend Developer',
      interviewDate: new Date('2025-10-10T14:30:00'),
      interviewType: 'hr',
      status: 'completed',
      interviewer: 'Mike Chen',
      location: 'Company Office',
      feedback: 'Excellent communication skills and team fit',
      rating: 4
    },
    {
      id: 3,
      candidateName: 'Bob Johnson',
      candidateEmail: 'bob.johnson@example.com',
      position: 'UI/UX Designer',
      interviewDate: new Date('2025-11-05T11:00:00'),
      interviewType: 'final',
      status: 'scheduled',
      interviewer: 'Dr. Emily Davis',
      location: 'Online (Teams)',
      notes: 'Final round with design team lead'
    }
  ];

  displayedColumns: string[] = ['candidate', 'position', 'datetime', 'type', 'status', 'interviewer', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load interviews from API
    this.loadCalendarEvents();
  }

  loadCalendarEvents() {
    this.events = this.interviews.map(interview => ({
      id: interview.id,
      start: new Date(interview.interviewDate),
      end: new Date(interview.interviewDate.getTime() + 60 * 60 * 1000), // 1 hour duration
      title: `${interview.candidateName} - ${this.getTypeText(interview.interviewType)}`,
      color: this.getEventColor(interview.status),
      meta: interview
    }));
  }

  getEventColor(status: string) {
    switch (status) {
      case 'scheduled':
        return { primary: '#2196f3', secondary: '#e3f2fd' };
      case 'completed':
        return { primary: '#4caf50', secondary: '#e8f5e8' };
      case 'cancelled':
        return { primary: '#f44336', secondary: '#ffebee' };
      case 'rescheduled':
        return { primary: '#ff9800', secondary: '#fff3e0' };
      default:
        return { primary: '#9e9e9e', secondary: '#f5f5f5' };
    }
  }

  getStatusCount(status: string): number {
    return this.interviews.filter(interview => interview.status === status).length;
  }

  getTodaysInterviews(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.interviews.filter(interview =>
      interview.interviewDate >= today && interview.interviewDate < tomorrow
    ).length;
  }

  getUpcomingInterviews(): number {
    const now = new Date();
    return this.interviews.filter(interview =>
      interview.interviewDate > now && interview.status === 'scheduled'
    ).length;
  }

  getTypeClass(type: string): string {
    return type.toLowerCase();
  }

  getTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'technical': 'Technical',
      'hr': 'HR Round',
      'final': 'Final Round'
    };
    return typeMap[type] || type;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'Scheduled',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'rescheduled': 'Rescheduled'
    };
    return statusMap[status] || status;
  }

  scheduleNewInterview() {
    const dialogRef = this.dialog.open(ScheduleInterviewDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'schedule') {
        // Add the new interview to the list
        const newInterview: CompanyInterview = {
          id: this.interviews.length + 1,
          candidateName: result.data.candidate.name,
          candidateEmail: result.data.candidate.email,
          position: result.data.candidate.appliedPosition,
          interviewDate: result.data.interviewDate,
          interviewType: result.data.interviewType as 'technical' | 'hr' | 'final',
          status: 'scheduled',
          interviewer: result.data.interviewer,
          location: result.data.location,
          notes: result.data.notes
        };

        this.interviews.push(newInterview);
        this.loadCalendarEvents(); // Refresh calendar events
        console.log('New interview scheduled:', newInterview);
      }
    });
  }

  viewInterview(interview: CompanyInterview) {
    const dialogRef = this.dialog.open(ViewInterviewDialogComponent, {
      width: '100%',
      maxWidth: '100vw',
      maxHeight: '90vh',
      height: 'auto',
      data: interview,
      panelClass: 'view-interview-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        console.log('Edit interview:', result.data);
        // Open edit dialog or navigate to edit page
      }
    });
  }

  joinInterview(interview: CompanyInterview) {
    const dialogRef = this.dialog.open(JoinInterviewDialogComponent, {
      width: '100%',
      maxWidth: '100vw',
      height: 'auto',
      data: interview,
      panelClass: 'join-interview-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'joined') {
        console.log('Interview joined successfully');
        // You can add additional logic here, like updating the interview status
      }
    });
  }

  addFeedback(interview: CompanyInterview) {
    const dialogRef = this.dialog.open(AddFeedbackDialogComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: interview,
      panelClass: 'feedback-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'submitted') {
        console.log('Feedback submitted:', result.data);
        // Update the interview with feedback
        interview.feedback = result.data.feedback;
        interview.rating = result.data.feedback.overallRating;
        // You can also call a service to save the feedback to the backend
      }
    });
  }

  rescheduleInterview(interview: CompanyInterview) {
    console.log('Reschedule interview:', interview);
    // Open reschedule dialog
  }

  cancelInterview(interview: CompanyInterview) {
    console.log('Cancel interview:', interview);
    // Open cancel confirmation dialog
  }

  dayClicked({ day, sourceEvent }: { day: any; sourceEvent: MouseEvent | KeyboardEvent }): void {
    if (day.events && day.events.length > 0) {
      console.log('Day clicked:', day.date, day.events);
    }
  }

  eventClicked({ event, sourceEvent }: { event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent }): void {
    console.log('Event clicked:', event);
    if (event.meta) {
      this.viewInterview(event.meta);
    }
  }

  closeOpenMonthViewDay() {
    // This would close any open day in month view
  }

  previousMonth() {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.viewDate = newDate;
  }

  nextMonth() {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.viewDate = newDate;
  }
}