import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

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
  // Phase 2 fields
  batchPreference?: string[]; // e.g., ['2024', '2023', 'Any']
  numberOfCandidates?: number;
  requestType?: 'open-job' | 'direct-request'; // Open job posting vs Direct candidate request
  isDirectRequest?: boolean; // Shortcut for requestType === 'direct-request'
}

@Component({
  selector: 'app-job-post-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="job-form-dialog">
      <div class="form-header">
        <h1 class="form-title">{{ data ? 'Edit Job Posting' : 'Create New Job Posting' }}</h1>
        <p class="form-subtitle">{{ data ? 'Update the job details below' : 'Fill in the details to create a new job posting' }}</p>
      </div>

      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="job-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Job Title</mat-label>
            <input matInput formControlName="title" placeholder="e.g., Senior Frontend Developer">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Department</mat-label>
            <mat-select formControlName="department">
              <mat-option value="Engineering">Engineering</mat-option>
              <mat-option value="Design">Design</mat-option>
              <mat-option value="Marketing">Marketing</mat-option>
              <mat-option value="Sales">Sales</mat-option>
              <mat-option value="HR">Human Resources</mat-option>
              <mat-option value="Finance">Finance</mat-option>
              <mat-option value="Operations">Operations</mat-option>
              <mat-option value="Product">Product</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" placeholder="e.g., Bangalore, India or Remote">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Employment Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="full-time">Full Time</mat-option>
              <mat-option value="part-time">Part Time</mat-option>
              <mat-option value="contract">Contract</mat-option>
              <mat-option value="internship">Internship</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Salary Range (Optional)</mat-label>
            <input matInput formControlName="salary" placeholder="e.g., ₹8,00,000 - ₹12,00,000">
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Experience Required</mat-label>
            <mat-select formControlName="experience">
              <mat-option value="0-1 years">0-1 years</mat-option>
              <mat-option value="1-3 years">1-3 years</mat-option>
              <mat-option value="3-5 years">3-5 years</mat-option>
              <mat-option value="5-8 years">5-8 years</mat-option>
              <mat-option value="8+ years">8+ years</mat-option>
              <mat-option value="Entry Level">Entry Level</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Education Required</mat-label>
            <mat-select formControlName="education">
              <mat-option value="High School">High School</mat-option>
              <mat-option value="Bachelor's Degree">Bachelor's Degree</mat-option>
              <mat-option value="Master's Degree">Master's Degree</mat-option>
              <mat-option value="PhD">PhD</mat-option>
              <mat-option value="Not Required">Not Required</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field" *ngIf="!data">
            <mat-label>Application Deadline (Optional)</mat-label>
            <input matInput type="date" formControlName="applicationDeadline">
          </mat-form-field>
        </div>

        <!-- Phase 2 Fields: Batch Preference & Candidate Count -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Batch Preference</mat-label>
            <mat-select formControlName="batchPreference" multiple>
              <mat-option value="2024">2024 Batch</mat-option>
              <mat-option value="2023">2023 Batch</mat-option>
              <mat-option value="2022">2022 Batch</mat-option>
              <mat-option value="2021">2021 Batch</mat-option>
              <mat-option value="Any">Any Batch</mat-option>
            </mat-select>
            <mat-hint>Select one or more batch years</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Number of Candidates Needed</mat-label>
            <input matInput type="number" formControlName="numberOfCandidates" min="1" placeholder="e.g., 5">
            <mat-hint>How many candidates are you looking for?</mat-hint>
          </mat-form-field>
        </div>

        <!-- Phase 2 Field: Request Type -->
        <div class="request-type-section">
          <h3 class="section-title">Request Type</h3>
          <mat-form-field appearance="outline" class="form-field full-width">
            <mat-label>Posting Type</mat-label>
            <mat-select formControlName="requestType">
              <mat-option value="open-job">Open Job Posting</mat-option>
              <mat-option value="direct-request">Direct Candidate Request (Admin Only)</mat-option>
            </mat-select>
            <mat-hint>
              <strong>Open Job:</strong> Visible to all students | 
              <strong>Direct Request:</strong> Admin will search and share matching profiles
            </mat-hint>
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="remoteWork" class="remote-checkbox">
          This position allows remote work
        </mat-checkbox>

        <mat-form-field appearance="outline" class="form-field full-width">
          <mat-label>Job Description</mat-label>
          <textarea matInput formControlName="description" rows="6"
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."></textarea>
        </mat-form-field>

        <div class="dynamic-fields">
          <div class="field-group">
            <h3>Key Requirements</h3>
            <div formArrayName="requirements" class="requirements-list">
              <div *ngFor="let req of requirements.controls; let i = index" class="requirement-item">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Requirement {{ i + 1 }}</mat-label>
                  <input matInput [formControl]="$any(req)">
                </mat-form-field>
                <button mat-icon-button type="button" (click)="removeRequirement(i)" [disabled]="requirements.length <= 1">
                  <span class="remove-icon">×</span>
                </button>
              </div>
            </div>
            <button mat-button type="button" (click)="addRequirement()" class="add-button">
              + Add Requirement
            </button>
          </div>

          <div class="field-group">
            <h3>Key Skills</h3>
            <div formArrayName="skills" class="skills-list">
              <div *ngFor="let skill of skills.controls; let i = index" class="skill-item">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Skill {{ i + 1 }}</mat-label>
                  <input matInput [formControl]="$any(skill)">
                </mat-form-field>
                <button mat-icon-button type="button" (click)="removeSkill(i)" [disabled]="skills.length <= 1">
                  <span class="remove-icon">×</span>
                </button>
              </div>
            </div>
            <button mat-button type="button" (click)="addSkill()" class="add-button">
              + Add Skill
            </button>
          </div>

          <div class="field-group">
            <h3>Benefits & Perks</h3>
            <div formArrayName="benefits" class="benefits-list">
              <div *ngFor="let benefit of benefits.controls; let i = index" class="benefit-item">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Benefit {{ i + 1 }}</mat-label>
                  <input matInput [formControl]="$any(benefit)">
                </mat-form-field>
                <button mat-icon-button type="button" (click)="removeBenefit(i)" [disabled]="benefits.length <= 1">
                  <span class="remove-icon">×</span>
                </button>
              </div>
            </div>
            <button mat-button type="button" (click)="addBenefit()" class="add-button">
              + Add Benefit
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="closeDialog()">
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!jobForm.valid">
            {{ data ? 'Update Job' : 'Create Job Posting' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }

    .job-form-dialog {
      width: 90vw;
      max-width: 900px;
      max-height: 90vh;
      margin: 0 auto;
      padding: 0;
      overflow-y: auto;
    }

    .form-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 12px 12px 0 0;
    }

    .form-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .form-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
    }

    .job-form {
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-field {
      flex: 1;
    }

    .form-field.full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    .remote-checkbox {
      margin-bottom: 24px;
    }

    .request-type-section {
      margin-bottom: 24px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 16px 0;
    }

    .dynamic-fields {
      margin: 32px 0;
    }

    .field-group {
      margin-bottom: 32px;
    }

    .field-group h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 16px;
    }

    .requirements-list, .skills-list, .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;
    }

    .requirement-item, .skill-item, .benefit-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .requirement-item .form-field, .skill-item .form-field, .benefit-item .form-field {
      flex: 1;
      margin-bottom: 0;
    }

    .remove-icon {
      font-size: 24px;
      color: #e74c3c;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
    }

    .add-button {
      color: #667eea;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }

    .form-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .form-header {
        padding: 24px;
      }

      .form-title {
        font-size: 1.5rem;
      }

      .job-form {
        padding: 24px;
      }

      .form-row {
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;
      }

      .requirement-item, .skill-item, .benefit-item {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class JobPostFormDialogComponent {
  jobForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobPostFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: JobPosting
  ) {
    this.jobForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      department: [data?.department || 'Engineering', [Validators.required]],
      location: [data?.location || '', [Validators.required]],
      type: [data?.type || 'full-time', [Validators.required]],
      salary: [data?.salary || ''],
      experience: [data?.experience || '1-3 years', [Validators.required]],
      education: [data?.education || 'Bachelor\'s Degree', [Validators.required]],
      description: [data?.description || '', [Validators.required, Validators.minLength(50)]],
      remoteWork: [data?.remoteWork || false],
      applicationDeadline: [data?.applicationDeadline || ''],
      // Phase 2 fields
      batchPreference: [data?.batchPreference || [], [Validators.required]],
      numberOfCandidates: [data?.numberOfCandidates || 1, [Validators.required, Validators.min(1)]],
      requestType: [data?.requestType || 'open-job', [Validators.required]],
      requirements: this.fb.array(
        data?.requirements?.length
          ? data.requirements.map(req => this.fb.control(req))
          : [this.fb.control('')]
      ),
      skills: this.fb.array(
        data?.skills?.length
          ? data.skills.map(skill => this.fb.control(skill))
          : [this.fb.control('')]
      ),
      benefits: this.fb.array(
        data?.benefits?.length
          ? data.benefits.map(benefit => this.fb.control(benefit))
          : [this.fb.control('')]
      )
    });
  }

  get requirements(): FormArray {
    return this.jobForm.get('requirements') as FormArray;
  }

  get skills(): FormArray {
    return this.jobForm.get('skills') as FormArray;
  }

  get benefits(): FormArray {
    return this.jobForm.get('benefits') as FormArray;
  }

  addRequirement() {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirement(index: number) {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  addSkill() {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  addBenefit() {
    this.benefits.push(this.fb.control(''));
  }

  removeBenefit(index: number) {
    if (this.benefits.length > 1) {
      this.benefits.removeAt(index);
    }
  }

  onSubmit() {
    if (this.jobForm.valid) {
      const formValue = this.jobForm.value;
      const jobPosting: JobPosting = {
        id: this.data?.id || Date.now(),
        title: formValue.title,
        department: formValue.department,
        location: formValue.location,
        type: formValue.type,
        status: this.data?.status || 'active',
        postedDate: this.data?.postedDate || new Date(),
        applicationsCount: this.data?.applicationsCount || 0,
        salary: formValue.salary || undefined,
        description: formValue.description,
        requirements: formValue.requirements.filter((req: string) => req.trim()),
        skills: formValue.skills.filter((skill: string) => skill.trim()),
        benefits: formValue.benefits.filter((benefit: string) => benefit.trim()),
        experience: formValue.experience,
        education: formValue.education,
        remoteWork: formValue.remoteWork,
        applicationDeadline: formValue.applicationDeadline ? new Date(formValue.applicationDeadline) : undefined,
        // Phase 2 fields
        batchPreference: formValue.batchPreference || [],
        numberOfCandidates: formValue.numberOfCandidates || 1,
        requestType: formValue.requestType || 'open-job',
        isDirectRequest: formValue.requestType === 'direct-request'
      };

      this.dialogRef.close({ action: this.data ? 'update' : 'create', job: jobPosting });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}