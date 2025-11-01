import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'student' | 'instructor';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  department?: string;
  phone?: string;
  createdDate?: Date;
  lastLogin?: Date;
  avatar?: string;
}

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.user ? 'Edit User' : 'Add New User' }}</h2>
      
      <mat-dialog-content>
        <form [formGroup]="userForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name *</mat-label>
            <input matInput formControlName="name" placeholder="Enter full name">
            <mat-error *ngIf="userForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email *</mat-label>
            <input matInput formControlName="email" placeholder="Enter email address">
            <mat-error *ngIf="userForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="userForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Role *</mat-label>
            <mat-select formControlName="role">
              <mat-option value="admin">Administrator</mat-option>
              <mat-option value="company">Company</mat-option>
              <mat-option value="student">Student</mat-option>
              <mat-option value="instructor">Instructor</mat-option>
            </mat-select>
            <mat-error *ngIf="userForm.get('role')?.hasError('required')">
              Role is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status *</mat-label>
            <mat-select formControlName="status">
              <mat-option value="active">Active</mat-option>
              <mat-option value="inactive">Inactive</mat-option>
              <mat-option value="suspended">Suspended</mat-option>
              <mat-option value="pending">Pending</mat-option>
            </mat-select>
            <mat-error *ngIf="userForm.get('status')?.hasError('required')">
              Status is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Department</mat-label>
            <input matInput formControlName="department" placeholder="Enter department">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="Enter phone number">
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" 
                (click)="onSubmit()" 
                [disabled]="!userForm.valid">
          {{ data.user ? 'Update User' : 'Add User' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
      padding: 20px;
    }

    mat-form-field.full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-actions {
      padding-top: 20px;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 20px;
    }
  `]
})
export class AddUserDialogComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const user = this.data?.user;
    
    this.userForm = this.fb.group({
      name: [user?.name || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      role: [user?.role || '', Validators.required],
      status: [user?.status || 'active', Validators.required],
      department: [user?.department || ''],
      phone: [user?.phone || '']
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}