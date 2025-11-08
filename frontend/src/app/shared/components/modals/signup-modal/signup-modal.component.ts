import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      transition(':enter', [
        animate('0.3s ease-out', style({
          opacity: 1,
          transform: 'scale(1)'
        }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({
          opacity: 0,
          transform: 'scale(0.8)'
        }))
      ])
    ]),
    trigger('backdropAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('0.3s ease-out', style({ opacity: 1 }))),
      transition(':leave', animate('0.2s ease-in', style({ opacity: 0 })))
    ])
  ]
})
export class SignupModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  userTypes = [
    { value: 'student', label: 'Student', icon: 'school' },
    { value: 'company', label: 'Company', icon: 'business' }
  ];

  selectedUserType = 'student';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  selectUserType(type: string): void {
    this.selectedUserType = type;
    this.errorMessage = '';
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Simulate signup API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Navigate to appropriate onboarding page
        if (this.selectedUserType === 'student') {
          this.router.navigate(['/student/onboarding']);
        } else {
          this.router.navigate(['/company/onboarding']);
        }
        
        this.closeModal();
      }, 1500);
    } else {
      this.markFormGroupTouched(this.signupForm);
      
      if (this.signupForm.hasError('passwordMismatch')) {
        this.errorMessage = 'Passwords do not match.';
      } else {
        this.errorMessage = 'Please fill in all required fields correctly.';
      }
    }
  }

  onLoginClick(): void {
    this.switchToLogin.emit();
  }

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid 10-digit phone number';
    }
    if (fieldName === 'confirmPassword' && this.signupForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }
}
