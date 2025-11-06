import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Application {
  id: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  appliedDate: Date;
  status: 'pending' | 'shortlisted' | 'rejected' | 'interview-scheduled' | 'offered' | 'hired';
  resumeUrl?: string;
  coverLetter?: string;
  experience: string;
  education: string;
  skills: string[];
  currentLocation: string;
  expectedSalary?: string;
  noticePeriod?: string;
  score?: number;
}

@Component({
  selector: 'app-view-application-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './view-application-popup.component.html',
  styleUrls: ['./view-application-popup.component.scss']
})
export class ViewApplicationPopupComponent implements OnInit {
  jobTitle: string;
  jobId: number;

  displayedColumns: string[] = ['candidate', 'appliedDate', 'experience', 'status', 'score', 'actions'];

  // Mock data - in real app, this would come from API based on jobId
  applications: Application[] = [
    {
      id: 1,
      candidateName: 'Rajesh Kumar',
      candidateEmail: 'rajesh.kumar@email.com',
      candidatePhone: '+91-9876543210',
      appliedDate: new Date('2024-01-20'),
      status: 'shortlisted',
      experience: '4 years',
      education: 'B.Tech in Computer Science',
      skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML/CSS'],
      currentLocation: 'Bangalore',
      expectedSalary: '₹10,00,000',
      noticePeriod: '30 days',
      score: 85,
      resumeUrl: '/assets/resumes/rajesh-kumar.pdf'
    },
    {
      id: 2,
      candidateName: 'Priya Sharma',
      candidateEmail: 'priya.sharma@email.com',
      candidatePhone: '+91-9876543211',
      appliedDate: new Date('2024-01-19'),
      status: 'interview-scheduled',
      experience: '3 years',
      education: 'MCA',
      skills: ['React', 'TypeScript', 'Node.js', 'Redux'],
      currentLocation: 'Mumbai',
      expectedSalary: '₹9,00,000',
      noticePeriod: '15 days',
      score: 90,
      resumeUrl: '/assets/resumes/priya-sharma.pdf',
      coverLetter: 'I am excited to apply for this position...'
    },
    {
      id: 3,
      candidateName: 'Amit Patel',
      candidateEmail: 'amit.patel@email.com',
      candidatePhone: '+91-9876543212',
      appliedDate: new Date('2024-01-18'),
      status: 'pending',
      experience: '2 years',
      education: 'B.Sc in IT',
      skills: ['Angular', 'JavaScript', 'CSS', 'Bootstrap'],
      currentLocation: 'Pune',
      expectedSalary: '₹7,00,000',
      noticePeriod: 'Immediate',
      score: 70
    },
    {
      id: 4,
      candidateName: 'Sneha Reddy',
      candidateEmail: 'sneha.reddy@email.com',
      candidatePhone: '+91-9876543213',
      appliedDate: new Date('2024-01-17'),
      status: 'rejected',
      experience: '1 year',
      education: 'B.Tech',
      skills: ['HTML', 'CSS', 'JavaScript'],
      currentLocation: 'Hyderabad',
      expectedSalary: '₹5,00,000',
      score: 45
    },
    {
      id: 5,
      candidateName: 'Vikram Singh',
      candidateEmail: 'vikram.singh@email.com',
      candidatePhone: '+91-9876543214',
      appliedDate: new Date('2024-01-22'),
      status: 'offered',
      experience: '5 years',
      education: 'M.Tech',
      skills: ['Angular', 'React', 'Vue.js', 'TypeScript', 'Node.js', 'MongoDB'],
      currentLocation: 'Bangalore',
      expectedSalary: '₹12,00,000',
      noticePeriod: '60 days',
      score: 95,
      resumeUrl: '/assets/resumes/vikram-singh.pdf'
    }
  ];

  selectedApplication: Application | null = null;

  constructor(
    public dialogRef: MatDialogRef<ViewApplicationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jobTitle: string; jobId: number }
  ) {
    this.jobTitle = data.jobTitle;
    this.jobId = data.jobId;
  }

  ngOnInit() {
    // In real app, load applications based on jobId from API
  }

  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'shortlisted': 'status-shortlisted',
      'rejected': 'status-rejected',
      'interview-scheduled': 'status-interview',
      'offered': 'status-offered',
      'hired': 'status-hired'
    };
    return statusClassMap[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusTextMap: { [key: string]: string } = {
      'pending': 'Pending Review',
      'shortlisted': 'Shortlisted',
      'rejected': 'Rejected',
      'interview-scheduled': 'Interview Scheduled',
      'offered': 'Offer Extended',
      'hired': 'Hired'
    };
    return statusTextMap[status] || status;
  }

  getScoreClass(score?: number): string {
    if (!score) return '';
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }

  getApplicationStats() {
    return {
      total: this.applications.length,
      pending: this.applications.filter(a => a.status === 'pending').length,
      shortlisted: this.applications.filter(a => a.status === 'shortlisted').length,
      interviewed: this.applications.filter(a => a.status === 'interview-scheduled').length,
      rejected: this.applications.filter(a => a.status === 'rejected').length,
      offered: this.applications.filter(a => a.status === 'offered').length
    };
  }

  viewDetails(application: Application) {
    this.selectedApplication = application;
  }

  closeDetails() {
    this.selectedApplication = null;
  }

  shortlistCandidate(application: Application) {
    application.status = 'shortlisted';
    console.log('Shortlisted:', application);
  }

  scheduleInterview(application: Application) {
    application.status = 'interview-scheduled';
    console.log('Schedule interview for:', application);
    // In real app, open interview scheduling dialog
  }

  rejectCandidate(application: Application) {
    application.status = 'rejected';
    console.log('Rejected:', application);
  }

  makeOffer(application: Application) {
    application.status = 'offered';
    console.log('Make offer to:', application);
    // In real app, open offer dialog
  }

  downloadResume(application: Application) {
    if (application.resumeUrl) {
      console.log('Download resume:', application.resumeUrl);
      // In real app, download the resume file
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
