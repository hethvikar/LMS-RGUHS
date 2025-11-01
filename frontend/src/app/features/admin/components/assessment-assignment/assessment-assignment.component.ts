import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface Assessment {
  id: number;
  title: string;
  courseName: string;
  type: 'quiz' | 'assignment' | 'exam' | 'project';
  totalQuestions?: number;
  duration?: number; // in minutes
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
  selector: 'app-assessment-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './assessment-assignment.component.html',
  styleUrls: ['./assessment-assignment.component.scss']
})
export class AssessmentAssignmentComponent implements OnInit {
  assessments: Assessment[] = [
    {
      id: 1,
      title: 'JavaScript Fundamentals Quiz',
      courseName: 'Advanced JavaScript Concepts',
      type: 'quiz',
      totalQuestions: 20,
      duration: 60,
      maxScore: 100,
      passingScore: 70,
      dueDate: new Date('2024-02-01'),
      status: 'published'
    },
    {
      id: 2,
      title: 'UI/UX Design Project',
      courseName: 'UI/UX Design Principles',
      type: 'project',
      maxScore: 200,
      passingScore: 140,
      dueDate: new Date('2024-01-28'),
      status: 'published'
    },
    {
      id: 3,
      title: 'Data Structures Final Exam',
      courseName: 'Data Structures & Algorithms',
      type: 'exam',
      totalQuestions: 50,
      duration: 120,
      maxScore: 100,
      passingScore: 60,
      dueDate: new Date('2024-01-20'),
      status: 'published'
    }
  ];

  students = [
    { id: 1, name: 'John Doe', email: 'john.doe@student.edu' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@student.edu' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@student.edu' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@student.edu' }
  ];

  assignments: AssessmentAssignment[] = [
    {
      id: 1,
      assessmentId: 1,
      assessmentTitle: 'JavaScript Fundamentals Quiz',
      studentId: 1,
      studentName: 'John Doe',
      courseName: 'Advanced JavaScript Concepts',
      assignedDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-01'),
      status: 'submitted',
      score: 85,
      maxScore: 100,
      submittedDate: new Date('2024-01-28'),
      gradedDate: new Date('2024-01-29'),
      attempts: 1,
      maxAttempts: 2
    },
    {
      id: 2,
      assessmentId: 2,
      assessmentTitle: 'UI/UX Design Project',
      studentId: 2,
      studentName: 'Jane Smith',
      courseName: 'UI/UX Design Principles',
      assignedDate: new Date('2024-01-10'),
      dueDate: new Date('2024-01-28'),
      status: 'in-progress',
      maxScore: 200,
      attempts: 0,
      maxAttempts: 3
    },
    {
      id: 3,
      assessmentId: 3,
      assessmentTitle: 'Data Structures Final Exam',
      studentId: 3,
      studentName: 'Bob Johnson',
      courseName: 'Data Structures & Algorithms',
      assignedDate: new Date('2023-12-01'),
      dueDate: new Date('2024-01-20'),
      status: 'graded',
      score: 92,
      maxScore: 100,
      submittedDate: new Date('2024-01-18'),
      gradedDate: new Date('2024-01-19'),
      attempts: 1,
      maxAttempts: 1
    }
  ];

  selectedAssessmentId: number | null = null;
  selectedStudentId: number | null = null;
  assignmentDueDate: Date | null = null;
  maxAttempts = 1;
  displayedColumns: string[] = ['student', 'assessment', 'dueDate', 'status', 'score', 'actions'];

  ngOnInit() {
    // Load data from API
  }

  get publishedAssessments(): Assessment[] {
    return this.assessments.filter(assessment => assessment.status === 'published');
  }

  getPendingAssignments(): number {
    return this.assignments.filter(a => a.status === 'assigned' || a.status === 'in-progress').length;
  }

  getSubmittedAssignments(): number {
    return this.assignments.filter(a => a.status === 'submitted').length;
  }

  getGradedAssignments(): number {
    return this.assignments.filter(a => a.status === 'graded').length;
  }

  getAssignmentsForAssessment(assessmentId: number): AssessmentAssignment[] {
    return this.assignments.filter(a => a.assessmentId === assessmentId);
  }

  getSubmittedForAssessment(assessmentId: number): number {
    return this.getAssignmentsForAssessment(assessmentId).filter(a => a.status === 'submitted' || a.status === 'graded').length;
  }

  getGradedForAssessment(assessmentId: number): number {
    return this.getAssignmentsForAssessment(assessmentId).filter(a => a.status === 'graded').length;
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

  getAssessmentTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'quiz': 'quiz',
      'assignment': 'assignment',
      'exam': 'school',
      'project': 'work'
    };
    return iconMap[type] || 'assignment';
  }

  getAssessmentTypeIconClass(type: string): string {
    return type.toLowerCase();
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

  getTimeRemainingClass(dueDate: Date): string {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'overdue';
    } else if (diffDays <= 1) {
      return 'due-soon';
    } else {
      return 'on-time';
    }
  }

  getScorePercentage(assignment: AssessmentAssignment): number {
    if (!assignment.score) return 0;
    return Math.round((assignment.score / assignment.maxScore) * 100);
  }

  assignAssessment() {
    if (!this.selectedAssessmentId || !this.selectedStudentId || !this.assignmentDueDate) return;

    const assessment = this.assessments.find(a => a.id === this.selectedAssessmentId);
    const student = this.students.find(s => s.id === this.selectedStudentId);

    if (!assessment || !student) return;

    // Check if already assigned
    if (this.assignments.some(a => a.assessmentId === this.selectedAssessmentId && a.studentId === this.selectedStudentId)) {
      alert('Assessment is already assigned to this student');
      return;
    }

    const newAssignment: AssessmentAssignment = {
      id: this.assignments.length + 1,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      studentId: student.id,
      studentName: student.name,
      courseName: assessment.courseName,
      assignedDate: new Date(),
      dueDate: this.assignmentDueDate,
      status: 'assigned',
      maxScore: assessment.maxScore,
      attempts: 0,
      maxAttempts: this.maxAttempts
    };

    this.assignments.push(newAssignment);
    this.clearAssignmentForm();
    console.log('Assessment assigned successfully');
  }

  clearAssignmentForm() {
    this.selectedAssessmentId = null;
    this.selectedStudentId = null;
    this.assignmentDueDate = null;
    this.maxAttempts = 1;
  }

  viewAssignment(assignment: AssessmentAssignment) {
    console.log('View assignment:', assignment);
  }

  editAssignment(assignment: AssessmentAssignment) {
    console.log('Edit assignment:', assignment);
  }

  gradeAssignment(assignment: AssessmentAssignment) {
    console.log('Grade assignment:', assignment);
  }

  extendDeadline(assignment: AssessmentAssignment) {
    console.log('Extend deadline:', assignment);
  }

  removeAssignment(assignment: AssessmentAssignment) {
    const index = this.assignments.indexOf(assignment);
    if (index > -1) {
      this.assignments.splice(index, 1);
    }
    console.log('Assignment removed:', assignment);
  }

  viewAssessmentAssignments(assessment: Assessment) {
    console.log('View assessment assignments:', assessment);
  }

  assignToAllStudents(assessment: Assessment) {
    console.log('Assign to all students:', assessment);
  }

  openAssignmentDialog() {
    console.log('Open assignment dialog');
  }
}