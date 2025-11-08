import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  companyInfoForm: FormGroup;
  contactDetailsForm: FormGroup;
  verificationForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  industries = [
    'Information Technology',
    'Healthcare',
    'Finance & Banking',
    'Manufacturing',
    'Retail & E-commerce',
    'Education',
    'Consulting',
    'Telecommunications',
    'Automotive',
    'Pharmaceuticals',
    'Real Estate',
    'Energy & Utilities',
    'Media & Entertainment',
    'Other'
  ];

  companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.companyInfoForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      industry: ['', Validators.required],
      website: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+\..+/)]],
      companySize: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]]
    });

    this.contactDetailsForm = this.fb.group({
      contactPersonName: ['', [Validators.required, Validators.minLength(3)]],
      designation: ['', Validators.required],
      officialEmail: ['', [Validators.required, Validators.email, this.corporateEmailValidator]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      hrEmail: ['', [Validators.email]],
      linkedInProfile: ['', [Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.+/)]]
    });

    this.verificationForm = this.fb.group({
      gstNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      cinNumber: ['', [Validators.pattern(/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom Validators
  corporateEmailValidator(control: any) {
    const email = control.value;
    if (!email) return null;

    const freeEmailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'aol.com', 'mail.com', 'protonmail.com', 'icloud.com',
      'yopmail.com', 'tempmail.com', 'guerrillamail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (freeEmailDomains.includes(domain)) {
      return { nonCorporateEmail: true };
    }

    return null;
  }

  passwordStrengthValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    return valid ? null : { weakPassword: true };
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submitRegistration() {
    if (this.companyInfoForm.valid && this.contactDetailsForm.valid && this.verificationForm.valid) {
      const registrationData = {
        ...this.companyInfoForm.value,
        ...this.contactDetailsForm.value,
        gstNumber: this.verificationForm.value.gstNumber,
        cinNumber: this.verificationForm.value.cinNumber,
        password: this.verificationForm.value.password,
        status: 'pending_approval', // Initial status
        registrationDate: new Date().toISOString()
      };

      console.log('Company Registration Data:', registrationData);

      // TODO: Call API to submit registration
      // this.authService.registerCompany(registrationData).subscribe({
      //   next: (response) => {
      //     // Show success message
      //     // Navigate to pending approval page
      //     this.router.navigate(['/auth/registration-pending']);
      //   },
      //   error: (error) => {
      //     console.error('Registration failed:', error);
      //   }
      // });

      // For now, navigate to login with success message
      alert('Registration submitted successfully! Your account will be reviewed by our team within 24-48 hours.');
      this.router.navigate(['/auth/login']);
    }
  }

  getPasswordStrength(): string {
    const password = this.verificationForm.get('password')?.value;
    if (!password) return '';

    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    if (password.length >= 12) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  }
}
