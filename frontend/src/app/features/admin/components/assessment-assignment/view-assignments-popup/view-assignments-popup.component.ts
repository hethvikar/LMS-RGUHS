import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Assessment {
  id: number;
  title: string;
  courseName: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  totalQuestions?: number;
  duration?: number;
  maxScore: number;
  passingScore: number;
  dueDate: Date;
  status: 'draft' | 'published' | 'closed';
}

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
  selector: 'app-view-assignments-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './view-assignments-popup.component.html',
  styleUrls: ['./view-assignments-popup.component.scss']
})
export class ViewAssignmentsPopupComponent {
  @Input() assessment: Assessment | null = null;
  @Input() assignments: AssessmentAssignment[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<AssessmentAssignment>();
  @Output() gradeAssignment = new EventEmitter<AssessmentAssignment>();

  displayedColumns: string[] = ['student', 'status', 'score', 'submitted', 'actions'];

  onClose() {
    this.close.emit();
  }

  onViewDetails(assignment: AssessmentAssignment) {
    this.viewDetails.emit(assignment);
  }

  onGrade(assignment: AssessmentAssignment) {
    this.gradeAssignment.emit(assignment);
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

  getScorePercentage(assignment: AssessmentAssignment): number {
    if (!assignment.score) return 0;
    return Math.round((assignment.score / assignment.maxScore) * 100);
  }

  getStatusCount(status: string): number {
    return this.assignments.filter(a => a.status === status).length;
  }

  getAverageScore(): number {
    const gradedAssignments = this.assignments.filter(a => a.score !== undefined);
    if (gradedAssignments.length === 0) return 0;
    
    const totalScore = gradedAssignments.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalMax = gradedAssignments.reduce((sum, a) => sum + a.maxScore, 0);
    
    return Math.round((totalScore / totalMax) * 100);
  }

  getCompletionRate(): number {
    if (this.assignments.length === 0) return 0;
    const completed = this.assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
    return Math.round((completed / this.assignments.length) * 100);
  }
}
