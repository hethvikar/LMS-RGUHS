import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

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

interface Student {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-assign-to-all-popup',
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
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './assign-to-all-popup.component.html',
  styleUrls: ['./assign-to-all-popup.component.scss']
})
export class AssignToAllPopupComponent implements OnInit {
  @Input() assessment: Assessment | null = null;
  @Input() students: Student[] = [];
  @Input() alreadyAssignedStudentIds: number[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() assignToAll = new EventEmitter<{
    assessmentId: number;
    studentIds: number[];
    dueDate: Date;
    maxAttempts: number;
  }>();

  dueDate: Date | null = null;
  maxAttempts: number = 1;
  selectedStudentIds: number[] = [];
  selectAll: boolean = false;
  skipAlreadyAssigned: boolean = true;

  ngOnInit() {
    if (this.assessment) {
      this.dueDate = new Date(this.assessment.dueDate);
    }
    
    // Pre-select students who are not already assigned
    if (this.skipAlreadyAssigned) {
      this.selectedStudentIds = this.students
        .filter(s => !this.alreadyAssignedStudentIds.includes(s.id))
        .map(s => s.id);
      this.selectAll = this.selectedStudentIds.length === this.availableStudents.length;
    }
  }

  get availableStudents(): Student[] {
    if (this.skipAlreadyAssigned) {
      return this.students.filter(s => !this.alreadyAssignedStudentIds.includes(s.id));
    }
    return this.students;
  }

  get alreadyAssignedStudents(): Student[] {
    return this.students.filter(s => this.alreadyAssignedStudentIds.includes(s.id));
  }

  onSelectAll() {
    if (this.selectAll) {
      this.selectedStudentIds = this.availableStudents.map(s => s.id);
    } else {
      this.selectedStudentIds = [];
    }
  }

  onStudentToggle(studentId: number) {
    const index = this.selectedStudentIds.indexOf(studentId);
    if (index > -1) {
      this.selectedStudentIds.splice(index, 1);
    } else {
      this.selectedStudentIds.push(studentId);
    }
    this.selectAll = this.selectedStudentIds.length === this.availableStudents.length;
  }

  isStudentSelected(studentId: number): boolean {
    return this.selectedStudentIds.includes(studentId);
  }

  isStudentAlreadyAssigned(studentId: number): boolean {
    return this.alreadyAssignedStudentIds.includes(studentId);
  }

  onSkipAlreadyAssignedChange() {
    // When toggling, reset selection
    this.selectedStudentIds = [];
    this.selectAll = false;
    
    if (this.skipAlreadyAssigned) {
      // Auto-select available students
      this.selectedStudentIds = this.availableStudents.map(s => s.id);
      this.selectAll = true;
    }
  }

  onAssign() {
    if (!this.assessment || !this.dueDate || this.selectedStudentIds.length === 0) {
      return;
    }

    this.assignToAll.emit({
      assessmentId: this.assessment.id,
      studentIds: this.selectedStudentIds,
      dueDate: this.dueDate,
      maxAttempts: this.maxAttempts
    });
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.dueDate !== null && this.selectedStudentIds.length > 0;
  }

  minDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
