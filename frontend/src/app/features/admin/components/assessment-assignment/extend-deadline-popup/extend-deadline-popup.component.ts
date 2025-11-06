import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

interface AssessmentAssignment {
  id: number;
  assessmentId: number;
  assessmentTitle: string;
  studentId: number;
  studentName: string;
  courseName: string;
  assignedDate: Date;
  dueDate: Date;
  status: 'assigned' | 'in-progress' | 'submitted' | 'graded' | 'overdue';
  score?: number;
  maxScore: number;
  submittedDate?: Date;
  gradedDate?: Date;
  attempts: number;
  maxAttempts: number;
}

@Component({
  selector: 'app-extend-deadline-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule
  ],
  templateUrl: './extend-deadline-popup.component.html',
  styleUrls: ['./extend-deadline-popup.component.scss']
})
export class ExtendDeadlinePopupComponent implements OnInit {
  @Input() assignment: AssessmentAssignment | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() extend = new EventEmitter<{
    id: number;
    newDueDate: Date;
    reason: string;
  }>();

  currentDueDate: Date | null = null;
  newDueDate: Date | null = null;
  extensionType: 'quick' | 'custom' = 'quick';
  quickExtensionDays: number = 7;
  reason: string = '';

  quickOptions = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '7 Days (1 Week)' },
    { value: 14, label: '14 Days (2 Weeks)' },
    { value: 30, label: '30 Days (1 Month)' }
  ];

  ngOnInit() {
    if (this.assignment) {
      this.currentDueDate = new Date(this.assignment.dueDate);
      this.calculateQuickExtension();
    }
  }

  calculateQuickExtension() {
    if (this.currentDueDate) {
      const extended = new Date(this.currentDueDate);
      extended.setDate(extended.getDate() + this.quickExtensionDays);
      this.newDueDate = extended;
    }
  }

  onQuickExtensionChange() {
    this.calculateQuickExtension();
  }

  onExtensionTypeChange() {
    if (this.extensionType === 'quick') {
      this.calculateQuickExtension();
    } else {
      // For custom, start with current calculated extension
      if (!this.newDueDate) {
        this.calculateQuickExtension();
      }
    }
  }

  onExtend() {
    if (!this.assignment || !this.newDueDate || !this.isFormValid()) {
      return;
    }

    this.extend.emit({
      id: this.assignment.id,
      newDueDate: this.newDueDate,
      reason: this.reason
    });
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  isFormValid(): boolean {
    if (!this.newDueDate || !this.currentDueDate) return false;
    // New due date must be after current due date
    return this.newDueDate > this.currentDueDate;
  }

  getDaysExtended(): number {
    if (!this.currentDueDate || !this.newDueDate) return 0;
    
    const diffTime = this.newDueDate.getTime() - this.currentDueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getExtensionSummary(): string {
    const days = this.getDaysExtended();
    if (days === 0) return 'No extension';
    if (days === 1) return '1 day extension';
    if (days === 7) return '1 week extension';
    if (days === 14) return '2 weeks extension';
    if (days === 30) return '1 month extension';
    return `${days} days extension`;
  }

  isOverdue(): boolean {
    if (!this.assignment) return false;
    const now = new Date();
    return new Date(this.assignment.dueDate) < now;
  }

  getDaysOverdue(): number {
    if (!this.assignment || !this.isOverdue()) return 0;
    
    const now = new Date();
    const due = new Date(this.assignment.dueDate);
    const diffTime = now.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  minDate(): Date {
    // Minimum date should be tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
}
