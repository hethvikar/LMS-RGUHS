import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="change-password-dialog">
      <h2 mat-dialog-title>
        <mat-icon>lock</mat-icon>
        Change Password
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <form [formGroup]="changePasswordForm" class="password-form">
          <mat-form-field appearance="outline">
            <mat-label>Current Password</mat-label>
            <input matInput
                   type="password"
                   formControlName="currentPassword"
                   placeholder="Enter current password">
            <mat-icon matSuffix>visibility_off</mat-icon>
            <mat-error *ngIf="changePasswordForm.get('currentPassword')?.errors?.['required']">
              Current password is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>New Password</mat-label>
            <input matInput
                   type="password"
                   formControlName="newPassword"
                   placeholder="Enter new password">
            <mat-icon matSuffix>visibility_off</mat-icon>
            <mat-error *ngIf="changePasswordForm.get('newPassword')?.errors?.['required']">
              New password is required
            </mat-error>
            <mat-error *ngIf="changePasswordForm.get('newPassword')?.errors?.['minlength']">
              Password must be at least 8 characters long
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm New Password</mat-label>
            <input matInput
                   type="password"
                   formControlName="confirmPassword"
                   placeholder="Confirm new password">
            <mat-icon matSuffix>visibility_off</mat-icon>
            <mat-error *ngIf="changePasswordForm.get('confirmPassword')?.errors?.['required']">
              Please confirm your new password
            </mat-error>
            <mat-error *ngIf="changePasswordForm.errors?.['passwordMismatch']">
              Passwords do not match
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      
      <mat-dialog-actions>
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button 
                color="primary" 
                (click)="changePassword()"
                [disabled]="changePasswordForm.invalid">
          Change Password
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .change-password-dialog {
      width: 480px;
      max-width: 95vw;
      overflow: hidden;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 16px 0;
      color: #333;
      overflow: hidden;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 200px;
      overflow: hidden;
    }

    mat-form-field {
      width: 100%;
    }

    .dialog-content {
      overflow: hidden !important;
      padding: 0 24px 16px 24px !important;
      margin: 0 !important;
      max-height: none !important;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 24px 16px 24px !important;
      overflow: hidden;
      margin: 0 !important;
    }

    /* Remove scrollbars and ensure proper sizing */
    ::ng-deep .mat-mdc-dialog-container {
      overflow: hidden !important;
      max-height: none !important;
    }

    ::ng-deep .mat-mdc-dialog-content {
      overflow: hidden !important;
      max-height: none !important;
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    ::ng-deep .mat-mdc-dialog-content::-webkit-scrollbar {
      display: none !important;
    }
  `]
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      const formData = this.changePasswordForm.value;
      
      // TODO: Implement actual password change API call
      console.log('Change password request:', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Simulate API call
      setTimeout(() => {
        this.snackBar.open('Password changed successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      }, 1000);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}