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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { EnrollmentCalendarComponent, EnrollmentEvent } from '../../../../shared/components/enrollment-calendar/enrollment-calendar.component';

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

interface Enrollment {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
}

@Component({
  selector: 'app-course-enrollment',
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
    MatAutocompleteModule,
    MatTabsModule,
    MatTooltipModule,
    EnrollmentCalendarComponent
  ],
  templateUrl: './course-enrollment.component.html',
  styleUrls: ['./course-enrollment.component.scss']
})
export class CourseEnrollmentComponent implements OnInit {
  students: Student[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@student.edu', enrolledCourses: [1, 2], status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@student.edu', enrolledCourses: [1], status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@student.edu', enrolledCourses: [2, 3], status: 'active' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@student.edu', enrolledCourses: [], status: 'active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@student.edu', enrolledCourses: [1, 3], status: 'inactive' }
  ];

  courses: Course[] = [
    { id: 1, title: 'Advanced JavaScript Concepts', instructor: 'Dr. Sarah Johnson', maxStudents: 30, enrolledStudents: 25, status: 'active' },
    { id: 2, title: 'UI/UX Design Principles', instructor: 'Mike Chen', maxStudents: 25, enrolledStudents: 20, status: 'active' },
    { id: 3, title: 'Data Structures & Algorithms', instructor: 'Prof. Emily Davis', maxStudents: 20, enrolledStudents: 18, status: 'active' },
    { id: 4, title: 'Business Communication Skills', instructor: 'Dr. Robert Wilson', maxStudents: 15, enrolledStudents: 8, status: 'upcoming' }
  ];

  enrollments: Enrollment[] = [
    {
      id: 1,
      studentId: 1,
      studentName: 'John Doe',
      courseId: 1,
      courseTitle: 'Advanced JavaScript Concepts',
      enrollmentDate: new Date('2024-01-15'),
      status: 'active',
      progress: 75
    },
    {
      id: 2,
      studentId: 1,
      studentName: 'John Doe',
      courseId: 2,
      courseTitle: 'UI/UX Design Principles',
      enrollmentDate: new Date('2024-01-10'),
      status: 'active',
      progress: 60
    },
    {
      id: 3,
      studentId: 2,
      studentName: 'Jane Smith',
      courseId: 1,
      courseTitle: 'Advanced JavaScript Concepts',
      enrollmentDate: new Date('2024-01-12'),
      status: 'completed',
      progress: 100
    },
    {
      id: 4,
      studentId: 3,
      studentName: 'Bob Johnson',
      courseId: 3,
      courseTitle: 'Data Structures & Algorithms',
      enrollmentDate: new Date('2023-12-01'),
      status: 'completed',
      progress: 100
    }
  ];

  selectedStudentId: number | null = null;
  selectedStudentName = '';
  selectedCourseId: number | null = null;
  displayedColumns: string[] = ['student', 'course', 'progress', 'status', 'actions'];

  enrollmentEvents: EnrollmentEvent[] = [];

  ngOnInit() {
    // Load data from API
    this.generateMockEnrollmentEvents();
  }

  generateMockEnrollmentEvents() {
    const today = new Date();
    const events: EnrollmentEvent[] = [];

    // Generate events for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Add course enrollments
      this.enrollments.forEach((enrollment, index) => {
        if (Math.random() > 0.7) { // 30% chance of having an event on any given day
          const eventDate = new Date(date);
          eventDate.setHours(9 + Math.floor(Math.random() * 8)); // 9 AM to 5 PM
          eventDate.setMinutes(Math.floor(Math.random() * 4) * 15); // 0, 15, 30, or 45 minutes

          const endDate = new Date(eventDate);
          endDate.setHours(eventDate.getHours() + 1 + Math.floor(Math.random() * 2)); // 1-3 hours duration

          let eventType: 'course' | 'assessment' | 'interview' | 'deadline' = 'course';
          let title = enrollment.courseTitle;

          // Randomly assign different event types
          const rand = Math.random();
          if (rand < 0.2) {
            eventType = 'assessment';
            title = `Assessment: ${enrollment.courseTitle}`;
          } else if (rand < 0.4) {
            eventType = 'interview';
            title = `Interview: ${enrollment.studentName}`;
          } else if (rand < 0.6) {
            eventType = 'deadline';
            title = `Deadline: ${enrollment.courseTitle} Assignment`;
          }

          let status: 'enrolled' | 'completed' | 'upcoming' | 'cancelled' = 'enrolled';
          if (enrollment.status === 'completed') {
            status = 'completed';
          } else if (date > today) {
            status = 'upcoming';
          } else if (Math.random() < 0.1) {
            status = 'cancelled';
          }

          events.push({
            id: events.length + 1,
            title,
            start: eventDate,
            end: endDate,
            courseId: enrollment.courseId,
            courseName: enrollment.courseTitle,
            studentId: enrollment.studentId,
            studentName: enrollment.studentName,
            status,
            type: eventType
          });
        }
      });
    }

    // Add some specific important events
    const importantEvents: EnrollmentEvent[] = [
      {
        id: 1001,
        title: 'Final Project Submission Deadline',
        start: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        end: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
        courseId: 1,
        courseName: 'Advanced JavaScript Concepts',
        studentId: 1,
        studentName: 'John Doe',
        status: 'upcoming',
        type: 'deadline'
      },
      {
        id: 1002,
        title: 'Technical Interview - Senior Developer Position',
        start: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 3 days from now, 10 AM
        end: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 11 AM
        courseId: 2,
        courseName: 'UI/UX Design Principles',
        studentId: 2,
        studentName: 'Jane Smith',
        status: 'upcoming',
        type: 'interview'
      },
      {
        id: 1003,
        title: 'Mid-term Assessment',
        start: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 14 days from now, 2 PM
        end: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 4 PM
        courseId: 3,
        courseName: 'Data Structures & Algorithms',
        studentId: 3,
        studentName: 'Bob Johnson',
        status: 'upcoming',
        type: 'assessment'
      }
    ];

    this.enrollmentEvents = [...events, ...importantEvents];
  }

  get filteredStudents(): Student[] {
    if (!this.selectedStudentName) return this.students;
    return this.students.filter(student =>
      student.name.toLowerCase().includes(this.selectedStudentName.toLowerCase()) ||
      student.email.toLowerCase().includes(this.selectedStudentName.toLowerCase())
    );
  }

  get availableCourses(): Course[] {
    return this.courses.filter(course => course.status === 'active' || course.status === 'upcoming');
  }

  getActiveEnrollments(): number {
    return this.enrollments.filter(e => e.status === 'active').length;
  }

  getCompletedEnrollments(): number {
    return this.enrollments.filter(e => e.status === 'completed').length;
  }

  getUniqueStudents(): number {
    const uniqueStudents = new Set(this.enrollments.map(e => e.studentId));
    return uniqueStudents.size;
  }

  getEnrollmentsForCourse(courseId: number): Enrollment[] {
    return this.enrollments.filter(e => e.courseId === courseId);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'completed': 'Completed',
      'dropped': 'Dropped'
    };
    return statusMap[status] || status;
  }

  getEnrollmentStatusClass(status: string): string {
    return status.toLowerCase();
  }

  selectStudent(student: Student) {
    this.selectedStudentId = student.id;
    this.selectedStudentName = student.name;
  }

  enrollStudent() {
    if (!this.selectedStudentId || !this.selectedCourseId) return;

    const student = this.students.find(s => s.id === this.selectedStudentId);
    const course = this.courses.find(c => c.id === this.selectedCourseId);

    if (!student || !course) return;

    // Check if already enrolled
    if (this.enrollments.some(e => e.studentId === this.selectedStudentId && e.courseId === this.selectedCourseId)) {
      alert('Student is already enrolled in this course');
      return;
    }

    // Check course capacity
    if (course.enrolledStudents >= course.maxStudents) {
      alert('Course is at maximum capacity');
      return;
    }

    const newEnrollment: Enrollment = {
      id: this.enrollments.length + 1,
      studentId: student.id,
      studentName: student.name,
      courseId: course.id,
      courseTitle: course.title,
      enrollmentDate: new Date(),
      status: 'active',
      progress: 0
    };

    this.enrollments.push(newEnrollment);
    course.enrolledStudents++;
    student.enrolledCourses.push(course.id);

    this.clearForm();
    console.log('Student enrolled successfully');
  }

  clearForm() {
    this.selectedStudentId = null;
    this.selectedStudentName = '';
    this.selectedCourseId = null;
  }

  viewEnrollment(enrollment: Enrollment) {
    console.log('View enrollment:', enrollment);
  }

  editEnrollment(enrollment: Enrollment) {
    console.log('Edit enrollment:', enrollment);
  }

  dropEnrollment(enrollment: Enrollment) {
    enrollment.status = 'dropped';
    const course = this.courses.find(c => c.id === enrollment.courseId);
    if (course) course.enrolledStudents--;
    console.log('Enrollment dropped:', enrollment);
  }

  reenrollStudent(enrollment: Enrollment) {
    enrollment.status = 'active';
    const course = this.courses.find(c => c.id === enrollment.courseId);
    if (course) course.enrolledStudents++;
    console.log('Student re-enrolled:', enrollment);
  }

  viewCourseEnrollments(course: Course) {
    console.log('View course enrollments:', course);
  }

  addStudentToCourse(course: Course) {
    console.log('Add student to course:', course);
  }

  openEnrollmentDialog() {
    console.log('Open enrollment dialog');
  }

  onEventClicked(event: EnrollmentEvent) {
    console.log('Event clicked:', event);
    // Could open a dialog to view/edit the event
  }

  onDateSelected(date: Date) {
    console.log('Date selected:', date);
    // Could open a dialog to add a new event on this date
  }

  onEnrollmentAdded() {
    console.log('Add enrollment clicked');
    this.openEnrollmentDialog();
  }

  onEventUpdated(event: EnrollmentEvent) {
    console.log('Event updated:', event);
    // Update the event in the events array
    const index = this.enrollmentEvents.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.enrollmentEvents[index] = event;
    }
  }
}