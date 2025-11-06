import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ViewOfferDetailsComponent } from './view-offer-details/view-offer-details.component';

interface PlacementStatus {
  id: number;
  companyName: string;
  position: string;
  status: 'applied' | 'shortlisted' | 'interview' | 'offer' | 'joined' | 'rejected';
  appliedDate: Date;
  lastUpdate: Date;
  nextStep?: string;
  offerDetails?: {
    salary: number;
    joiningDate: Date;
    location: string;
  };
}

@Component({
  selector: 'app-student-placement-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatListModule
  ],
  templateUrl: './placement-status.component.html',
  styleUrls: ['./placement-status.component.scss']
})
export class StudentPlacementStatusComponent implements OnInit {
  placements: PlacementStatus[] = [
    {
      id: 1,
      companyName: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      status: 'offer',
      appliedDate: new Date('2024-01-15'),
      lastUpdate: new Date('2024-01-22'),
      nextStep: 'Accept offer and submit documents',
      offerDetails: {
        salary: 850000,
        joiningDate: new Date('2024-02-15'),
        location: 'Bangalore, India'
      }
    },
    {
      id: 2,
      companyName: 'Data Systems Corp',
      position: 'Full Stack Developer',
      status: 'interview',
      appliedDate: new Date('2024-01-10'),
      lastUpdate: new Date('2024-01-18'),
      nextStep: 'Technical interview on Jan 25'
    },
    {
      id: 3,
      companyName: 'Innovation Labs',
      position: 'Software Engineer',
      status: 'shortlisted',
      appliedDate: new Date('2024-01-05'),
      lastUpdate: new Date('2024-01-12'),
      nextStep: 'HR interview scheduled'
    },
    {
      id: 4,
      companyName: 'Global Tech',
      position: 'Junior Developer',
      status: 'applied',
      appliedDate: new Date('2024-01-20'),
      lastUpdate: new Date('2024-01-20')
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load placement data from API
  }

  getStatusCount(status: string): number {
    return this.placements.filter(placement => placement.status === status).length;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'applied': 'Applied',
      'shortlisted': 'Shortlisted',
      'interview': 'Interview',
      'offer': 'Offer Received',
      'joined': 'Joined',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'applied': 'work',
      'shortlisted': 'star',
      'interview': 'event',
      'offer': 'local_offer',
      'joined': 'check_circle',
      'rejected': 'cancel'
    };
    return iconMap[status] || 'work';
  }

  viewOfferDetails(placement: PlacementStatus): void {
    const dialogRef = this.dialog.open(ViewOfferDetailsComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { placement },
      panelClass: 'view-offer-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'accept') {
        console.log('Offer accepted:', result.offerId);
        // Update placement status to 'joined'
        const placementIndex = this.placements.findIndex(p => p.id === result.offerId);
        if (placementIndex !== -1) {
          this.placements[placementIndex].status = 'joined';
        }
      } else if (result?.action === 'decline') {
        console.log('Offer declined:', result.offerId);
        // Update placement status to 'rejected'
        const placementIndex = this.placements.findIndex(p => p.id === result.offerId);
        if (placementIndex !== -1) {
          this.placements[placementIndex].status = 'rejected';
        }
      } else if (result?.action === 'negotiate') {
        console.log('Negotiation requested:', result.offerId);
        // Open negotiation dialog or send request
      }
    });
  }
}