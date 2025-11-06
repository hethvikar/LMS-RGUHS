import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

interface OfferDetails {
  id: number;
  companyName: string;
  companyLogo?: string;
  position: string;
  status: string;
  // Compensation Details
  baseSalary: number;
  variableBonus?: number;
  stockOptions?: string;
  joiningBonus?: number;
  annualCTC: number;
  // Job Details
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  department: string;
  reportingTo: string;
  location: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  joiningDate: Date;
  offerValidTill: Date;
  // Benefits
  benefits?: {
    healthInsurance: boolean;
    lifeInsurance: boolean;
    paidLeaves: number;
    workFromHome: boolean;
    flexibleHours: boolean;
    learningBudget?: number;
    otherBenefits?: string[];
  };
  // Additional Details
  probationPeriod: string;
  noticePeriod: string;
  requiredDocuments?: string[];
  contactPerson?: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  // Timeline
  offerReceivedDate: Date;
  acceptanceDeadline: Date;
  // Terms
  specialTerms?: string[];
  notes?: string;
}

@Component({
  selector: 'app-view-offer-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './view-offer-details.component.html',
  styleUrls: ['./view-offer-details.component.scss']
})
export class ViewOfferDetailsComponent {
  offer: OfferDetails;

  constructor(
    public dialogRef: MatDialogRef<ViewOfferDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { placement: any }
  ) {
    // Generate comprehensive offer details based on placement data
    this.offer = this.generateOfferDetails(data.placement);
  }

  private generateOfferDetails(placement: any): OfferDetails {
    const baseSalary = placement.offerDetails?.salary || 850000;
    const variableBonus = Math.round(baseSalary * 0.15); // 15% variable bonus
    const joiningBonus = Math.round(baseSalary * 0.1); // 10% joining bonus
    const annualCTC = baseSalary + variableBonus + joiningBonus;

    return {
      id: placement.id,
      companyName: placement.companyName,
      position: placement.position,
      status: placement.status,
      // Compensation
      baseSalary: baseSalary,
      variableBonus: variableBonus,
      stockOptions: '500 RSUs (vesting over 4 years)',
      joiningBonus: joiningBonus,
      annualCTC: annualCTC,
      // Job Details
      jobType: 'Full-time',
      department: 'Engineering',
      reportingTo: 'Senior Engineering Manager',
      location: placement.offerDetails?.location || 'Bangalore, Karnataka, India',
      workMode: 'Hybrid',
      joiningDate: placement.offerDetails?.joiningDate || new Date('2024-02-15'),
      offerValidTill: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      // Benefits
      benefits: {
        healthInsurance: true,
        lifeInsurance: true,
        paidLeaves: 24,
        workFromHome: true,
        flexibleHours: true,
        learningBudget: 50000,
        otherBenefits: [
          'Meal vouchers',
          'Transportation allowance',
          'Gym membership',
          'Annual health checkup',
          'Relocation assistance',
          'Performance bonuses',
          'Team outings',
          'Professional development programs'
        ]
      },
      // Additional Details
      probationPeriod: '6 months',
      noticePeriod: '2 months',
      requiredDocuments: [
        'Latest resume',
        'Educational certificates (10th, 12th, Degree)',
        'Relieving letter from previous employer (if applicable)',
        'Salary slips of last 3 months (if applicable)',
        'Pan card copy',
        'Aadhar card copy',
        'Passport size photographs (2)',
        'Address proof',
        'Bank account details'
      ],
      contactPerson: {
        name: 'Priya Sharma',
        designation: 'HR Manager',
        email: 'priya.sharma@' + placement.companyName.toLowerCase().replace(/\s+/g, '') + '.com',
        phone: '+91-9876543210'
      },
      // Timeline
      offerReceivedDate: placement.lastUpdate || new Date(),
      acceptanceDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      // Terms
      specialTerms: [
        'Background verification will be conducted before joining',
        'Offer is subject to successful completion of medical examination',
        'Candidate must maintain a minimum CGPA of 7.0 until graduation',
        'Any false information provided will result in immediate termination of offer',
        'Company reserves the right to modify terms based on business requirements'
      ],
      notes: 'Congratulations on receiving this offer! Please review all terms carefully and respond before the acceptance deadline. Feel free to reach out to HR for any clarifications.'
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  acceptOffer(): void {
    console.log('Accepting offer:', this.offer.id);
    this.dialogRef.close({ action: 'accept', offerId: this.offer.id });
  }

  declineOffer(): void {
    console.log('Declining offer:', this.offer.id);
    this.dialogRef.close({ action: 'decline', offerId: this.offer.id });
  }

  negotiateOffer(): void {
    console.log('Request negotiation for offer:', this.offer.id);
    this.dialogRef.close({ action: 'negotiate', offerId: this.offer.id });
  }

  downloadOfferLetter(): void {
    console.log('Downloading offer letter for:', this.offer.id);
    // In real app, generate and download PDF
  }

  shareOffer(): void {
    console.log('Sharing offer details');
    // In real app, implement share functionality
  }

  getDaysRemaining(): number {
    const today = new Date();
    const deadline = new Date(this.offer.acceptanceDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getDeadlineClass(): string {
    const days = this.getDaysRemaining();
    if (days <= 3) return 'deadline-urgent';
    if (days <= 7) return 'deadline-warning';
    return 'deadline-normal';
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
}
