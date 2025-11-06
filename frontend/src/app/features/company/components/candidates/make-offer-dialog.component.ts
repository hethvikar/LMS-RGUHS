import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-make-offer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDividerModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  template: `
    <div class="make-offer-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>workspace_premium</mat-icon>
          Make Job Offer
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <mat-tab-group [(selectedIndex)]="selectedTabIndex">
          <!-- Offer Details Tab -->
          <mat-tab label="Offer Details">
            <div class="tab-content">
              <div class="candidate-info">
                <div class="candidate-avatar">
                  <mat-icon>account_circle</mat-icon>
                </div>
                <div class="candidate-details">
                  <h3>{{ data.name }}</h3>
                  <p>{{ data.appliedPosition }}</p>
                  <div class="candidate-meta">
                    <span><mat-icon>email</mat-icon> {{ data.email }}</span>
                    <span><mat-icon>phone</mat-icon> {{ data.phone }}</span>
                  </div>
                </div>
              </div>

              <form [formGroup]="offerForm" class="offer-form">
                <div class="form-section">
                  <h4>
                    <mat-icon>work</mat-icon>
                    Position Details
                  </h4>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Job Title</mat-label>
                      <input matInput formControlName="jobTitle" placeholder="e.g., Senior Frontend Developer">
                      <mat-icon matPrefix>badge</mat-icon>
                      <mat-error *ngIf="offerForm.get('jobTitle')?.hasError('required')">
                        Job title is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Department</mat-label>
                      <mat-select formControlName="department">
                        <mat-option value="Engineering">Engineering</mat-option>
                        <mat-option value="Product">Product</mat-option>
                        <mat-option value="Design">Design</mat-option>
                        <mat-option value="Marketing">Marketing</mat-option>
                        <mat-option value="Sales">Sales</mat-option>
                        <mat-option value="Human Resources">Human Resources</mat-option>
                        <mat-option value="Operations">Operations</mat-option>
                      </mat-select>
                      <mat-icon matPrefix>business</mat-icon>
                      <mat-error *ngIf="offerForm.get('department')?.hasError('required')">
                        Department is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Employment Type</mat-label>
                      <mat-select formControlName="employmentType">
                        <mat-option value="Full-Time">Full-Time</mat-option>
                        <mat-option value="Part-Time">Part-Time</mat-option>
                        <mat-option value="Contract">Contract</mat-option>
                        <mat-option value="Temporary">Temporary</mat-option>
                      </mat-select>
                      <mat-icon matPrefix>schedule</mat-icon>
                      <mat-error *ngIf="offerForm.get('employmentType')?.hasError('required')">
                        Employment type is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Work Location</mat-label>
                      <mat-select formControlName="workLocation">
                        <mat-option value="On-Site">On-Site</mat-option>
                        <mat-option value="Remote">Remote</mat-option>
                        <mat-option value="Hybrid">Hybrid</mat-option>
                      </mat-select>
                      <mat-icon matPrefix>place</mat-icon>
                      <mat-error *ngIf="offerForm.get('workLocation')?.hasError('required')">
                        Work location is required
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="form-section">
                  <h4>
                    <mat-icon>payments</mat-icon>
                    Compensation Package
                  </h4>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Annual Salary</mat-label>
                      <input matInput type="number" formControlName="annualSalary" placeholder="e.g., 80000">
                      <span matPrefix>₹&nbsp;</span>
                      <mat-icon matSuffix>monetization_on</mat-icon>
                      <mat-error *ngIf="offerForm.get('annualSalary')?.hasError('required')">
                        Salary is required
                      </mat-error>
                      <mat-error *ngIf="offerForm.get('annualSalary')?.hasError('min')">
                        Salary must be positive
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Signing Bonus</mat-label>
                      <input matInput type="number" formControlName="signingBonus" placeholder="e.g., 10000">
                      <span matPrefix>₹&nbsp;</span>
                      <mat-icon matSuffix>card_giftcard</mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Annual Bonus</mat-label>
                      <input matInput formControlName="annualBonus" placeholder="e.g., Up to 15%">
                      <mat-icon matPrefix>trending_up</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Stock Options</mat-label>
                      <input matInput formControlName="stockOptions" placeholder="e.g., 1000 shares">
                      <mat-icon matPrefix>show_chart</mat-icon>
                    </mat-form-field>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="form-section">
                  <h4>
                    <mat-icon>favorite</mat-icon>
                    Benefits & Perks
                  </h4>

                  <div class="benefits-grid">
                    <mat-checkbox formControlName="healthInsurance">Health Insurance</mat-checkbox>
                    <mat-checkbox formControlName="dentalVision">Dental & Vision</mat-checkbox>
                    <mat-checkbox formControlName="retirement401k">401(k) / Retirement Plan</mat-checkbox>
                    <mat-checkbox formControlName="paidTimeOff">Paid Time Off (PTO)</mat-checkbox>
                    <mat-checkbox formControlName="flexibleSchedule">Flexible Schedule</mat-checkbox>
                    <mat-checkbox formControlName="workFromHome">Work From Home</mat-checkbox>
                    <mat-checkbox formControlName="professionalDevelopment">Professional Development</mat-checkbox>
                    <mat-checkbox formControlName="gymMembership">Gym Membership</mat-checkbox>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Additional Benefits</mat-label>
                      <textarea matInput formControlName="additionalBenefits" rows="3" 
                                placeholder="List any other benefits (e.g., laptop, phone, meal allowance)"></textarea>
                      <mat-icon matPrefix>add_circle</mat-icon>
                    </mat-form-field>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="form-section">
                  <h4>
                    <mat-icon>event</mat-icon>
                    Timeline
                  </h4>

                  <div class="form-row two-columns">
                    <mat-form-field appearance="outline">
                      <mat-label>Start Date</mat-label>
                      <input matInput [matDatepicker]="startPicker" formControlName="startDate" placeholder="Select start date">
                      <mat-datepicker-toggle matPrefix [for]="startPicker"></mat-datepicker-toggle>
                      <mat-datepicker #startPicker></mat-datepicker>
                      <mat-error *ngIf="offerForm.get('startDate')?.hasError('required')">
                        Start date is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Offer Expiry Date</mat-label>
                      <input matInput [matDatepicker]="expiryPicker" formControlName="offerExpiryDate" placeholder="Select expiry date">
                      <mat-datepicker-toggle matPrefix [for]="expiryPicker"></mat-datepicker-toggle>
                      <mat-datepicker #expiryPicker></mat-datepicker>
                      <mat-error *ngIf="offerForm.get('offerExpiryDate')?.hasError('required')">
                        Expiry date is required
                      </mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="form-section">
                  <h4>
                    <mat-icon>note</mat-icon>
                    Additional Notes
                  </h4>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Special Instructions or Terms</mat-label>
                      <textarea matInput formControlName="additionalNotes" rows="4" 
                                placeholder="Any special terms, conditions, or notes for the candidate"></textarea>
                    </mat-form-field>
                  </div>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Preview Letter Tab -->
          <mat-tab label="Preview Offer Letter">
            <div class="tab-content">
              <div class="letter-preview">
                <div class="letter-header">
                  <div class="company-logo">
                    <mat-icon>business</mat-icon>
                  </div>
                  <div class="company-info">
                    <h2>{{ companyName }}</h2>
                    <p>{{ companyAddress }}</p>
                    <p>{{ companyEmail }} | {{ companyPhone }}</p>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="letter-date">
                  <p><strong>Date:</strong> {{ today | date:'fullDate' }}</p>
                </div>

                <div class="letter-recipient">
                  <p><strong>{{ data.name }}</strong></p>
                  <p>{{ data.email }}</p>
                  <p>{{ data.phone }}</p>
                </div>

                <div class="letter-subject">
                  <p><strong>Subject: Job Offer - {{ offerForm.get('jobTitle')?.value || data.appliedPosition }}</strong></p>
                </div>

                <div class="letter-body">
                  <p>Dear {{ data.name }},</p>

                  <p>We are pleased to offer you the position of <strong>{{ offerForm.get('jobTitle')?.value || data.appliedPosition }}</strong> 
                  in the {{ offerForm.get('department')?.value || 'Engineering' }} department at {{ companyName }}. 
                  We were impressed with your qualifications and experience, and believe you will be a valuable addition to our team.</p>

                  <h3>Position Details:</h3>
                  <ul>
                    <li><strong>Job Title:</strong> {{ offerForm.get('jobTitle')?.value || data.appliedPosition }}</li>
                    <li><strong>Department:</strong> {{ offerForm.get('department')?.value || 'Engineering' }}</li>
                    <li><strong>Employment Type:</strong> {{ offerForm.get('employmentType')?.value || 'Full-Time' }}</li>
                    <li><strong>Work Location:</strong> {{ offerForm.get('workLocation')?.value || 'Hybrid' }}</li>
                    <li><strong>Start Date:</strong> {{ (offerForm.get('startDate')?.value | date:'fullDate') || 'To be determined' }}</li>
                    <li><strong>Reporting To:</strong> Department Manager</li>
                  </ul>

                  <h3>Compensation Package:</h3>
                  <ul>
                    <li><strong>Annual Salary:</strong> ₹{{ (offerForm.get('annualSalary')?.value | number) || '0' }} per annum</li>
                    <li *ngIf="offerForm.get('signingBonus')?.value"><strong>Signing Bonus:</strong> ₹{{ offerForm.get('signingBonus')?.value | number }}</li>
                    <li *ngIf="offerForm.get('annualBonus')?.value"><strong>Annual Bonus:</strong> {{ offerForm.get('annualBonus')?.value }}</li>
                    <li *ngIf="offerForm.get('stockOptions')?.value"><strong>Stock Options:</strong> {{ offerForm.get('stockOptions')?.value }}</li>
                  </ul>

                  <h3>Benefits & Perks:</h3>
                  <ul>
                    <li *ngIf="offerForm.get('healthInsurance')?.value">✓ Health Insurance</li>
                    <li *ngIf="offerForm.get('dentalVision')?.value">✓ Dental & Vision Coverage</li>
                    <li *ngIf="offerForm.get('retirement401k')?.value">✓ 401(k) / Retirement Plan with Company Match</li>
                    <li *ngIf="offerForm.get('paidTimeOff')?.value">✓ Paid Time Off (PTO) - 20 days annually</li>
                    <li *ngIf="offerForm.get('flexibleSchedule')?.value">✓ Flexible Work Schedule</li>
                    <li *ngIf="offerForm.get('workFromHome')?.value">✓ Remote Work Options</li>
                    <li *ngIf="offerForm.get('professionalDevelopment')?.value">✓ Professional Development & Training Budget</li>
                    <li *ngIf="offerForm.get('gymMembership')?.value">✓ Gym Membership / Wellness Program</li>
                    <li *ngIf="offerForm.get('additionalBenefits')?.value">{{ offerForm.get('additionalBenefits')?.value }}</li>
                  </ul>

                  <h3>Terms & Conditions:</h3>
                  <p>This offer is contingent upon:</p>
                  <ul>
                    <li>Successful completion of background check and reference verification</li>
                    <li>Proof of eligibility to work in the country</li>
                    <li>Signing of employment agreement and company policies</li>
                    <li>Completion of any required pre-employment assessments</li>
                  </ul>

                  <p *ngIf="offerForm.get('additionalNotes')?.value" class="additional-notes">
                    <strong>Additional Notes:</strong><br>
                    {{ offerForm.get('additionalNotes')?.value }}
                  </p>

                  <p>This offer is valid until <strong>{{ (offerForm.get('offerExpiryDate')?.value | date:'fullDate') || 'pending' }}</strong>. 
                  Please confirm your acceptance by signing and returning this letter by the expiry date.</p>

                  <p>We are excited about the possibility of you joining our team and look forward to your positive response. 
                  If you have any questions regarding this offer, please do not hesitate to contact us.</p>

                  <p>Sincerely,</p>

                  <div class="signature-section">
                    <p><strong>{{ hiringManagerName }}</strong></p>
                    <p>{{ hiringManagerTitle }}</p>
                    <p>{{ companyName }}</p>
                  </div>

                  <mat-divider></mat-divider>

                  <div class="acceptance-section">
                    <h3>Candidate Acceptance:</h3>
                    <p>I, {{ data.name }}, accept the above offer of employment with {{ companyName }}.</p>
                    <div class="signature-fields">
                      <p>Signature: ___________________________</p>
                      <p>Date: ___________________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-button (click)="selectedTabIndex = 0" *ngIf="selectedTabIndex === 1">
          <mat-icon>edit</mat-icon>
          Edit Details
        </button>
        <button mat-raised-button color="accent" (click)="selectedTabIndex = 1" *ngIf="selectedTabIndex === 0" [disabled]="offerForm.invalid">
          <mat-icon>preview</mat-icon>
          Preview Letter
        </button>
        <button mat-raised-button color="primary" (click)="sendOffer()" [disabled]="offerForm.invalid">
          <mat-icon>send</mat-icon>
          Send Offer
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .make-offer-dialog {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 0 -24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 24px;
        font-weight: 500;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      button {
        color: white;
      }
    }

    mat-dialog-content {
      flex: 1;
      padding: 24px !important;
      overflow-y: auto;
      width: 100%;
    }

    .tab-content {
      padding: 24px 0;
      width: 100%;
    }

    .candidate-info {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-radius: 12px;
      margin-bottom: 32px;

      .candidate-avatar {
        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #667eea;
        }
      }

      .candidate-details {
        flex: 1;

        h3 {
          margin: 0 0 6px 0;
          font-size: 22px;
          color: #333;
        }

        p {
          margin: 0 0 12px 0;
          color: #666;
          font-size: 15px;
        }

        .candidate-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;

          span {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #666;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #667eea;
            }
          }
        }
      }
    }

    .offer-form {
      width: 100%;

      .form-section {
        margin-bottom: 32px;

        h4 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 20px 0;
          color: #333;
          font-size: 18px;
          font-weight: 500;

          mat-icon {
            color: #667eea;
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
        }

        mat-divider {
          margin: 32px 0;
        }
      }

      .form-row {
        margin-bottom: 16px;
        width: 100%;

        &.two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        mat-form-field {
          width: 100%;

          &.full-width {
            width: 100%;
          }
        }
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;

        mat-checkbox {
          ::ng-deep .mdc-label {
            font-size: 14px;
          }
        }
      }
    }

    .letter-preview {
      background: white;
      padding: 40px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-family: 'Times New Roman', serif;
      line-height: 1.6;

      .letter-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 24px;

        .company-logo {
          mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: #667eea;
          }
        }

        .company-info {
          h2 {
            margin: 0 0 8px 0;
            color: #333;
            font-size: 24px;
          }

          p {
            margin: 2px 0;
            color: #666;
            font-size: 13px;
          }
        }
      }

      mat-divider {
        margin: 24px 0;
      }

      .letter-date,
      .letter-recipient,
      .letter-subject {
        margin-bottom: 20px;

        p {
          margin: 4px 0;
          color: #333;
          font-size: 14px;
        }
      }

      .letter-body {
        p {
          margin: 16px 0;
          color: #333;
          font-size: 14px;
          text-align: justify;
        }

        h3 {
          margin: 24px 0 12px 0;
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
        }

        ul {
          margin: 12px 0;
          padding-left: 24px;

          li {
            margin: 8px 0;
            color: #333;
            font-size: 14px;
          }
        }

        .additional-notes {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
      }

      .signature-section {
        margin: 40px 0 20px 0;

        p {
          margin: 4px 0;
          color: #333;
          font-size: 14px;
        }
      }

      .acceptance-section {
        margin-top: 40px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;

        h3 {
          margin: 0 0 16px 0;
          color: #667eea;
          font-size: 16px;
        }

        p {
          margin: 12px 0;
          color: #333;
          font-size: 14px;
        }

        .signature-fields {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 0 -24px -24px -24px;
      justify-content: flex-end;
      gap: 12px;

      button {
        mat-icon {
          margin-right: 8px;
        }
      }
    }

    ::ng-deep .mat-mdc-tab-body-content {
      overflow: visible !important;
    }
  `]
})
export class MakeOfferDialogComponent implements OnInit {
  offerForm: FormGroup;
  selectedTabIndex = 0;
  today = new Date();
  
  // Company details (these would typically come from a service)
  companyName = 'RGUHS Learning Management System';
  companyAddress = '123 University Street, Bangalore, Karnataka 560001';
  companyEmail = 'hr@rguhs.edu';
  companyPhone = '+91-80-12345678';
  hiringManagerName = 'Dr. Rajesh Kumar';
  hiringManagerTitle = 'Head of Human Resources';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MakeOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offerForm = this.fb.group({
      jobTitle: [this.data.appliedPosition, Validators.required],
      department: ['Engineering', Validators.required],
      employmentType: ['Full-Time', Validators.required],
      workLocation: ['Hybrid', Validators.required],
      annualSalary: ['', [Validators.required, Validators.min(0)]],
      signingBonus: [0],
      annualBonus: [''],
      stockOptions: [''],
      healthInsurance: [true],
      dentalVision: [true],
      retirement401k: [true],
      paidTimeOff: [true],
      flexibleSchedule: [true],
      workFromHome: [true],
      professionalDevelopment: [true],
      gymMembership: [false],
      additionalBenefits: [''],
      startDate: ['', Validators.required],
      offerExpiryDate: ['', Validators.required],
      additionalNotes: ['']
    });
  }

  ngOnInit(): void {
    // Set default dates
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 30); // 30 days from now
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
    
    this.offerForm.patchValue({
      startDate: startDate,
      offerExpiryDate: expiryDate
    });
  }

  sendOffer(): void {
    if (this.offerForm.valid) {
      const offerData = {
        ...this.offerForm.value,
        candidate: this.data,
        offerDate: new Date(),
        status: 'pending'
      };
      
      console.log('Sending offer:', offerData);
      this.dialogRef.close(offerData);
    }
  }
}
