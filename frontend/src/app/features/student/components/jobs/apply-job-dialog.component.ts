import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { JobService, Job } from '../../services/job.service';

@Component({
  selector: 'app-apply-job-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './apply-job-dialog.component.html',
  styleUrls: ['./apply-job-dialog.component.scss']
})
export class ApplyJobDialogComponent implements OnInit {
  applicationForm!: FormGroup;
  job: Job;
  submitting = false;
  currentStep = 0;

  // Resume upload
  selectedResume: File | null = null;
  resumePreview: string | null = null;

  // Availability options
  availabilityOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: '15-days', label: 'Within 15 days' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-months', label: 'Within 2 months' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ApplyJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { job: Job },
    private fb: FormBuilder,
    private jobService: JobService
  ) {
    this.job = data.job;
  }

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      // Step 1: Basic Info
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      
      // Step 2: Professional Info
      resume: [null, Validators.required],
      coverLetter: [''],
      linkedinProfile: ['', Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*$/)],
      portfolioUrl: ['', Validators.pattern(/^https?:\/\/.*$/)],
      
      // Step 3: Additional Info
      expectedSalary: ['', [Validators.min(0)]],
      availability: ['', Validators.required],
      noticePeriod: [''],
      willingToRelocate: [false],
      additionalInfo: [''],
      
      // Terms
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  onResumeSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      this.selectedResume = file;
      this.resumePreview = file.name;
      this.applicationForm.patchValue({ resume: file });
    }
  }

  removeResume(): void {
    this.selectedResume = null;
    this.resumePreview = null;
    this.applicationForm.patchValue({ resume: null });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched(this.applicationForm);
      return;
    }

    this.submitting = true;

    const formValue = this.applicationForm.value;
    const application = {
      jobId: this.job.id,
      resume: this.selectedResume!,
      coverLetter: formValue.coverLetter,
      additionalInfo: formValue.additionalInfo,
      expectedSalary: formValue.expectedSalary,
      availability: formValue.availability
    };

    this.jobService.applyToJob(application).subscribe({
      next: (response) => {
        this.submitting = false;
        this.dialogRef.close({ success: true, message: response.message });
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.submitting = false;
        alert('Error submitting application. Please try again.');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.applicationForm.dirty) {
      const confirmed = confirm('Are you sure you want to cancel? Your changes will be lost.');
      if (confirmed) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.applicationForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['pattern']) {
      if (fieldName === 'phone') return 'Invalid phone number (10 digits)';
      if (fieldName === 'linkedinProfile') return 'Invalid LinkedIn URL';
      if (fieldName === 'portfolioUrl') return 'Invalid URL';
    }
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    }
    if (control.errors['min']) return 'Value must be greater than 0';

    return '';
  }
}
