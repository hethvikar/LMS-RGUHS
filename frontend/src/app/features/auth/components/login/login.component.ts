import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest, RegisterRequest } from '../../../../core/services/auth.service';
import { AppState } from '../../../../core/store';
import * as AuthActions from '../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  selectedTab = 0;
  hidePassword = true;
  isLoading = false;
  currentYear = new Date().getFullYear();

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

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['student', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData: LoginRequest = this.loginForm.value;

      // Dispatch NgRx login action (effects will handle the auth service call)
      this.store.dispatch(AuthActions.login({ 
        email: loginData.email, 
        password: loginData.password 
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
        }
      });

      // Handle errors via auth service
      setTimeout(() => {
        if (this.isLoading) {
          const user = this.authService.getCurrentUser();
          if (!user) {
            this.isLoading = false;
            this.snackBar.open('Login failed', 'Close', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        }
      }, 5000);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const registerData: RegisterRequest = this.registerForm.value;

      // Use AuthService for registration
      this.authService.mockRegister(registerData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Registration successful! Please check your email to verify your account.', 'Close', {
            duration: 5000,
            panelClass: 'success-snackbar'
          });
          this.selectedTab = 0;
          this.registerForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
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
