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
import { AssignAssignmentPopupComponent } from './assign-assignment-popup/assign-assignment-popup.component';
import { ViewAssignmentPopupComponent } from './view-assignment-popup/view-assignment-popup.component';
import { EditAssignmentPopupComponent } from './edit-assignment-popup/edit-assignment-popup.component';
import { GradeSubmissionPopupComponent } from './grade-submission-popup/grade-submission-popup.component';
import { ExtendDeadlinePopupComponent } from './extend-deadline-popup/extend-deadline-popup.component';
import { ViewAssignmentsPopupComponent } from './view-assignments-popup/view-assignments-popup.component';
import { AssignToAllPopupComponent } from './assign-to-all-popup/assign-to-all-popup.component';

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
    MatTooltipModule,
    AssignAssignmentPopupComponent,
    ViewAssignmentPopupComponent,
    EditAssignmentPopupComponent,
    GradeSubmissionPopupComponent,
    ExtendDeadlinePopupComponent,
    ViewAssignmentsPopupComponent,
    AssignToAllPopupComponent
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
  openAssignmentPopup = false;
  openViewAssignmentPopup = false;
  openEditAssignmentPopup = false;
  openGradeSubmissionPopup = false;
  openExtendDeadlinePopup = false;
  openViewAssignmentsPopup = false;
  openAssignToAllPopup = false;
  selectedAssignment: AssessmentAssignment | null = null;
  selectedAssessment: Assessment | null = null;

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
    console.log('viewAssignment called with:', assignment);
    this.selectedAssignment = assignment;
    this.openViewAssignmentPopup = true;
    console.log('openViewAssignmentPopup set to:', this.openViewAssignmentPopup);
    console.log('selectedAssignment set to:', this.selectedAssignment);
  }

  closeViewAssignmentPopup() {
    console.log('closeViewAssignmentPopup called');
    this.openViewAssignmentPopup = false;
    this.selectedAssignment = null;
  }

  editAssignment(assignment: AssessmentAssignment) {
    console.log('Edit assignment:', assignment);
    this.selectedAssignment = assignment;
    this.openEditAssignmentPopup = true;
  }

  closeEditAssignmentPopup() {
    console.log('closeEditAssignmentPopup called');
    this.openEditAssignmentPopup = false;
    this.selectedAssignment = null;
  }

  handleEditAssignment(event: { id: number, dueDate: Date, maxAttempts: number, status: string }) {
    console.log('handleEditAssignment called with:', event);
    const assignmentIndex = this.assignments.findIndex(a => a.id === event.id);
    
    if (assignmentIndex > -1) {
      this.assignments[assignmentIndex] = {
        ...this.assignments[assignmentIndex],
        dueDate: event.dueDate,
        maxAttempts: event.maxAttempts,
        status: event.status as 'assigned' | 'in-progress' | 'submitted' | 'graded' | 'overdue'
      };
      console.log('Assignment updated successfully:', this.assignments[assignmentIndex]);
    } else {
      console.error('Assignment not found');
    }
    
    this.closeEditAssignmentPopup();
  }

  gradeAssignment(assignment: AssessmentAssignment) {
    console.log('Grade assignment:', assignment);
    this.selectedAssignment = assignment;
    this.openGradeSubmissionPopup = true;
  }

  closeGradeSubmissionPopup() {
    console.log('closeGradeSubmissionPopup called');
    this.openGradeSubmissionPopup = false;
    this.selectedAssignment = null;
  }

  handleGradeSubmission(event: { id: number, score: number, feedback: string }) {
    console.log('handleGradeSubmission called with:', event);
    const assignmentIndex = this.assignments.findIndex(a => a.id === event.id);
    
    if (assignmentIndex > -1) {
      this.assignments[assignmentIndex] = {
        ...this.assignments[assignmentIndex],
        score: event.score,
        status: 'graded',
        gradedDate: new Date()
      };
      console.log('Assignment graded successfully:', this.assignments[assignmentIndex]);
      console.log('Feedback:', event.feedback);
    } else {
      console.error('Assignment not found');
    }
    
    this.closeGradeSubmissionPopup();
  }

  extendDeadline(assignment: AssessmentAssignment) {
    console.log('Extend deadline:', assignment);
    this.selectedAssignment = assignment;
    this.openExtendDeadlinePopup = true;
  }

  closeExtendDeadlinePopup() {
    console.log('closeExtendDeadlinePopup called');
    this.openExtendDeadlinePopup = false;
    this.selectedAssignment = null;
  }

  handleExtendDeadline(event: { id: number, newDueDate: Date, reason: string }) {
    console.log('handleExtendDeadline called with:', event);
    const assignmentIndex = this.assignments.findIndex(a => a.id === event.id);
    
    if (assignmentIndex > -1) {
      const oldDueDate = this.assignments[assignmentIndex].dueDate;
      this.assignments[assignmentIndex] = {
        ...this.assignments[assignmentIndex],
        dueDate: event.newDueDate
      };
      console.log('Deadline extended successfully');
      console.log('Old due date:', oldDueDate);
      console.log('New due date:', event.newDueDate);
      console.log('Reason:', event.reason);
    } else {
      console.error('Assignment not found');
    }
    
    this.closeExtendDeadlinePopup();
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
    this.selectedAssessment = assessment;
    this.openViewAssignmentsPopup = true;
  }

  closeViewAssignmentsPopup() {
    console.log('closeViewAssignmentsPopup called');
    this.openViewAssignmentsPopup = false;
    this.selectedAssessment = null;
  }

  assignToAllStudents(assessment: Assessment) {
    console.log('Assign to all students:', assessment);
    this.selectedAssessment = assessment;
    this.openAssignToAllPopup = true;
  }

  closeAssignToAllPopup() {
    console.log('closeAssignToAllPopup called');
    this.openAssignToAllPopup = false;
    this.selectedAssessment = null;
  }

  handleAssignToAll(event: { assessmentId: number, studentIds: number[], dueDate: Date, maxAttempts: number }) {
    console.log('handleAssignToAll called with:', event);
    
    const assessment = this.assessments.find(a => a.id === event.assessmentId);
    if (!assessment) {
      console.error('Assessment not found');
      return;
    }

    event.studentIds.forEach(studentId => {
      const student = this.students.find(s => s.id === studentId);
      if (!student) {
        console.error('Student not found:', studentId);
        return;
      }

      // Check if already assigned
      const alreadyAssigned = this.assignments.some(
        a => a.assessmentId === event.assessmentId && a.studentId === studentId
      );

      if (!alreadyAssigned) {
        const newAssignment: AssessmentAssignment = {
          id: this.assignments.length + 1,
          assessmentId: assessment.id,
          assessmentTitle: assessment.title,
          studentId: student.id,
          studentName: student.name,
          courseName: assessment.courseName,
          assignedDate: new Date(),
          dueDate: event.dueDate,
          status: 'assigned',
          maxScore: assessment.maxScore,
          attempts: 0,
          maxAttempts: event.maxAttempts
        };

        this.assignments.push(newAssignment);
      }
    });

    console.log(`Assigned to ${event.studentIds.length} students successfully`);
    this.closeAssignToAllPopup();
  }

  getAssignmentsForSelectedAssessment(): AssessmentAssignment[] {
    if (!this.selectedAssessment) return [];
    return this.assignments.filter(a => a.assessmentId === this.selectedAssessment?.id);
  }

  getAlreadyAssignedStudentIds(): number[] {
    if (!this.selectedAssessment) return [];
    const assignmentsForAssessment = this.getAssignmentsForSelectedAssessment();
    return assignmentsForAssessment.map(a => a.studentId);
  }

  openAssignmentDialog() {
    this.openAssignmentPopup = true;
  }

  closeAssignmentPopup() {
    this.openAssignmentPopup = false;
  }

  handleAssignAssignment(event: { assessmentId: number, studentId: number, dueDate: Date, maxAttempts: number }) {
    const assessment = this.assessments.find(a => a.id === event.assessmentId);
    const student = this.students.find(s => s.id === event.studentId);

    if (!assessment || !student) {
      console.error('Assessment or student not found');
      return;
    }

    // Check if already assigned
    if (this.assignments.some(a => a.assessmentId === event.assessmentId && a.studentId === event.studentId)) {
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
      dueDate: event.dueDate,
      status: 'assigned',
      maxScore: assessment.maxScore,
      attempts: 0,
      maxAttempts: event.maxAttempts
    };

    this.assignments.push(newAssignment);
    console.log('Assessment assigned successfully:', newAssignment);
    this.closeAssignmentPopup();
  }
}