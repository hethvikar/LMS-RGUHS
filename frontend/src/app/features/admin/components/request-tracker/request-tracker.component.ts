import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { ViewRequestDetailsDialogComponent } from './view-request-details-dialog.component';

interface CandidateRequest {
  id: number;
  companyName: string;
  companyId: number;
  jobTitle: string;
  requestType: 'open-job' | 'direct-request';
  requestedDate: Date;
  status: 'pending' | 'in-progress' | 'fulfilled' | 'cancelled';
  numberOfCandidates: number;
  matchedCandidates: number;
  assignedOfficer?: string;
  requiredSkills: string[];
  batchPreference: string[];
  experience: string;
  education: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

@Component({
  selector: 'app-request-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './request-tracker.component.html',
  styleUrls: ['./request-tracker.component.scss']
})
export class RequestTrackerComponent implements OnInit {
  // Request data
  requests: CandidateRequest[] = [
    {
      id: 1,
      companyName: 'TechCorp Solutions',
      companyId: 101,
      jobTitle: 'Frontend Developer',
      requestType: 'direct-request',
      requestedDate: new Date('2024-01-15'),
      status: 'pending',
      numberOfCandidates: 5,
      matchedCandidates: 0,
      requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'Material Design'],
      batchPreference: ['2024', '2023'],
      experience: '0-2 years',
      education: 'Bachelor\'s Degree',
      priority: 'high',
      notes: 'Looking for candidates with strong Angular skills and good communication'
    },
    {
      id: 2,
      companyName: 'DataMinds Analytics',
      companyId: 102,
      jobTitle: 'Data Scientist',
      requestType: 'direct-request',
      requestedDate: new Date('2024-01-12'),
      status: 'in-progress',
      numberOfCandidates: 3,
      matchedCandidates: 2,
      assignedOfficer: 'Dr. Rajesh Kumar',
      requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      batchPreference: ['2024'],
      experience: '1-3 years',
      education: 'Master\'s Degree',
      priority: 'high'
    },
    {
      id: 3,
      companyName: 'CloudNine Systems',
      companyId: 103,
      jobTitle: 'Backend Developer',
      requestType: 'open-job',
      requestedDate: new Date('2024-01-10'),
      status: 'fulfilled',
      numberOfCandidates: 4,
      matchedCandidates: 4,
      assignedOfficer: 'Prof. Sunita Sharma',
      requiredSkills: ['Node.js', 'MongoDB', 'REST APIs', 'Docker'],
      batchPreference: ['2023', '2022'],
      experience: '2-4 years',
      education: 'Bachelor\'s Degree',
      priority: 'medium'
    },
    {
      id: 4,
      companyName: 'InnovateTech',
      companyId: 104,
      jobTitle: 'Full Stack Developer',
      requestType: 'direct-request',
      requestedDate: new Date('2024-01-08'),
      status: 'in-progress',
      numberOfCandidates: 6,
      matchedCandidates: 4,
      assignedOfficer: 'Dr. Rajesh Kumar',
      requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      batchPreference: ['2024', '2023', '2022'],
      experience: '1-3 years',
      education: 'Bachelor\'s Degree',
      priority: 'medium'
    },
    {
      id: 5,
      companyName: 'CyberSecure Inc',
      companyId: 105,
      jobTitle: 'Security Analyst',
      requestType: 'direct-request',
      requestedDate: new Date('2024-01-05'),
      status: 'pending',
      numberOfCandidates: 2,
      matchedCandidates: 0,
      requiredSkills: ['Network Security', 'Penetration Testing', 'SIEM Tools'],
      batchPreference: ['2024'],
      experience: '0-1 years',
      education: 'Bachelor\'s Degree',
      priority: 'low',
      notes: 'Freshers welcome with relevant certifications'
    }
  ];

  placementOfficers = [
    'Dr. Rajesh Kumar',
    'Prof. Sunita Sharma',
    'Dr. Anita Desai',
    'Prof. Vikram Singh',
    'Dr. Priya Patel'
  ];

  displayedColumns: string[] = ['company', 'jobTitle', 'requestType', 'requested', 'progress', 'status', 'priority', 'officer', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize component
  }

  get pendingRequests(): CandidateRequest[] {
    return this.requests.filter(r => r.status === 'pending');
  }

  get inProgressRequests(): CandidateRequest[] {
    return this.requests.filter(r => r.status === 'in-progress');
  }

  get fulfilledRequests(): CandidateRequest[] {
    return this.requests.filter(r => r.status === 'fulfilled');
  }

  get cancelledRequests(): CandidateRequest[] {
    return this.requests.filter(r => r.status === 'cancelled');
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'in-progress': 'status-in-progress',
      'fulfilled': 'status-fulfilled',
      'cancelled': 'status-cancelled'
    };
    return classMap[status] || '';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'schedule',
      'in-progress': 'autorenew',
      'fulfilled': 'check_circle',
      'cancelled': 'cancel'
    };
    return iconMap[status] || 'help';
  }

  getPriorityClass(priority: string): string {
    const classMap: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return classMap[priority] || '';
  }

  getProgressPercentage(request: CandidateRequest): number {
    return request.numberOfCandidates > 0 
      ? Math.round((request.matchedCandidates / request.numberOfCandidates) * 100)
      : 0;
  }

  viewRequestDetails(request: CandidateRequest) {
    const dialogRef = this.dialog.open(ViewRequestDetailsDialogComponent, {
      width: '800px',
      data: { request }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'updated') {
        this.snackBar.open('Request updated successfully', 'Close', { duration: 3000 });
        // Refresh data if needed
      }
    });
  }

  assignToOfficer(request: CandidateRequest, officer: string) {
    request.assignedOfficer = officer;
    if (request.status === 'pending') {
      request.status = 'in-progress';
    }
    this.snackBar.open(`Request assigned to ${officer}`, 'Close', { duration: 3000 });
  }

  updateRequestStatus(request: CandidateRequest, newStatus: 'pending' | 'in-progress' | 'fulfilled' | 'cancelled') {
    const oldStatus = request.status;
    request.status = newStatus;
    this.snackBar.open(
      `Request status changed from ${oldStatus} to ${newStatus}`,
      'Close',
      { duration: 3000 }
    );
  }

  markAsFulfilled(request: CandidateRequest) {
    if (request.matchedCandidates >= request.numberOfCandidates) {
      this.updateRequestStatus(request, 'fulfilled');
    } else {
      this.snackBar.open(
        `Cannot fulfill: Only ${request.matchedCandidates}/${request.numberOfCandidates} candidates matched`,
        'Close',
        { duration: 4000 }
      );
    }
  }

  exportRequests() {
    // Create CSV content
    const headers = ['ID', 'Company', 'Job Title', 'Type', 'Requested Date', 'Status', 'Candidates', 'Matched', 'Officer', 'Priority'];
    const rows = this.requests.map(req => [
      req.id,
      req.companyName,
      req.jobTitle,
      req.requestType,
      req.requestedDate.toLocaleDateString(),
      req.status,
      req.numberOfCandidates,
      req.matchedCandidates,
      req.assignedOfficer || 'Unassigned',
      req.priority
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidate-requests-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Request list exported successfully', 'Close', { duration: 3000 });
  }

  getRequestTypeLabel(type: string): string {
    return type === 'open-job' ? 'Open Posting' : 'Direct Request';
  }

  getRequestTypeIcon(type: string): string {
    return type === 'open-job' ? 'public' : 'person_search';
  }
}
