import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ViewApplicationDetailsComponent } from './view-application-details/view-application-details.component';

interface JobApplication {
  id: number;
  companyName: string;
  position: string;
  appliedDate: Date;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  applicationId: string;
}

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class StudentApplicationsComponent implements OnInit {
  applications: JobApplication[] = [
    {
      id: 1,
      companyName: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      appliedDate: new Date('2024-01-15'),
      status: 'interview',
      applicationId: 'APP001'
    },
    {
      id: 2,
      companyName: 'Data Systems Corp',
      position: 'Full Stack Developer',
      appliedDate: new Date('2024-01-10'),
      status: 'reviewed',
      applicationId: 'APP002'
    },
    {
      id: 3,
      companyName: 'Innovation Labs',
      position: 'Software Engineer',
      appliedDate: new Date('2024-01-05'),
      status: 'pending',
      applicationId: 'APP003'
    }
  ];

  displayedColumns: string[] = ['company', 'position', 'appliedDate', 'status', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load applications from API
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'reviewed': 'Under Review',
      'interview': 'Interview Scheduled',
      'rejected': 'Rejected',
      'accepted': 'Accepted'
    };
    return statusMap[status] || status;
  }

  getStatusCount(status: string): number {
    return this.applications.filter(app => app.status === status).length;
  }

  viewApplication(application: JobApplication) {
    const dialogRef = this.dialog.open(ViewApplicationDetailsComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { application },
      panelClass: 'view-application-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'withdraw') {
        this.withdrawApplication(application);
      }
    });
  }

  withdrawApplication(application: JobApplication) {
    console.log('Withdrawing application:', application);
    // Call API to withdraw application
  }

  browseJobs() {
    console.log('Navigate to job search');
    // Navigate to job search page
  }
}