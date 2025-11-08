import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

interface Company {
  id: number;
  name: string;
  industry: string;
}

@Component({
  selector: 'app-share-profiles-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <div class="share-dialog">
      <h2 mat-dialog-title>Share Candidate Profiles</h2>
      
      <mat-dialog-content>
        <div class="selected-count">
          <mat-icon>people</mat-icon>
          <span>{{ data.profiles.length }} candidate(s) selected</span>
        </div>

        <div class="profiles-preview">
          <h3>Selected Candidates:</h3>
          <div class="profile-list">
            <mat-chip *ngFor="let profile of data.profiles">
              {{ profile.name }} ({{ profile.batch }})
            </mat-chip>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Select Company</mat-label>
          <mat-select [(ngModel)]="selectedCompanyId" required>
            <mat-option *ngFor="let company of companies" [value]="company.id">
              {{ company.name }} - {{ company.industry }}
            </mat-option>
          </mat-select>
          <mat-hint>Choose which company to share profiles with</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Message to Company (Optional)</mat-label>
          <textarea matInput [(ngModel)]="message" rows="4"
                    placeholder="Add a note for the company about these candidates..."></textarea>
        </mat-form-field>

        <div class="info-note">
          <mat-icon>info</mat-icon>
          <p>The company will receive access to view these candidate profiles including their resumes, 
             skills, certifications, and assessment scores.</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="share()" [disabled]="!selectedCompanyId">
          <mat-icon>share</mat-icon>
          Share Profiles
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .share-dialog {
      min-width: 500px;
    }

    .selected-count {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      margin-bottom: 24px;

      mat-icon {
        color: #1976d2;
      }

      span {
        font-weight: 500;
        color: #1976d2;
      }
    }

    .profiles-preview {
      margin-bottom: 24px;

      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #666;
        margin-bottom: 12px;
      }
    }

    .profile-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      max-height: 150px;
      overflow-y: auto;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .info-note {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fff3e0;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
      margin-top: 16px;

      mat-icon {
        color: #ff9800;
        flex-shrink: 0;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      margin: 0;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class ShareProfilesDialogComponent {
  selectedCompanyId: number | null = null;
  message: string = '';

  // Mock company data
  companies: Company[] = [
    { id: 1, name: 'TechCorp Solutions', industry: 'Software Development' },
    { id: 2, name: 'DataMinds Analytics', industry: 'Data Science' },
    { id: 3, name: 'CloudNine Systems', industry: 'Cloud Computing' },
    { id: 4, name: 'InnovateTech', industry: 'Product Development' },
    { id: 5, name: 'CyberSecure Inc', industry: 'Cybersecurity' }
  ];

  constructor(
    private dialogRef: MatDialogRef<ShareProfilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  share() {
    if (!this.selectedCompanyId) {
      return;
    }

    const selectedCompany = this.companies.find(c => c.id === this.selectedCompanyId);
    
    this.dialogRef.close({
      action: 'shared',
      companyId: this.selectedCompanyId,
      companyName: selectedCompany?.name,
      message: this.message,
      profiles: this.data.profiles
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
