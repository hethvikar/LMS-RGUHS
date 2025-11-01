import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CertificateDialogComponent } from './certificate-dialog.component';

interface CourseProgress {
  id: number;
  courseName: string;
  instructor: string;
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  enrolledDate: Date;
  lastAccessed: Date;
  estimatedCompletion?: Date;
  completionDate?: Date;
  grade?: string;
  status: 'active' | 'completed' | 'paused';
  nextMilestone?: string;
}

interface LearningGoal {
  id: number;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  category: string;
}

@Component({
  selector: 'app-lms-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class LmsProgressComponent implements OnInit {
  courseProgress: CourseProgress[] = [
    {
      id: 1,
      courseName: 'Advanced JavaScript Concepts',
      instructor: 'Dr. Sarah Johnson',
      totalModules: 12,
      completedModules: 8,
      progressPercentage: 67,
      enrolledDate: new Date('2024-01-15'),
      lastAccessed: new Date('2024-01-20'),
      status: 'active',
      nextMilestone: 'Complete Module 9: Async Programming'
    },
    {
      id: 2,
      courseName: 'UI/UX Design Principles',
      instructor: 'Mike Chen',
      totalModules: 8,
      completedModules: 5,
      progressPercentage: 63,
      enrolledDate: new Date('2024-01-10'),
      lastAccessed: new Date('2024-01-18'),
      status: 'active',
      nextMilestone: 'Complete Module 6: User Research'
    },
    {
      id: 3,
      courseName: 'Data Structures & Algorithms',
      instructor: 'Prof. Emily Davis',
      totalModules: 15,
      completedModules: 15,
      progressPercentage: 100,
      enrolledDate: new Date('2023-10-01'),
      lastAccessed: new Date('2024-01-15'),
      completionDate: new Date('2024-01-15'),
      grade: 'A',
      status: 'completed'
    }
  ];

  learningGoals: LearningGoal[] = [
    {
      id: 1,
      title: 'Master React Development',
      description: 'Complete advanced React concepts and build 3 projects',
      targetDate: new Date('2024-03-01'),
      progress: 75,
      status: 'in-progress',
      category: 'programming'
    },
    {
      id: 2,
      title: 'Learn UI/UX Design',
      description: 'Complete UI/UX design course and create portfolio',
      targetDate: new Date('2024-02-15'),
      progress: 60,
      status: 'in-progress',
      category: 'design'
    },
    {
      id: 3,
      title: 'Improve Communication Skills',
      description: 'Complete business communication course',
      targetDate: new Date('2024-01-30'),
      progress: 100,
      status: 'completed',
      category: 'business'
    }
  ];

  // Certificates and Badges mock data
  certificatesGained = [
    {
      id: 1,
      title: 'Angular Developer Certification',
      provider: 'Google',
      description: 'Advanced certification in Angular framework development, covering components, services, and state management.',
      earnedDate: new Date('2024-08-15'),
      type: 'Certificate',
      icon: 'school',
      credentialId: 'ANG-2024-001'
    },
    {
      id: 2,
      title: 'JavaScript Mastery Badge',
      provider: 'Udemy',
      description: 'Completed comprehensive JavaScript course with practical projects and advanced concepts.',
      earnedDate: new Date('2024-07-20'),
      type: 'Badge',
      icon: 'stars',
      credentialId: 'JS-MASTER-2024'
    },
    {
      id: 3,
      title: 'Full Stack Development Certificate',
      provider: 'Coursera',
      description: 'Professional certification covering both frontend and backend development technologies.',
      earnedDate: new Date('2024-06-10'),
      type: 'Certificate',
      icon: 'code',
      credentialId: 'FS-DEV-2024-XYZ'
    },
    {
      id: 4,
      title: 'TypeScript Expert Badge',
      provider: 'Microsoft',
      description: 'Demonstrated expertise in TypeScript language features and best practices.',
      earnedDate: new Date('2024-09-05'),
      type: 'Badge',
      icon: 'verified',
      credentialId: 'TS-EXPERT-2024'
    },
    {
      id: 5,
      title: 'React Fundamentals Certificate',
      provider: 'Meta',
      description: 'Foundation certificate in React development covering components, props, and state.',
      earnedDate: new Date('2024-05-18'),
      type: 'Certificate',
      icon: 'web',
      credentialId: 'REACT-FUND-2024'
    },
    {
      id: 6,
      title: 'Database Design Badge',
      provider: 'Oracle',
      description: 'Certification in database design principles and SQL query optimization.',
      earnedDate: new Date('2024-10-01'),
      type: 'Badge',
      icon: 'storage',
      credentialId: 'DB-DESIGN-2024'
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Load progress data from API
  }

  getOverallProgress(): number {
    if (this.courseProgress.length === 0) return 0;
    const totalProgress = this.courseProgress.reduce((sum, course) => sum + course.progressPercentage, 0);
    return Math.round(totalProgress / this.courseProgress.length);
  }

  getActiveCourses(): CourseProgress[] {
    return this.courseProgress.filter(course => course.status === 'active');
  }

  getCompletedCourses(): CourseProgress[] {
    return this.courseProgress.filter(course => course.status === 'completed');
  }

  getTotalHoursLearned(): number {
    // Mock calculation - in real app, this would be calculated from actual learning time
    return 45;
  }

  getTotalStudyHours(): number {
    return this.getTotalHoursLearned();
  }

  getCurrentStreak(): number {
    // Mock data - in real app, this would be calculated from daily activity
    return 7;
  }

  getAverageGrade(): string {
    const completedCourses = this.getCompletedCourses();
    if (completedCourses.length === 0) return 'N/A';

    const grades = completedCourses
      .filter(course => course.grade)
      .map(course => {
        const gradeMap: { [key: string]: number } = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
        return gradeMap[course.grade!] || 0;
      });

    if (grades.length === 0) return 'N/A';

    const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    const letterGrades = ['F', 'D', 'C', 'B', 'A'];
    return letterGrades[Math.round(average)] || 'N/A';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'completed': 'Completed',
      'paused': 'Paused'
    };
    return statusMap[status] || status;
  }

  getGoalIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'not-started': 'radio_button_unchecked',
      'in-progress': 'timelapse',
      'completed': 'check_circle',
      'overdue': 'warning'
    };
    return iconMap[status] || 'radio_button_unchecked';
  }

  getGoalIconClass(status: string): string {
    return status.replace('-', '');
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase();
  }

  continueCourse(course: CourseProgress) {
    console.log('Continue course:', course);
    // Navigate to course content
  }

  viewCourseDetails(course: CourseProgress) {
    console.log('View course details:', course);
    // Open course detail modal
  }

  addNewGoal() {
    console.log('Add new learning goal');
    // Open goal creation dialog
  }

  updateGoalProgress(goal: LearningGoal) {
    console.log('Update goal progress:', goal);
    // Open progress update dialog
  }

  markGoalComplete(goal: LearningGoal) {
    console.log('Mark goal complete:', goal);
    // Update goal status
  }

  // Certificate methods
  viewCertificate(certificate: any) {
    this.dialog.open(CertificateDialogComponent, {
      data: certificate,
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'certificate-dialog'
    });
  }
}