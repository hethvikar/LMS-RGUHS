import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ApplicationDetails {
  id: number;
  companyName: string;
  companyLogo?: string;
  position: string;
  appliedDate: Date;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  applicationId: string;
  jobDescription?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  requiredSkills?: string[];
  applicationNotes?: string;
  timeline?: {
    date: Date;
    status: string;
    description: string;
  }[];
  interviewDetails?: {
    date?: Date;
    time?: string;
    mode?: string;
    venue?: string;
    interviewers?: string[];
  };
  rejectionReason?: string;
  offerDetails?: {
    salary: string;
    joiningDate: Date;
    position: string;
  };
}

@Component({
  selector: 'app-view-application-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './view-application-details.component.html',
  styleUrls: ['./view-application-details.component.scss']
})
export class ViewApplicationDetailsComponent {
  application: ApplicationDetails;

  constructor(
    public dialogRef: MatDialogRef<ViewApplicationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: any }
  ) {
    // Enhance the application data with additional details
    this.application = {
      ...data.application,
      jobDescription: 'We are looking for a talented Frontend Developer to join our dynamic team. The ideal candidate should have strong experience with Angular, TypeScript, and modern web development practices.',
      location: 'Bangalore, Karnataka',
      employmentType: 'Full-time',
      salary: '₹6,00,000 - ₹10,00,000 per annum',
      requiredSkills: ['Angular', 'TypeScript', 'JavaScript', 'HTML/CSS', 'RxJS', 'Git'],
      applicationNotes: 'Your application has been submitted successfully and is under review by the hiring team.',
      timeline: [
        {
          date: new Date('2024-01-15'),
          status: 'applied',
          description: 'Application submitted successfully'
        },
        {
          date: new Date('2024-01-18'),
          status: 'reviewed',
          description: 'Application is under review'
        }
      ]
    };

    // Add interview details if status is interview
    if (this.application.status === 'interview') {
      this.application.interviewDetails = {
        date: new Date('2024-01-25'),
        time: '10:00 AM',
        mode: 'Virtual',
        venue: 'Microsoft Teams',
        interviewers: ['Mr. Rajesh Kumar (Technical Lead)', 'Ms. Priya Sharma (HR Manager)']
      };
      this.application.timeline?.push({
        date: new Date('2024-01-20'),
        status: 'interview',
        description: 'Interview scheduled for Jan 25, 2024'
      });
    }

    // Add offer details if status is accepted
    if (this.application.status === 'accepted') {
      this.application.offerDetails = {
        salary: '₹8,50,000 per annum',
        joiningDate: new Date('2024-02-15'),
        position: this.application.position
      };
    }

    // Add rejection reason if status is rejected
    if (this.application.status === 'rejected') {
      this.application.rejectionReason = 'Thank you for your interest in our company. After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending Review',
      'reviewed': 'Under Review',
      'interview': 'Interview Scheduled',
      'rejected': 'Rejected',
      'accepted': 'Offer Accepted'
    };
    return statusMap[status] || status;
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'schedule',
      'reviewed': 'rate_review',
      'interview': 'event',
      'rejected': 'cancel',
      'accepted': 'check_circle'
    };
    return iconMap[status] || 'info';
  }

  withdrawApplication(): void {
    // In real app, call API to withdraw application
    console.log('Withdrawing application:', this.application.id);
    this.dialogRef.close({ action: 'withdraw', applicationId: this.application.id });
  }

  downloadOfferLetter(): void {
    console.log('Downloading offer letter for application:', this.application.id);
    // In real app, download offer letter
  }

  acceptOffer(): void {
    console.log('Accepting offer for application:', this.application.id);
    this.dialogRef.close({ action: 'accept', applicationId: this.application.id });
  }

  declineOffer(): void {
    console.log('Declining offer for application:', this.application.id);
    this.dialogRef.close({ action: 'decline', applicationId: this.application.id });
  }
}
