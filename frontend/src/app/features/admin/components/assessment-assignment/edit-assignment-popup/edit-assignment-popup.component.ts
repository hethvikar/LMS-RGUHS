import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-edit-assignment-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './edit-assignment-popup.component.html',
  styleUrls: ['./edit-assignment-popup.component.scss']
})
export class EditAssignmentPopupComponent implements OnInit {
  @Input() assignment: AssessmentAssignment | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    id: number;
    dueDate: Date;
    maxAttempts: number;
    status: string;
  }>();

  dueDate: Date | null = null;
  maxAttempts: number = 1;
  status: string = 'assigned';

  statusOptions = [
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' },
    { value: 'overdue', label: 'Overdue' }
  ];

  ngOnInit() {
    if (this.assignment) {
      this.dueDate = new Date(this.assignment.dueDate);
      this.maxAttempts = this.assignment.maxAttempts;
      this.status = this.assignment.status;
    }
  }

  onSave() {
    if (!this.assignment || !this.dueDate) {
      return;
    }

    this.save.emit({
      id: this.assignment.id,
      dueDate: this.dueDate,
      maxAttempts: this.maxAttempts,
      status: this.status
    });
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  isFormValid(): boolean {
    return this.dueDate !== null && this.maxAttempts > 0;
  }
}
