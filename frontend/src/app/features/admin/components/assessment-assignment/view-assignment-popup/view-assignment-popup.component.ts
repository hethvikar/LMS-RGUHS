import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

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
  selector: 'app-view-assignment-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule
  ],
  templateUrl: './view-assignment-popup.component.html',
  styleUrls: ['./view-assignment-popup.component.scss']
})
export class ViewAssignmentPopupComponent {
  @Input() assignment: AssessmentAssignment | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  getStatusClass(status: string): string {
    return status.replace('-', '');
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'assigned': 'Assigned',
      'in-progress': 'In Progress',
      'submitted': 'Submitted',
      'graded': 'Graded',
      'overdue': 'Overdue'
    };
    return statusMap[status] || status;
  }

  getScorePercentage(): number {
    if (!this.assignment || !this.assignment.score) return 0;
    return Math.round((this.assignment.score / this.assignment.maxScore) * 100);
  }

  getTimeRemainingText(dueDate: Date): string {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  }

  getGradeClass(): string {
    if (!this.assignment || !this.assignment.score) return '';
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return 'grade-excellent';
    if (percentage >= 75) return 'grade-good';
    if (percentage >= 60) return 'grade-average';
    return 'grade-poor';
  }
}
