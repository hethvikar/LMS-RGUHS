import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

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

  viewCandidate(candidate: Candidate) {
    console.log('View candidate profile:', candidate);
    // Navigate to candidate detail view
  }

  downloadResume(candidate: Candidate) {
    console.log('Download resume for:', candidate);
    // Download resume file
  }

  scheduleInterview(candidate: Candidate) {
    console.log('Schedule interview for:', candidate);
    // Open interview scheduling dialog
  }

  updateStatus(candidate: Candidate) {
    console.log('Update status for:', candidate);
    // Open status update dialog
  }

  makeOffer(candidate: Candidate) {
    console.log('Make offer to:', candidate);
    // Open offer creation dialog
  }
}