import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourses: number[];
  status: 'active' | 'inactive';
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  maxStudents: number;
  enrolledStudents: number;
  status: 'active' | 'upcoming' | 'completed';
}

interface EnrollmentDialogData {
  students: Student[];
  courses: Course[];
  existingEnrollment?: any;
}

@Component({
  selector: 'app-enroll-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './enroll-student-dialog.component.html',
  styleUrls: ['./enroll-student-dialog.component.scss']
})
export class EnrollStudentDialogComponent implements OnInit {
  enrollmentForm!: FormGroup;
  isEditMode = false;
  selectedStudent: Student | null = null;
  selectedCourse: Course | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnrollStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EnrollmentDialogData
  ) {
    this.isEditMode = !!data?.existingEnrollment;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.data?.existingEnrollment) {
      this.loadExistingEnrollment();
    }
  }

  private initForm(): void {
    this.enrollmentForm = this.fb.group({
      studentId: [
        this.data?.existingEnrollment?.studentId || '', 
        [Validators.required]
      ],
      courseId: [
        this.data?.existingEnrollment?.courseId || '', 
        [Validators.required]
      ],
      enrollmentDate: [
        this.data?.existingEnrollment?.enrollmentDate || new Date(), 
        [Validators.required]
      ],
      notes: [this.data?.existingEnrollment?.notes || '']
    });

    // Watch for student and course selection changes
    this.enrollmentForm.get('studentId')?.valueChanges.subscribe(studentId => {
      this.selectedStudent = this.data.students.find(s => s.id === studentId) || null;
    });

    this.enrollmentForm.get('courseId')?.valueChanges.subscribe(courseId => {
      this.selectedCourse = this.data.courses.find(c => c.id === courseId) || null;
    });
  }

  private loadExistingEnrollment(): void {
    const studentId = this.data.existingEnrollment.studentId;
    const courseId = this.data.existingEnrollment.courseId;
    
    this.selectedStudent = this.data.students.find(s => s.id === studentId) || null;
    this.selectedCourse = this.data.courses.find(c => c.id === courseId) || null;
  }

  get activeStudents(): Student[] {
    return this.data.students.filter(s => s.status === 'active');
  }

  get availableCourses(): Course[] {
    return this.data.courses.filter(c => c.status === 'active' || c.status === 'upcoming');
  }

  getAvailableSeats(course: Course): number {
    return course.maxStudents - course.enrolledStudents;
  }

  isCourseFull(course: Course): boolean {
    return course.enrolledStudents >= course.maxStudents;
  }

  isStudentAlreadyEnrolled(studentId: number, courseId: number): boolean {
    const student = this.data.students.find(s => s.id === studentId);
    return student ? student.enrolledCourses.includes(courseId) : false;
  }

  canEnroll(): boolean {
    const studentId = this.enrollmentForm.get('studentId')?.value;
    const courseId = this.enrollmentForm.get('courseId')?.value;

    if (!studentId || !courseId) {
      return false;
    }

    // Skip validation in edit mode
    if (this.isEditMode) {
      return true;
    }

    const course = this.data.courses.find(c => c.id === courseId);
    if (course && this.isCourseFull(course)) {
      return false;
    }

    if (this.isStudentAlreadyEnrolled(studentId, courseId)) {
      return false;
    }

    return true;
  }

  getValidationMessage(): string {
    const studentId = this.enrollmentForm.get('studentId')?.value;
    const courseId = this.enrollmentForm.get('courseId')?.value;

    if (!studentId || !courseId) {
      return '';
    }

    const course = this.data.courses.find(c => c.id === courseId);
    if (course && this.isCourseFull(course)) {
      return 'This course is full. No seats available.';
    }

    if (this.isStudentAlreadyEnrolled(studentId, courseId)) {
      return 'Student is already enrolled in this course.';
    }

    return '';
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid && this.canEnroll()) {
      const formValue = this.enrollmentForm.value;
      const student = this.data.students.find(s => s.id === formValue.studentId);
      const course = this.data.courses.find(c => c.id === formValue.courseId);

      const result = {
        ...formValue,
        studentName: student?.name,
        studentEmail: student?.email,
        courseTitle: course?.title,
        instructor: course?.instructor
      };

      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
