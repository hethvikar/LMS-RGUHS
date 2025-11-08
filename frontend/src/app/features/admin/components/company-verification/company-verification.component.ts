import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface CompanyRegistration {
  id: number;
  companyName: string;
  industry: string;
  website: string;
  gstNumber: string;
  cinNumber?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: 'pending_approval' | 'whitelisted' | 'rejected' | 'clarification_needed';
  registrationDate: Date;
  verificationFlags: {
    websiteValid: boolean;
    gstValid: boolean;
    cinValid?: boolean;
    emailDomainMatch: boolean;
    suspiciousDomain: boolean;
  };
  adminNotes?: string;
}

@Component({
  selector: 'app-company-verification',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './company-verification.component.html',
  styleUrls: ['./company-verification.component.scss']
})
export class CompanyVerificationComponent implements OnInit {
  pendingRegistrations: CompanyRegistration[] = [];
  whitelistedCompanies: CompanyRegistration[] = [];
  rejectedCompanies: CompanyRegistration[] = [];

  displayedColumns: string[] = ['company', 'contact', 'verification', 'date', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadCompanyRegistrations();
  }

  loadCompanyRegistrations() {
    // Mock data - in real app, load from API
    this.pendingRegistrations = [
      {
        id: 1,
        companyName: 'Tech Solutions India Pvt Ltd',
        industry: 'Information Technology',
        website: 'https://techsolutions.in',
        gstNumber: '29AABCT1234A1Z5',
        cinNumber: 'U72300KA2018PTC115546',
        contactPerson: 'Rajesh Kumar',
        contactEmail: 'rajesh@techsolutions.in',
        contactPhone: '+91-9876543210',
        status: 'pending_approval',
        registrationDate: new Date('2024-01-15'),
        verificationFlags: {
          websiteValid: true,
          gstValid: true,
          cinValid: true,
          emailDomainMatch: true,
          suspiciousDomain: false
        }
      },
      {
        id: 2,
        companyName: 'Quick Hire Services',
        industry: 'Recruitment',
        website: 'https://quickhire.com',
        gstNumber: '27AABCT5678B1Z5',
        contactPerson: 'John Doe',
        contactEmail: 'john@gmail.com',
        contactPhone: '+91-1234567890',
        status: 'pending_approval',
        registrationDate: new Date('2024-01-16'),
        verificationFlags: {
          websiteValid: false,
          gstValid: false,
          emailDomainMatch: false,
          suspiciousDomain: true
        }
      },
      {
        id: 3,
        companyName: 'Innovative Systems Ltd',
        industry: 'Software Development',
        website: 'https://innovativesystems.com',
        gstNumber: '29AABCT9012C1Z5',
        cinNumber: 'U72200KA2020PTC123456',
        contactPerson: 'Priya Sharma',
        contactEmail: 'priya@innovativesystems.com',
        contactPhone: '+91-9988776655',
        status: 'pending_approval',
        registrationDate: new Date('2024-01-17'),
        verificationFlags: {
          websiteValid: true,
          gstValid: true,
          cinValid: true,
          emailDomainMatch: true,
          suspiciousDomain: false
        }
      }
    ];

    this.whitelistedCompanies = [
      {
        id: 100,
        companyName: 'Infosys Technologies',
        industry: 'Information Technology',
        website: 'https://infosys.com',
        gstNumber: '29AABCT0000A1Z5',
        contactPerson: 'HR Department',
        contactEmail: 'placement@infosys.com',
        contactPhone: '+91-8012345678',
        status: 'whitelisted',
        registrationDate: new Date('2023-12-01'),
        verificationFlags: {
          websiteValid: true,
          gstValid: true,
          emailDomainMatch: true,
          suspiciousDomain: false
        }
      }
    ];

    this.rejectedCompanies = [];
  }

  get pendingCount(): number {
    return this.pendingRegistrations.length;
  }

  get whitelistedCount(): number {
    return this.whitelistedCompanies.length;
  }

  get rejectedCount(): number {
    return this.rejectedCompanies.length;
  }

  get flaggedCount(): number {
    return this.pendingRegistrations.filter(c => c.verificationFlags.suspiciousDomain).length;
  }

  getStatusClass(status: string): string {
    return status.replace('_', '-');
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending_approval': 'Pending Approval',
      'whitelisted': 'Whitelisted',
      'rejected': 'Rejected',
      'clarification_needed': 'Clarification Needed'
    };
    return statusMap[status] || status;
  }

  getVerificationScore(flags: CompanyRegistration['verificationFlags']): number {
    let score = 0;
    if (flags.websiteValid) score += 25;
    if (flags.gstValid) score += 25;
    if (flags.emailDomainMatch) score += 25;
    if (!flags.suspiciousDomain) score += 25;
    return score;
  }

  isSuspicious(company: CompanyRegistration): boolean {
    return company.verificationFlags.suspiciousDomain ||
           !company.verificationFlags.emailDomainMatch ||
           !company.verificationFlags.websiteValid;
  }

  approveCompany(company: CompanyRegistration) {
    if (confirm(`Approve and whitelist ${company.companyName}?`)) {
      company.status = 'whitelisted';
      this.pendingRegistrations = this.pendingRegistrations.filter(c => c.id !== company.id);
      this.whitelistedCompanies.push(company);
      
      console.log('Company approved:', company);
      // TODO: Call API to approve company
      // this.companyService.approveCompany(company.id).subscribe();
    }
  }

  rejectCompany(company: CompanyRegistration) {
    const reason = prompt(`Provide reason for rejecting ${company.companyName}:`);
    if (reason) {
      company.status = 'rejected';
      company.adminNotes = reason;
      this.pendingRegistrations = this.pendingRegistrations.filter(c => c.id !== company.id);
      this.rejectedCompanies.push(company);
      
      console.log('Company rejected:', company, 'Reason:', reason);
      // TODO: Call API to reject company
      // this.companyService.rejectCompany(company.id, reason).subscribe();
    }
  }

  requestClarification(company: CompanyRegistration) {
    const message = prompt(`What clarification is needed from ${company.companyName}?`);
    if (message) {
      company.status = 'clarification_needed';
      company.adminNotes = message;
      
      console.log('Clarification requested:', company, 'Message:', message);
      // TODO: Call API to request clarification
      // this.companyService.requestClarification(company.id, message).subscribe();
    }
  }

  viewDetails(company: CompanyRegistration) {
    console.log('View company details:', company);
    // TODO: Open detailed view dialog
    // this.dialog.open(CompanyDetailsDialogComponent, {
    //   width: '800px',
    //   data: company
    // });
  }

  verifyWebsite(company: CompanyRegistration) {
    console.log('Manually verify website:', company.website);
    // Open website in new tab for manual verification
    window.open(company.website, '_blank');
  }

  verifyGST(company: CompanyRegistration) {
    console.log('Verify GST number:', company.gstNumber);
    // TODO: Trigger GST verification API
    // this.verificationService.verifyGstNumber(company.gstNumber).subscribe();
  }

  checkLinkedIn(company: CompanyRegistration) {
    const companySlug = company.companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    window.open(`https://www.linkedin.com/company/${companySlug}`, '_blank');
  }
}
