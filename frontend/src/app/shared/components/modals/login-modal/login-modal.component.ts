import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';
import { AppState } from '../../../../core/store';
import * as AuthActions from '../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
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
export class LoginModalComponent implements OnInit {
  @Input() preselectedRole?: string;
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignup = new EventEmitter<void>();
  
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  userTypes = [
    { value: 'student', label: 'Student', icon: 'school' },
    { value: 'company', label: 'Company', icon: 'business' },
    { value: 'admin', label: 'Admin', icon: 'admin_panel_settings' }
  ];

  selectedUserType = 'student';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Check if user is already logged in with valid token and role
    this.checkExistingAuth();
  }

  ngOnInit(): void {
    // Check if user is already logged in with valid token and role
    this.checkExistingAuth();
    
    // Set preselected role if provided
    if (this.preselectedRole && this.userTypes.some(type => type.value === this.preselectedRole)) {
      this.selectedUserType = this.preselectedRole;
    }
  }

  private checkExistingAuth(): void {
    const authCheck = this.authService.isAuthenticatedWithValidRole();
    
    if (authCheck.isValid && authCheck.user && authCheck.shouldRedirect) {
      // User is already authenticated with valid role, redirect to appropriate dashboard
      this.redirectBasedOnRole(authCheck.user.role);
      this.closeModal();
    }
  }

  selectUserType(type: string): void {
    this.selectedUserType = type;
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = {
        ...this.loginForm.value,
        role: this.selectedUserType
      };

      // Dispatch NgRx login action (effects will handle the auth service call)
      this.store.dispatch(AuthActions.login({ 
        email: loginData.email, 
        password: loginData.password,
        role: loginData.role 
      }));

      // Subscribe to auth state to handle success/failure
      this.authService.isAuthenticated$.subscribe(isAuth => {
        if (isAuth) {
          this.isLoading = false;
          const user = this.authService.getCurrentUser();
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          if (user) {
            this.redirectBasedOnRole(user.role);
          }
          this.closeModal();
        }
      });

      // Handle errors via auth service
      setTimeout(() => {
        if (this.isLoading) {
          const user = this.authService.getCurrentUser();
          if (!user) {
            this.isLoading = false;
            this.errorMessage = 'Login failed. Please check your credentials.';
            this.snackBar.open('Login failed', 'Close', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        }
      }, 5000);
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  onForgotPassword(): void {
    // Navigate to forgot password page or open another modal
    this.router.navigate(['/auth/forgot-password']);
    this.closeModal();
  }

  onSignupClick(): void {
    this.switchToSignup.emit();
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
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `Password must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }

  redirectBasedOnRole(role: string) {
    const r = String(role || '').toLowerCase();
    switch (r) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'instructor':
        this.router.navigate(['/lms']);
        break;
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'company':
        this.router.navigate(['/company']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}
