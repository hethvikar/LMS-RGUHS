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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CandidateDetailDialogComponent } from './candidate-detail-dialog.component';
import { RequestMoreProfilesDialogComponent } from './request-more-profiles-dialog.component';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  batch: string;
  department: string;
  cgpa: number;
  skills: string[];
  certifications: string[];
  experience?: string;
  currentLocation: string;
  assessmentScore: number;
  appliedPosition: string;
  appliedDate: Date;
  resumeUrl: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'interview-scheduled';
  source: 'direct-apply' | 'admin-shared';
  notes?: string;
}

interface JobRequest {
  id: number;
  jobTitle: string;
  requestType: 'open-job' | 'direct-request';
  candidatesNeeded: number;
  candidatesReceived: number;
  shortlisted: number;
  rejected: number;
  status: 'active' | 'completed' | 'closed';
}

@Component({
  selector: 'app-candidate-screening',
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
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  templateUrl: './candidate-screening.component.html',
  styleUrls: ['./candidate-screening.component.scss']
})
export class CandidateScreeningComponent implements OnInit {
  // Job requests
  jobRequests: JobRequest[] = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      requestType: 'direct-request',
      candidatesNeeded: 5,
      candidatesReceived: 8,
      shortlisted: 0,
      rejected: 0,
      status: 'active'
    },
    {
      id: 2,
      jobTitle: 'Backend Developer',
      requestType: 'open-job',
      candidatesNeeded: 3,
      candidatesReceived: 12,
      shortlisted: 3,
      rejected: 5,
      status: 'active'
    },
    {
      id: 3,
      jobTitle: 'Full Stack Developer',
      requestType: 'direct-request',
      candidatesNeeded: 4,
      candidatesReceived: 6,
      shortlisted: 4,
      rejected: 2,
      status: 'completed'
    }
  ];

  // Candidates data
  candidates: Candidate[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@rguhs.edu',
      phone: '+91-9876543210',
      batch: '2024',
      department: 'Computer Science',
      cgpa: 8.5,
      skills: ['Angular', 'TypeScript', 'RxJS', 'Material Design', 'Node.js'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
      currentLocation: 'Bangalore',
      assessmentScore: 88,
      appliedPosition: 'Frontend Developer',
      appliedDate: new Date('2024-01-15'),
      resumeUrl: '/assets/resumes/rahul-sharma.pdf',
      status: 'pending',
      source: 'admin-shared'
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@rguhs.edu',
      phone: '+91-9876543211',
      batch: '2024',
      department: 'Information Technology',
      cgpa: 9.1,
      skills: ['React', 'JavaScript', 'Redux', 'HTML', 'CSS'],
      certifications: ['Microsoft Azure Fundamentals'],
      experience: '6 months internship',
      currentLocation: 'Mumbai',
      assessmentScore: 94,
      appliedPosition: 'Frontend Developer',
      appliedDate: new Date('2024-01-14'),
      resumeUrl: '/assets/resumes/priya-patel.pdf',
      status: 'pending',
      source: 'admin-shared'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@rguhs.edu',
      phone: '+91-9876543212',
      batch: '2023',
      department: 'Computer Science',
      cgpa: 7.8,
      skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
      certifications: ['Oracle Certified Java Programmer'],
      experience: '1 year',
      currentLocation: 'Pune',
      assessmentScore: 80,
      appliedPosition: 'Backend Developer',
      appliedDate: new Date('2024-01-13'),
      resumeUrl: '/assets/resumes/amit-kumar.pdf',
      status: 'shortlisted',
      source: 'direct-apply'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@rguhs.edu',
      phone: '+91-9876543213',
      batch: '2024',
      department: 'Electronics & Communication',
      cgpa: 8.9,
      skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
      certifications: ['CompTIA Security+'],
      currentLocation: 'Hyderabad',
      assessmentScore: 91,
      appliedPosition: 'Backend Developer',
      appliedDate: new Date('2024-01-12'),
      resumeUrl: '/assets/resumes/sneha-reddy.pdf',
      status: 'shortlisted',
      source: 'direct-apply'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@rguhs.edu',
      phone: '+91-9876543214',
      batch: '2023',
      department: 'Information Technology',
      cgpa: 8.2,
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
      certifications: [],
      experience: '8 months',
      currentLocation: 'Delhi',
      assessmentScore: 85,
      appliedPosition: 'Backend Developer',
      appliedDate: new Date('2024-01-11'),
      resumeUrl: '/assets/resumes/vikram-singh.pdf',
      status: 'rejected',
      source: 'direct-apply'
    }
  ];

  selectedJobId: number = 1;
  selectedCandidates: Set<number> = new Set();
  displayedColumns: string[] = ['select', 'name', 'batch', 'cgpa', 'skills', 'score', 'source', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize
  }

  get selectedJob(): JobRequest | undefined {
    return this.jobRequests.find(j => j.id === this.selectedJobId);
  }

  get filteredCandidates(): Candidate[] {
    return this.candidates.filter(c => c.appliedPosition === this.selectedJob?.jobTitle);
  }

  get pendingCandidates(): Candidate[] {
    return this.filteredCandidates.filter(c => c.status === 'pending');
  }

  get shortlistedCandidates(): Candidate[] {
    return this.filteredCandidates.filter(c => c.status === 'shortlisted');
  }

  get rejectedCandidates(): Candidate[] {
    return this.filteredCandidates.filter(c => c.status === 'rejected');
  }

  toggleCandidateSelection(candidateId: number) {
    if (this.selectedCandidates.has(candidateId)) {
      this.selectedCandidates.delete(candidateId);
    } else {
      this.selectedCandidates.add(candidateId);
    }
  }

  isCandidateSelected(candidateId: number): boolean {
    return this.selectedCandidates.has(candidateId);
  }

  selectAllPending() {
    this.pendingCandidates.forEach(c => this.selectedCandidates.add(c.id));
  }

  deselectAll() {
    this.selectedCandidates.clear();
  }

  viewCandidateDetails(candidate: Candidate) {
    const dialogRef = this.dialog.open(CandidateDetailDialogComponent, {
      width: '900px',
      data: { candidate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action) {
        this.handleAction(result.action, [candidate.id]);
      }
    });
  }

  shortlistSelected() {
    if (this.selectedCandidates.size === 0) {
      this.snackBar.open('Please select at least one candidate', 'Close', { duration: 3000 });
      return;
    }

    const count = this.selectedCandidates.size;
    this.selectedCandidates.forEach(id => {
      const candidate = this.candidates.find(c => c.id === id);
      if (candidate && candidate.status === 'pending') {
        candidate.status = 'shortlisted';
        if (this.selectedJob) {
          this.selectedJob.shortlisted++;
        }
      }
    });

    this.selectedCandidates.clear();
    this.snackBar.open(`${count} candidate(s) shortlisted successfully`, 'Close', { duration: 3000 });
  }

  rejectSelected() {
    if (this.selectedCandidates.size === 0) {
      this.snackBar.open('Please select at least one candidate', 'Close', { duration: 3000 });
      return;
    }

    const count = this.selectedCandidates.size;
    this.selectedCandidates.forEach(id => {
      const candidate = this.candidates.find(c => c.id === id);
      if (candidate && candidate.status === 'pending') {
        candidate.status = 'rejected';
        if (this.selectedJob) {
          this.selectedJob.rejected++;
        }
      }
    });

    this.selectedCandidates.clear();
    this.snackBar.open(`${count} candidate(s) rejected`, 'Close', { duration: 3000 });
  }

  shortlistCandidate(candidateId: number) {
    this.handleAction('shortlist', [candidateId]);
  }

  rejectCandidate(candidateId: number) {
    this.handleAction('reject', [candidateId]);
  }

  private handleAction(action: string, candidateIds: number[]) {
    candidateIds.forEach(id => {
      const candidate = this.candidates.find(c => c.id === id);
      if (!candidate) return;

      if (action === 'shortlist' && candidate.status === 'pending') {
        candidate.status = 'shortlisted';
        if (this.selectedJob) {
          this.selectedJob.shortlisted++;
        }
        this.snackBar.open(`${candidate.name} shortlisted`, 'Close', { duration: 2000 });
      } else if (action === 'reject' && candidate.status === 'pending') {
        candidate.status = 'rejected';
        if (this.selectedJob) {
          this.selectedJob.rejected++;
        }
        this.snackBar.open(`${candidate.name} rejected`, 'Close', { duration: 2000 });
      }
    });
  }

  requestMoreProfiles() {
    const dialogRef = this.dialog.open(RequestMoreProfilesDialogComponent, {
      width: '600px',
      data: { job: this.selectedJob }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'requested') {
        this.snackBar.open(
          'Request sent to placement cell for more profiles',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }

  downloadResume(resumeUrl: string) {
    // Simulate resume download
    window.open(resumeUrl, '_blank');
  }

  getSourceLabel(source: string): string {
    return source === 'direct-apply' ? 'Direct Apply' : 'Admin Shared';
  }

  getSourceIcon(source: string): string {
    return source === 'direct-apply' ? 'person' : 'admin_panel_settings';
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'shortlisted': 'status-shortlisted',
      'rejected': 'status-rejected',
      'interview-scheduled': 'status-scheduled'
    };
    return classMap[status] || '';
  }

  exportCandidates(status?: string) {
    let candidatesToExport = this.filteredCandidates;
    if (status) {
      candidatesToExport = this.filteredCandidates.filter(c => c.status === status);
    }

    const headers = ['Name', 'Email', 'Phone', 'Batch', 'Department', 'CGPA', 'Skills', 'Score', 'Status', 'Source'];
    const rows = candidatesToExport.map(c => [
      c.name,
      c.email,
      c.phone,
      c.batch,
      c.department,
      c.cgpa,
      c.skills.join('; '),
      c.assessmentScore,
      c.status,
      c.source
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidates-${status || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Candidate list exported successfully', 'Close', { duration: 3000 });
  }
}
