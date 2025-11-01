import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { JobPostFormDialogComponent } from './job-post-form-dialog.component';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'paused' | 'closed';
  postedDate: Date;
  applicationsCount: number;
  salary?: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  remoteWork?: boolean;
  applicationDeadline?: Date;
}

@Component({
  selector: 'app-company-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class CompanyJobsComponent implements OnInit {
  jobPostings: JobPosting[] = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Bangalore, India',
      type: 'full-time',
      status: 'active',
      postedDate: new Date('2024-01-15'),
      applicationsCount: 25,
      salary: '₹8,00,000 - ₹12,00,000',
      description: 'We are looking for a skilled Frontend Developer with expertise in Angular, React, and modern web technologies. You will be responsible for building responsive user interfaces and collaborating with our design and backend teams.',
      requirements: ['3+ years of experience with Angular/React', 'Strong knowledge of HTML, CSS, and JavaScript', 'Experience with TypeScript', 'Familiarity with REST APIs'],
      skills: ['Angular', 'React', 'TypeScript', 'HTML/CSS', 'JavaScript'],
      benefits: ['Health insurance', 'Flexible working hours', 'Learning allowance', 'Remote work options'],
      experience: '3-5 years',
      education: 'Bachelor\'s Degree',
      remoteWork: true
    },
    {
      id: 2,
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'full-time',
      status: 'active',
      postedDate: new Date('2024-01-10'),
      applicationsCount: 18,
      salary: '₹10,00,000 - ₹15,00,000',
      description: 'Join our backend team to build scalable solutions using Node.js, Python, and cloud technologies. You will work on high-performance APIs and microservices architecture.',
      requirements: ['4+ years of backend development experience', 'Proficiency in Node.js or Python', 'Experience with databases (PostgreSQL, MongoDB)', 'Knowledge of cloud platforms (AWS/Azure)'],
      skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
      benefits: ['Competitive salary', 'Stock options', 'Health and dental coverage', 'Professional development budget'],
      experience: '3-5 years',
      education: 'Bachelor\'s Degree',
      remoteWork: true
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Mumbai, India',
      type: 'contract',
      status: 'paused',
      postedDate: new Date('2024-01-05'),
      applicationsCount: 12,
      salary: '₹6,00,000 - ₹8,00,000',
      description: 'Create amazing user experiences for our products. You will work closely with product managers and developers to design intuitive interfaces and conduct user research.',
      requirements: ['3+ years of UI/UX design experience', 'Proficiency in Figma, Sketch, or Adobe XD', 'Strong portfolio showcasing design projects', 'Understanding of user-centered design principles'],
      skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      benefits: ['Creative work environment', 'Flexible hours', 'Design tool subscriptions', 'Portfolio development support'],
      experience: '3-5 years',
      education: 'Bachelor\'s Degree',
      remoteWork: false
    }
  ];

  displayedColumns: string[] = ['title', 'department', 'location', 'type', 'status', 'applications', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load job postings from API
  }

  getStatusCount(status: string): number {
    return this.jobPostings.filter(job => job.status === status).length;
  }

  getTotalApplications(): number {
    return this.jobPostings.reduce((total, job) => total + job.applicationsCount, 0);
  }

  getScheduledInterviews(): number {
    // Mock data - in real app, this would come from API
    return 8;
  }

  getTypeClass(type: string): string {
    return type.replace('-', '');
  }

  getTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship'
    };
    return typeMap[type] || type;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'paused': 'Paused',
      'closed': 'Closed'
    };
    return statusMap[status] || status;
  }

  createNewJob() {
    const dialogRef = this.dialog.open(JobPostFormDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        this.jobPostings.push(result.job);
        console.log('Job created:', result.job);
      }
    });
  }

  viewApplications(job: JobPosting) {
    console.log('View applications for job:', job);
    // Navigate to applications view
  }

  editJob(job: JobPosting) {
    const dialogRef = this.dialog.open(JobPostFormDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      data: job
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'update') {
        const index = this.jobPostings.findIndex(j => j.id === result.job.id);
        if (index !== -1) {
          this.jobPostings[index] = result.job;
          console.log('Job updated:', result.job);
        }
      }
    });
  }

  toggleJobStatus(job: JobPosting) {
    console.log('Toggle job status:', job);
    // Call API to toggle job status
  }

  deleteJob(job: JobPosting) {
    console.log('Delete job:', job);
    // Call API to delete job
  }
}