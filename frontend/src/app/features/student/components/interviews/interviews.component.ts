import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ViewInterviewFeedbackComponent } from './view-interview-feedback/view-interview-feedback.component';

interface Interview {
  id: number;
  companyName: string;
  position: string;
  interviewDate: Date;
  interviewType: 'technical' | 'hr' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string;
  interviewer: string;
  notes?: string;
}

@Component({
  selector: 'app-student-interviews',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule
  ],
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class StudentInterviewsComponent implements OnInit {
  interviews: Interview[] = [
    {
      id: 1,
      companyName: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      interviewDate: new Date('2024-01-25T10:00:00'),
      interviewType: 'technical',
      status: 'scheduled',
      location: 'Online (Zoom)',
      interviewer: 'Sarah Johnson',
      notes: 'Prepare for React and Angular questions'
    },
    {
      id: 2,
      companyName: 'Data Systems Corp',
      position: 'Full Stack Developer',
      interviewDate: new Date('2024-01-20T14:30:00'),
      interviewType: 'hr',
      status: 'completed',
      location: 'Company Office',
      interviewer: 'Mike Chen',
      notes: 'Great discussion about company culture and team dynamics. Follow-up expected soon.'
    },
    {
      id: 3,
      companyName: 'Innovation Labs',
      position: 'Software Engineer',
      interviewDate: new Date('2024-01-18T11:00:00'),
      interviewType: 'final',
      status: 'completed',
      location: 'Online (Teams)',
      interviewer: 'Dr. Emily Davis',
      notes: 'Technical deep-dive interview. Covered system design and problem-solving approaches.'
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load interviews from API
  }

  get upcomingInterviews(): Interview[] {
    const now = new Date();
    return this.interviews.filter(interview =>
      interview.interviewDate > now && interview.status === 'scheduled'
    );
  }

  get pastInterviews(): Interview[] {
    const now = new Date();
    return this.interviews.filter(interview =>
      interview.interviewDate <= now || interview.status !== 'scheduled'
    );
  }

  getInterviewTypeClass(type: string): string {
    return type.toLowerCase();
  }

  getInterviewTypeText(type: string): string {
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
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  joinInterview(interview: Interview) {
    console.log('Joining interview:', interview);
    // Open video conference link
  }

  rescheduleInterview(interview: Interview) {
    console.log('Rescheduling interview:', interview);
    // Open reschedule dialog
  }

  viewFeedback(interview: Interview) {
    const dialogRef = this.dialog.open(ViewInterviewFeedbackComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { interview },
      panelClass: 'view-feedback-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after dialog closes
      if (result) {
        console.log('Feedback dialog closed with result:', result);
      }
    });
  }
}