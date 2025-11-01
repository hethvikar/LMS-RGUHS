import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowseCoursesDialogComponent } from './browse-courses-dialog.component';
import { CourseDetailsDialogComponent } from './course-details-dialog.component';
import { CourseFormDialogComponent } from './course-form-dialog.component';

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
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class LmsCoursesComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

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
    console.log('Enroll in course:', course);
    // Call enrollment API
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