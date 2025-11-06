import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
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
  selector: 'app-grade-submission-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './grade-submission-popup.component.html',
  styleUrls: ['./grade-submission-popup.component.scss']
})
export class GradeSubmissionPopupComponent implements OnInit {
  @Input() assignment: AssessmentAssignment | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() grade = new EventEmitter<{
    id: number;
    score: number;
    feedback: string;
  }>();

  score: number = 0;
  feedback: string = '';
  maxScore: number = 100;

  ngOnInit() {
    if (this.assignment) {
      this.maxScore = this.assignment.maxScore;
      this.score = this.assignment.score || 0;
    }
  }

  onGrade() {
    if (!this.assignment || this.score < 0 || this.score > this.maxScore) {
      return;
    }

    this.grade.emit({
      id: this.assignment.id,
      score: this.score,
      feedback: this.feedback
    });
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.score >= 0 && this.score <= this.maxScore;
  }

  getScorePercentage(): number {
    if (this.maxScore === 0) return 0;
    return Math.round((this.score / this.maxScore) * 100);
  }

  getGradeClass(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return 'grade-excellent';
    if (percentage >= 75) return 'grade-good';
    if (percentage >= 60) return 'grade-average';
    return 'grade-poor';
  }

  getGradeLabel(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    if (percentage >= 50) return 'Below Average';
    return 'Poor';
  }

  onScoreInput(event: any) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      this.score = Math.min(Math.max(0, value), this.maxScore);
    }
  }

  incrementScore() {
    if (this.score < this.maxScore) {
      this.score = Math.min(this.score + 1, this.maxScore);
    }
  }

  decrementScore() {
    if (this.score > 0) {
      this.score = Math.max(this.score - 1, 0);
    }
  }

  setQuickScore(percentage: number) {
    this.score = Math.round((percentage / 100) * this.maxScore);
  }

  getTimeElapsed(): string {
    if (!this.assignment || !this.assignment.submittedDate) return 'N/A';
    
    const now = new Date();
    const submitted = new Date(this.assignment.submittedDate);
    const diffTime = Math.abs(now.getTime() - submitted.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  }

  isLateSubmission(): boolean {
    if (!this.assignment || !this.assignment.submittedDate) return false;
    
    const submitted = new Date(this.assignment.submittedDate);
    const due = new Date(this.assignment.dueDate);
    
    return submitted > due;
  }

  getDaysLate(): number {
    if (!this.assignment || !this.assignment.submittedDate) return 0;
    
    const submitted = new Date(this.assignment.submittedDate);
    const due = new Date(this.assignment.dueDate);
    
    if (submitted <= due) return 0;
    
    const diffTime = submitted.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
