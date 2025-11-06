import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ViewProfileDialogComponent } from './view-profile-dialog.component';
import { ScheduleInterviewDialogComponent } from './schedule-interview-dialog.component';
import { UpdateStatusDialogComponent } from './update-status-dialog.component';
import { DownloadResumeDialogComponent } from './download-resume-dialog.component';
import { MakeOfferDialogComponent } from './make-offer-dialog.component';

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
  selector: 'app-company-candidates',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CompanyCandidatesComponent implements OnInit {
  candidates: Candidate[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-234-567-8900',
      appliedPosition: 'Frontend Developer',
      appliedDate: new Date('2024-01-15'),
      status: 'shortlisted',
      experience: '3 years',
      skills: ['JavaScript', 'React', 'Angular', 'TypeScript'],
      resumeUrl: 'resume-john.pdf'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-234-567-8901',
      appliedPosition: 'Backend Developer',
      appliedDate: new Date('2024-01-12'),
      status: 'interviewed',
      experience: '4 years',
      skills: ['Node.js', 'Python', 'MongoDB', 'AWS'],
      resumeUrl: 'resume-jane.pdf'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1-234-567-8902',
      appliedPosition: 'UI/UX Designer',
      appliedDate: new Date('2024-01-10'),
      status: 'new',
      experience: '2 years',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      resumeUrl: 'resume-bob.pdf'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '+1-234-567-8903',
      appliedPosition: 'Full Stack Developer',
      appliedDate: new Date('2024-01-08'),
      status: 'rejected',
      experience: '5 years',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      resumeUrl: 'resume-alice.pdf'
    }
  ];

  displayedColumns: string[] = ['name', 'position', 'appliedDate', 'status', 'experience', 'actions'];
  shortlistedColumns: string[] = ['name', 'position', 'appliedDate', 'experience', 'actions'];
  interviewedColumns: string[] = ['name', 'position', 'appliedDate', 'experience', 'actions'];

  ngOnInit() {
    // Load candidates from API
  }

  get shortlistedCandidates(): Candidate[] {
    return this.candidates.filter(candidate => candidate.status === 'shortlisted');
  }

  get interviewedCandidates(): Candidate[] {
    return this.candidates.filter(candidate => candidate.status === 'interviewed');
  }

  getStatusCount(status: string): number {
    return this.candidates.filter(candidate => candidate.status === status).length;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new': 'New',
      'reviewed': 'Reviewed',
      'shortlisted': 'Shortlisted',
      'interviewed': 'Interviewed',
      'offered': 'Offered',
      'rejected': 'Rejected',
      'hired': 'Hired'
    };
    return statusMap[status] || status;
  }

  constructor(private dialog: MatDialog) {}

  viewCandidate(candidate: Candidate) {
    const dialogRef = this.dialog.open(ViewProfileDialogComponent, {
      data: candidate,
      panelClass: 'view-profile-dialog-container',
      width: '80vw',
      maxWidth: '80vw',
      height: 'auto',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'scheduleInterview') {
          this.scheduleInterview(result.candidate);
        } else if (result.action === 'updateStatus') {
          this.updateStatus(result.candidate);
        }
      }
    });
  }

  downloadResume(candidate: Candidate) {
    const dialogRef = this.dialog.open(DownloadResumeDialogComponent, {
      data: candidate,
      panelClass: 'download-resume-dialog-container',
      width: '80vw',
      maxWidth: '80vw',
      height: 'auto',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'viewProfile') {
          this.viewCandidate(result.candidate);
        } else if (result.action === 'scheduleInterview') {
          this.scheduleInterview(result.candidate);
        } else if (result.action === 'updateStatus') {
          this.updateStatus(result.candidate);
        }
      }
    });
  }

  scheduleInterview(candidate: Candidate) {
    const dialogRef = this.dialog.open(ScheduleInterviewDialogComponent, {
      data: candidate,
      panelClass: 'schedule-interview-dialog-container',
      width: '80vw',
      maxWidth: '80vw',
      height: 'auto',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Interview scheduled:', result);
        // Handle interview scheduling
        // Update candidate status to 'interviewed'
        candidate.status = 'interviewed';
      }
    });
  }

  updateStatus(candidate: Candidate) {
    const dialogRef = this.dialog.open(UpdateStatusDialogComponent, {
      data: candidate,
      panelClass: 'update-status-dialog-container',
      width: '80vw',
      maxWidth: '80vw',
      height: 'auto',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Status updated:', result);
        // Handle status update
        candidate.status = result.newStatus;
        
        // If notification is enabled, send email
        if (result.notifyCandidate) {
          console.log('Sending notification to candidate');
        }
      }
    });
  }

  makeOffer(candidate: Candidate) {
    const dialogRef = this.dialog.open(MakeOfferDialogComponent, {
      data: candidate,
      panelClass: 'make-offer-dialog-container',
      width: '80vw',
      maxWidth: '80vw',
      height: 'auto',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Offer sent:', result);
        // Handle offer sending
        candidate.status = 'offered';
        
        // Send offer email to candidate
        console.log('Sending offer email to:', candidate.email);
      }
    });
  }
}