import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAuth from '../../../core/store/auth/auth.reducer';
import { AppState } from '../../../core/store';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface ReportIssue {
  id?: string;
  title: string;
  category: string;
  priority: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  browserInfo?: string;
  attachments?: File[];
  userEmail: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  status: 'submitted' | 'in-progress' | 'resolved';
}

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule,
    RouterModule
  ],
  template: `
    <div class="report-issue-container">
      <div class="header-section">
        <button mat-icon-button routerLink="/help" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>bug_report</mat-icon>
            Report an Issue
          </h1>
          <p class="subtitle">Help us improve the platform by reporting bugs, issues, or providing feedback</p>
        </div>
      </div>

      <div class="form-container">
        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Issue Details -->
          <mat-step [stepControl]="issueDetailsForm" label="Issue Details">
            <form [formGroup]="issueDetailsForm">
              <mat-card class="step-card">
                <mat-card-header>
                  <mat-card-title>Tell us about the issue</mat-card-title>
                  <mat-card-subtitle>Provide basic information about the problem</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content>
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Issue Title</mat-label>
                      <input matInput formControlName="title" placeholder="Brief description of the issue">
                      <mat-error *ngIf="issueDetailsForm.get('title')?.hasError('required')">
                        Issue title is required
                      </mat-error>
                      <mat-error *ngIf="issueDetailsForm.get('title')?.hasError('minlength')">
                        Title must be at least 5 characters long
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Category</mat-label>
                      <mat-select formControlName="category">
                        <mat-option value="bug">🐛 Bug Report</mat-option>
                        <mat-option value="feature">✨ Feature Request</mat-option>
                        <mat-option value="ui-ux">🎨 UI/UX Issue</mat-option>
                        <mat-option value="performance">⚡ Performance Issue</mat-option>
                        <mat-option value="security">🔒 Security Concern</mat-option>
                        <mat-option value="accessibility">♿ Accessibility Issue</mat-option>
                        <mat-option value="data">📊 Data Issue</mat-option>
                        <mat-option value="integration">🔗 Integration Problem</mat-option>
                        <mat-option value="other">🔧 Other</mat-option>
                      </mat-select>
                      <mat-error *ngIf="issueDetailsForm.get('category')?.hasError('required')">
                        Please select a category
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Priority</mat-label>
                      <mat-select formControlName="priority">
                        <mat-option value="low">🟢 Low - Minor issue</mat-option>
                        <mat-option value="medium">🟡 Medium - Affects some functionality</mat-option>
                        <mat-option value="high">🟠 High - Major functionality broken</mat-option>
                        <mat-option value="critical">🔴 Critical - System unusable</mat-option>
                      </mat-select>
                      <mat-error *ngIf="issueDetailsForm.get('priority')?.hasError('required')">
                        Please select priority level
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Description</mat-label>
                      <textarea matInput 
                                formControlName="description" 
                                rows="6" 
                                placeholder="Describe the issue in detail. What happened? When did it occur?">
                      </textarea>
                      <mat-hint>Provide as much detail as possible (minimum 20 characters)</mat-hint>
                      <mat-error *ngIf="issueDetailsForm.get('description')?.hasError('required')">
                        Description is required
                      </mat-error>
                      <mat-error *ngIf="issueDetailsForm.get('description')?.hasError('minlength')">
                        Description must be at least 20 characters long
                      </mat-error>
                    </mat-form-field>
                  </div>
                </mat-card-content>

                <mat-card-actions>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="!issueDetailsForm.valid">
                    Next Step
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </form>
          </mat-step>

          <!-- Step 2: Additional Information -->
          <mat-step [stepControl]="additionalInfoForm" label="Additional Information">
            <form [formGroup]="additionalInfoForm">
              <mat-card class="step-card">
                <mat-card-header>
                  <mat-card-title>Additional Details</mat-card-title>
                  <mat-card-subtitle>Help us understand and reproduce the issue (Optional but recommended)</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content>
                  <mat-expansion-panel class="info-panel">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>list_alt</mat-icon>
                        Steps to Reproduce
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Steps to Reproduce</mat-label>
                      <textarea matInput 
                                formControlName="stepsToReproduce" 
                                rows="4" 
                                placeholder="1. Go to...&#10;2. Click on...&#10;3. Enter...&#10;4. Observe the issue">
                      </textarea>
                      <mat-hint>List the exact steps that lead to the issue</mat-hint>
                    </mat-form-field>
                  </mat-expansion-panel>

                  <mat-expansion-panel class="info-panel">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>check_circle</mat-icon>
                        Expected vs Actual Behavior
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    <div class="form-row">
                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Expected Behavior</mat-label>
                        <textarea matInput 
                                  formControlName="expectedBehavior" 
                                  rows="3" 
                                  placeholder="What should happen?">
                        </textarea>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Actual Behavior</mat-label>
                        <textarea matInput 
                                  formControlName="actualBehavior" 
                                  rows="3" 
                                  placeholder="What actually happens?">
                        </textarea>
                      </mat-form-field>
                    </div>
                  </mat-expansion-panel>

                  <mat-expansion-panel class="info-panel" [expanded]="true">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>computer</mat-icon>
                        System Information
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    <div class="system-info">
                      <p><strong>Detected Browser:</strong> {{ browserInfo.name }} {{ browserInfo.version }}</p>
                      <p><strong>Operating System:</strong> {{ browserInfo.os }}</p>
                      <p><strong>Screen Resolution:</strong> {{ browserInfo.screenResolution }}</p>
                      <p><strong>User Agent:</strong> {{ browserInfo.userAgent }}</p>
                      
                      <mat-checkbox formControlName="includeSystemInfo" class="system-checkbox">
                        Include this system information in the report
                      </mat-checkbox>
                    </div>
                  </mat-expansion-panel>
                </mat-card-content>

                <mat-card-actions>
                  <button mat-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon>
                    Previous
                  </button>
                  <button mat-raised-button color="primary" matStepperNext>
                    Next Step
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </form>
          </mat-step>

          <!-- Step 3: Review and Submit -->
          <mat-step label="Review & Submit">
            <mat-card class="step-card">
              <mat-card-header>
                <mat-card-title>Review Your Report</mat-card-title>
                <mat-card-subtitle>Please review the information before submitting</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="review-section">
                  <h3><mat-icon>info</mat-icon> Issue Details</h3>
                  <div class="review-item">
                    <strong>Title:</strong> {{ issueDetailsForm.get('title')?.value }}
                  </div>
                  <div class="review-item">
                    <strong>Category:</strong> {{ getCategoryLabel(issueDetailsForm.get('category')?.value) }}
                  </div>
                  <div class="review-item">
                    <strong>Priority:</strong> {{ getPriorityLabel(issueDetailsForm.get('priority')?.value) }}
                  </div>
                  <div class="review-item">
                    <strong>Description:</strong>
                    <p class="description-text">{{ issueDetailsForm.get('description')?.value }}</p>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="review-section" *ngIf="hasAdditionalInfo()">
                  <h3><mat-icon>add_circle</mat-icon> Additional Information</h3>
                  <div class="review-item" *ngIf="additionalInfoForm.get('stepsToReproduce')?.value">
                    <strong>Steps to Reproduce:</strong>
                    <pre class="steps-text">{{ additionalInfoForm.get('stepsToReproduce')?.value }}</pre>
                  </div>
                  <div class="review-item" *ngIf="additionalInfoForm.get('expectedBehavior')?.value || additionalInfoForm.get('actualBehavior')?.value">
                    <strong>Expected vs Actual:</strong>
                    <div class="behavior-comparison">
                      <div *ngIf="additionalInfoForm.get('expectedBehavior')?.value">
                        <em>Expected:</em> {{ additionalInfoForm.get('expectedBehavior')?.value }}
                      </div>
                      <div *ngIf="additionalInfoForm.get('actualBehavior')?.value">
                        <em>Actual:</em> {{ additionalInfoForm.get('actualBehavior')?.value }}
                      </div>
                    </div>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="review-section">
                  <h3><mat-icon>person</mat-icon> Reporter Information</h3>
                  <div class="review-item">
                    <strong>Name:</strong> {{ currentUser?.name }}
                  </div>
                  <div class="review-item">
                    <strong>Email:</strong> {{ currentUser?.email }}
                  </div>
                  <div class="review-item">
                    <strong>Role:</strong> {{ getRoleDisplayName(currentUser?.role) }}
                  </div>
                </div>

                <div class="submission-note">
                  <mat-icon>info</mat-icon>
                  <p>
                    By submitting this report, you acknowledge that the information provided is accurate 
                    and you consent to our support team contacting you for additional details if needed.
                  </p>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button matStepperPrevious [disabled]="isSubmitting">
                  <mat-icon>arrow_back</mat-icon>
                  Previous
                </button>
                <button mat-raised-button 
                        color="primary" 
                        (click)="submitReport()" 
                        [disabled]="isSubmitting">
                  <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!isSubmitting">send</mat-icon>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
                </button>
              </mat-card-actions>
            </mat-card>
          </mat-step>

          <!-- Step 4: Confirmation -->
          <mat-step label="Confirmation" [completed]="reportSubmitted">
            <mat-card class="step-card success-card" *ngIf="reportSubmitted">
              <mat-card-content class="success-content">
                <div class="success-icon">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <h2>Report Submitted Successfully!</h2>
                <p>Thank you for helping us improve the platform.</p>
                
                <div class="report-details">
                  <div class="detail-item">
                    <strong>Report ID:</strong> {{ submittedReportId }}
                  </div>
                  <div class="detail-item">
                    <strong>Submitted:</strong> {{ getCurrentDateTimeString() }}
                  </div>
                  <div class="detail-item">
                    <strong>Status:</strong> <span class="status-badge">Under Review</span>
                  </div>
                </div>

                <div class="next-steps">
                  <h3>What happens next?</h3>
                  <ul>
                    <li>Our support team will review your report within 24 hours</li>
                    <li>You'll receive an email confirmation at {{ currentUser?.email }}</li>
                    <li>We may contact you for additional information if needed</li>
                    <li>You'll be notified once the issue is resolved</li>
                  </ul>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-raised-button color="primary" routerLink="/help">
                  <mat-icon>home</mat-icon>
                  Back to Help
                </button>
                <button mat-button (click)="resetForm()">
                  <mat-icon>add</mat-icon>
                  Report Another Issue
                </button>
              </mat-card-actions>
            </mat-card>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
  styles: [`
    .report-issue-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
      min-height: calc(100vh - 200px);
    }

    .header-section {
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      gap: 16px;
    }

    .back-button {
      flex-shrink: 0;
    }

    .header-content {
      flex: 1;
    }

    .header-content h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #333;
      font-size: 28px;
      font-weight: 500;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .form-container {
      margin-top: 24px;
    }

    .step-card {
      margin: 16px 0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .info-panel {
      margin: 16px 0;
    }

    .info-panel mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .system-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .system-info p {
      margin: 8px 0;
      font-size: 14px;
    }

    .system-checkbox {
      margin-top: 16px;
    }

    .review-section {
      margin: 24px 0;
    }

    .review-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #333;
      margin-bottom: 16px;
    }

    .review-item {
      margin: 12px 0;
      padding: 8px 0;
    }

    .review-item strong {
      color: #555;
    }

    .description-text {
      margin: 8px 0;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
      white-space: pre-wrap;
    }

    .steps-text {
      margin: 8px 0;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
      font-family: inherit;
      white-space: pre-wrap;
    }

    .behavior-comparison {
      margin: 8px 0;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .behavior-comparison > div {
      margin: 8px 0;
    }

    .submission-note {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin: 24px 0;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
    }

    .submission-note mat-icon {
      color: #1976d2;
      margin-top: 2px;
    }

    .submission-note p {
      margin: 0;
      font-size: 14px;
      color: #555;
    }

    .success-card {
      text-align: center;
    }

    .success-content {
      padding: 32px !important;
    }

    .success-icon {
      margin-bottom: 24px;
    }

    .success-icon mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4caf50;
    }

    .success-content h2 {
      color: #333;
      margin: 0 0 16px 0;
    }

    .success-content > p {
      color: #666;
      font-size: 16px;
      margin-bottom: 32px;
    }

    .report-details {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
      text-align: left;
    }

    .detail-item {
      margin: 8px 0;
    }

    .status-badge {
      background: #ff9800;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .next-steps {
      text-align: left;
      margin: 24px 0;
    }

    .next-steps h3 {
      color: #333;
      margin-bottom: 12px;
    }

    .next-steps ul {
      padding-left: 20px;
    }

    .next-steps li {
      margin: 8px 0;
      color: #666;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px !important;
    }

    mat-spinner {
      margin-right: 8px;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .report-issue-container {
        padding: 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 12px;
      }

      .half-width {
        width: 100%;
      }

      .header-content h1 {
        font-size: 24px;
      }

      mat-card-actions {
        flex-direction: column;
      }

      mat-card-actions button {
        width: 100%;
      }
    }
  `]
})
export class ReportIssueComponent implements OnInit {
  issueDetailsForm!: FormGroup;
  additionalInfoForm!: FormGroup;
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;
  
  isSubmitting = false;
  reportSubmitted = false;
  submittedReportId = '';
  
  browserInfo = {
    name: '',
    version: '',
    os: '',
    screenResolution: '',
    userAgent: ''
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.currentUser$ = this.store.select(fromAuth.selectUser);
    this.detectBrowserInfo();
    this.initializeForms();
  }

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  initializeForms() {
    this.issueDetailsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      priority: ['medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });

    this.additionalInfoForm = this.fb.group({
      stepsToReproduce: [''],
      expectedBehavior: [''],
      actualBehavior: [''],
      includeSystemInfo: [true]
    });
  }

  detectBrowserInfo() {
    const navigator = window.navigator;
    const userAgent = navigator.userAgent;
    
    // Detect browser
    if (userAgent.indexOf('Chrome') > -1) {
      this.browserInfo.name = 'Chrome';
      this.browserInfo.version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Firefox') > -1) {
      this.browserInfo.name = 'Firefox';
      this.browserInfo.version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      this.browserInfo.name = 'Safari';
      this.browserInfo.version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Edge') > -1) {
      this.browserInfo.name = 'Edge';
      this.browserInfo.version = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || '';
    } else {
      this.browserInfo.name = 'Unknown';
    }

    // Detect OS
    if (userAgent.indexOf('Windows') > -1) this.browserInfo.os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) this.browserInfo.os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) this.browserInfo.os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) this.browserInfo.os = 'Android';
    else if (userAgent.indexOf('iOS') > -1) this.browserInfo.os = 'iOS';
    else this.browserInfo.os = 'Unknown';

    this.browserInfo.screenResolution = `${screen.width}x${screen.height}`;
    this.browserInfo.userAgent = userAgent;
  }

  getCategoryLabel(value: string): string {
    const categories: { [key: string]: string } = {
      'bug': '🐛 Bug Report',
      'feature': '✨ Feature Request',
      'ui-ux': '🎨 UI/UX Issue',
      'performance': '⚡ Performance Issue',
      'security': '🔒 Security Concern',
      'accessibility': '♿ Accessibility Issue',
      'data': '📊 Data Issue',
      'integration': '🔗 Integration Problem',
      'other': '🔧 Other'
    };
    return categories[value] || value;
  }

  getPriorityLabel(value: string): string {
    const priorities: { [key: string]: string } = {
      'low': '🟢 Low - Minor issue',
      'medium': '🟡 Medium - Affects some functionality',
      'high': '🟠 High - Major functionality broken',
      'critical': '🔴 Critical - System unusable'
    };
    return priorities[value] || value;
  }

  getRoleDisplayName(role?: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrator',
      'instructor': 'Instructor',
      'student': 'Student',
      'company': 'Company'
    };
    return roleMap[role || ''] || role || '';
  }

  getCurrentDateTimeString(): string {
    return new Date().toLocaleString();
  }

  hasAdditionalInfo(): boolean {
    const form = this.additionalInfoForm;
    return !!(
      form.get('stepsToReproduce')?.value ||
      form.get('expectedBehavior')?.value ||
      form.get('actualBehavior')?.value
    );
  }

  async submitReport() {
    if (!this.issueDetailsForm.valid || !this.currentUser) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    const reportData: ReportIssue = {
      id: this.generateReportId(),
      title: this.issueDetailsForm.get('title')?.value,
      category: this.issueDetailsForm.get('category')?.value,
      priority: this.issueDetailsForm.get('priority')?.value,
      description: this.issueDetailsForm.get('description')?.value,
      stepsToReproduce: this.additionalInfoForm.get('stepsToReproduce')?.value,
      expectedBehavior: this.additionalInfoForm.get('expectedBehavior')?.value,
      actualBehavior: this.additionalInfoForm.get('actualBehavior')?.value,
      browserInfo: this.additionalInfoForm.get('includeSystemInfo')?.value ? 
        `${this.browserInfo.name} ${this.browserInfo.version} on ${this.browserInfo.os}` : undefined,
      userEmail: this.currentUser.email,
      userName: this.currentUser.name,
      userRole: this.currentUser.role,
      timestamp: new Date(),
      status: 'submitted'
    };

    try {
      // Simulate API call
      await this.simulateSubmission(reportData);
      
      this.submittedReportId = reportData.id!;
      this.reportSubmitted = true;
      this.isSubmitting = false;
      
      this.snackBar.open('Report submitted successfully!', 'Close', { 
        duration: 5000,
        panelClass: 'success-snackbar'
      });
      
    } catch (error) {
      this.isSubmitting = false;
      this.snackBar.open('Failed to submit report. Please try again.', 'Close', { 
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }

  private async simulateSubmission(reportData: ReportIssue): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store in localStorage for demo purposes
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    reports.push(reportData);
    localStorage.setItem('userReports', JSON.stringify(reports));
    
    console.log('Report submitted:', reportData);
  }

  private generateReportId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `RPT-${timestamp.slice(-8)}-${random}`;
  }

  resetForm() {
    this.issueDetailsForm.reset();
    this.additionalInfoForm.reset();
    this.additionalInfoForm.patchValue({ 
      includeSystemInfo: true 
    });
    this.issueDetailsForm.patchValue({ 
      priority: 'medium' 
    });
    this.reportSubmitted = false;
    this.submittedReportId = '';
  }
}