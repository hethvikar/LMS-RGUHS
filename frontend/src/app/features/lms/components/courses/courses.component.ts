import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { BrowseCoursesDialogComponent } from './browse-courses-dialog.component';
import { CourseDetailsDialogComponent } from './course-details-dialog.component';
import { CourseFormDialogComponent } from './course-form-dialog.component';
import { PaymentModalComponent } from './payment-modal.component';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  enrolledStudents: number;
  maxStudents: number;
  status: 'active' | 'upcoming' | 'completed';
  category: string;
  price?: number;
  currency?: string;
  progress?: number;
  enrolledDate?: Date;
  completionDate?: Date;
  scheduledDate?: Date;
  scheduledTime?: string;
  videoFile?: File;
  videoUrl?: string;
}

@Component({
  selector: 'app-lms-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class LmsCoursesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  courses: Course[] = [
    {
      id: 1,
      title: 'Advanced JavaScript Concepts',
      description: 'Master advanced JavaScript concepts including closures, prototypes, and async programming.',
      instructor: 'Dr. Sarah Johnson',
      duration: '8 weeks',
      enrolledStudents: 45,
      maxStudents: 50,
      status: 'active',
      category: 'programming',
      progress: 75,
      enrolledDate: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      description: 'Learn fundamental principles of user interface and user experience design.',
      instructor: 'Mike Chen',
      duration: '6 weeks',
      enrolledStudents: 32,
      maxStudents: 40,
      status: 'active',
      category: 'design',
      progress: 60,
      enrolledDate: new Date('2024-01-10')
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      description: 'Comprehensive course on data structures and algorithms for technical interviews.',
      instructor: 'Prof. Emily Davis',
      duration: '12 weeks',
      enrolledStudents: 28,
      maxStudents: 30,
      status: 'completed',
      category: 'programming',
      progress: 100,
      enrolledDate: new Date('2023-10-01'),
      completionDate: new Date('2024-01-15')
    },
    {
      id: 4,
      title: 'Business Communication Skills',
      description: 'Develop essential business communication and presentation skills.',
      instructor: 'Dr. Robert Wilson',
      duration: '4 weeks',
      enrolledStudents: 0,
      maxStudents: 25,
      status: 'upcoming',
      category: 'business'
    },
    {
      id: 5,
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning concepts and practical applications.',
      instructor: 'Dr. Lisa Zhang',
      duration: '10 weeks',
      enrolledStudents: 15,
      maxStudents: 20,
      status: 'upcoming',
      category: 'data'
    },
    // Available courses for enrollment (with pricing)
    {
      id: 6,
      title: 'React Development Masterclass',
      description: 'Complete guide to building modern web applications with React and Redux.',
      instructor: 'John Smith',
      duration: '12 weeks',
      enrolledStudents: 25,
      maxStudents: 40,
      status: 'active',
      category: 'programming',
      price: 4999,
      currency: 'INR'
    },
    {
      id: 7,
      title: 'Digital Marketing Fundamentals',
      description: 'Master the basics of digital marketing, SEO, and social media marketing.',
      instructor: 'Maria Garcia',
      duration: '8 weeks',
      enrolledStudents: 18,
      maxStudents: 30,
      status: 'active',
      category: 'marketing',
      price: 2999,
      currency: 'INR'
    },
    {
      id: 8,
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis, visualization, and machine learning.',
      instructor: 'Dr. Ahmed Khan',
      duration: '10 weeks',
      enrolledStudents: 12,
      maxStudents: 25,
      status: 'active',
      category: 'data',
      price: 5999,
      currency: 'INR'
    },
    {
      id: 9,
      title: 'Cloud Computing with AWS',
      description: 'Complete guide to Amazon Web Services and cloud infrastructure.',
      instructor: 'Rachel Thompson',
      duration: '6 weeks',
      enrolledStudents: 8,
      maxStudents: 20,
      status: 'upcoming',
      category: 'cloud',
      price: 7999,
      currency: 'INR'
    }
  ];

  ngOnInit() {
    // Load courses from API
  }

  get enrolledCourses(): Course[] {
    return this.courses.filter(course => course.enrolledDate);
  }

  get availableCourses(): Course[] {
    return this.courses.filter(course => !course.enrolledDate);
  }

  getEnrolledCourses(): Course[] {
    return this.enrolledCourses;
  }

  getActiveCourses(): Course[] {
    return this.enrolledCourses.filter(course => course.status === 'active');
  }

  getCompletedCourses(): Course[] {
    return this.enrolledCourses.filter(course => course.status === 'completed');
  }

  getUpcomingCourses(): Course[] {
    return this.enrolledCourses.filter(course => course.status === 'upcoming');
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase();
  }

  canCreateCourse(): boolean {
    const user = this.authService.getCurrentUser();
    // Only instructors and admins can create courses, not students
    return user ? ['instructor', 'admin'].includes(user.role) : false;
  }

  continueCourse(course: Course) {
    console.log('Continue course:', course);
    // Navigate to course content
  }

  viewCourseDetails(course: Course) {
    const dialogRef = this.dialog.open(CourseDetailsDialogComponent, {
      data: course,
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'course-details-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'enroll') {
          this.enrollInCourse(result.course);
        } else if (result.action === 'continue') {
          this.continueCourse(result.course);
        }
      }
    });
  }

  createNewCourse() {
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        // Add video URL to course if available
        if (result.videoUrl) {
          (result.course as any).videoUrl = result.videoUrl;
        }
        this.courses.push(result.course);
        console.log('Course created:', result.course);
      }
    });
  }

  enrollInCourse(course: Course) {
    // Open payment modal for course enrollment
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      data: { course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Payment successful, move course to enrolled courses
        this.handleSuccessfulEnrollment(course, result);
      }
    });
  }

  private handleSuccessfulEnrollment(course: Course, paymentResult: any): void {
    // Update the course to mark it as enrolled
    const courseIndex = this.courses.findIndex(c => c.id === course.id);
    if (courseIndex !== -1) {
      this.courses[courseIndex] = {
        ...course,
        enrolledDate: new Date(),
        progress: 0,
        status: 'active'
      };
    }

    // Show success message
    this.snackBar.open(
      `Successfully enrolled in "${course.title}"! Payment ID: ${paymentResult.paymentId}`, 
      'Close', 
      { 
        duration: 5000,
        panelClass: 'success-snackbar'
      }
    );

    console.log('Enrollment successful!', {
      course: course.title,
      paymentId: paymentResult.paymentId,
      amount: paymentResult.amount
    });
  }

  browseAllCourses() {
    const dialogRef = this.dialog.open(BrowseCoursesDialogComponent, {
      width: '1200px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'enroll') {
          this.enrollInCourse(result.course);
        } else if (result.action === 'details') {
          this.viewCourseDetails(result.course);
        }
      }
    });
  }
}