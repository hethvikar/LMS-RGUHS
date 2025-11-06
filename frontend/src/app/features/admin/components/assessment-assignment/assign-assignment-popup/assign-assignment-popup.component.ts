import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assign-assignment-popup',
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
  templateUrl: './assign-assignment-popup.component.html',
  styleUrls: ['./assign-assignment-popup.component.scss']
})
export class AssignAssignmentPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() assign = new EventEmitter<{ 
    assessmentId: number, 
    studentId: number, 
    dueDate: Date,
    maxAttempts: number 
  }>();

  @Input() assessments: any[] = [];
  @Input() students: any[] = [];

  selectedAssessmentId: number | null = null;
  selectedStudentId: number | null = null;
  dueDate: Date | null = null;
  maxAttempts: number = 1;

  onAssign() {
    if (!this.selectedAssessmentId || !this.selectedStudentId || !this.dueDate) {
      return;
    }
    
    this.assign.emit({ 
      assessmentId: this.selectedAssessmentId, 
      studentId: this.selectedStudentId,
      dueDate: this.dueDate,
      maxAttempts: this.maxAttempts
    });
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }
}
