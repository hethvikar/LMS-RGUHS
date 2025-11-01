import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { debounceTime, Subject, takeUntil } from 'rxjs';

interface Course {
   id: number;
   title: string;
   description: string;
   instructor: string;
   duration: string;
   enrolledStudents: number;
   maxStudents: number;
   status: CourseStatus;
   category: CourseCategory;
   progress?: number;
   enrolledDate?: Date;
   completionDate?: Date;
 }

 type CourseStatus = 'active' | 'upcoming' | 'completed';
 type CourseCategory = 'programming' | 'design' | 'business' | 'data';

 const COURSE_CATEGORIES: { value: CourseCategory; label: string }[] = [
   { value: 'programming', label: 'Programming' },
   { value: 'design', label: 'Design' },
   { value: 'business', label: 'Business' },
   { value: 'data', label: 'Data Science' }
 ];

 const COURSE_STATUSES: { value: CourseStatus; label: string }[] = [
   { value: 'active', label: 'Active' },
   { value: 'upcoming', label: 'Upcoming' }
 ];

@Component({
  selector: 'app-browse-courses-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './browse-courses-dialog.component.html',
  styleUrls: ['./browse-courses-dialog.component.scss']
})
export class BrowseCoursesDialogComponent implements OnInit, OnDestroy {
  searchQuery = '';
  selectedCategory: CourseCategory | '' = '';
  selectedStatus: CourseStatus | '' = '';
  filteredCourses: Course[] = [];

  courseCategories = COURSE_CATEGORIES;
  courseStatuses = COURSE_STATUSES;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  allCourses: Course[] = [
    {
      id: 1,
      title: 'Advanced JavaScript Concepts',
      description: 'Master advanced JavaScript concepts including closures, prototypes, and async programming. Perfect for intermediate developers.',
      instructor: 'Dr. Sarah Johnson',
      duration: '8 weeks',
      enrolledStudents: 45,
      maxStudents: 50,
      status: 'active',
      category: 'programming'
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      description: 'Learn fundamental principles of user interface and user experience design for modern applications.',
      instructor: 'Mike Chen',
      duration: '6 weeks',
      enrolledStudents: 32,
      maxStudents: 40,
      status: 'active',
      category: 'design'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      description: 'Comprehensive course on data structures and algorithms for technical interviews and competitive programming.',
      instructor: 'Prof. Emily Davis',
      duration: '12 weeks',
      enrolledStudents: 28,
      maxStudents: 30,
      status: 'active',
      category: 'programming'
    },
    {
      id: 4,
      title: 'Business Communication Skills',
      description: 'Develop essential business communication and presentation skills for professional environments.',
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
      description: 'Introduction to machine learning concepts and practical applications using Python and scikit-learn.',
      instructor: 'Dr. Lisa Zhang',
      duration: '10 weeks',
      enrolledStudents: 15,
      maxStudents: 20,
      status: 'upcoming',
      category: 'data'
    },
    {
      id: 6,
      title: 'React.js Mastery',
      description: 'Deep dive into React.js including hooks, context API, performance optimization, and best practices.',
      instructor: 'Alex Turner',
      duration: '8 weeks',
      enrolledStudents: 38,
      maxStudents: 45,
      status: 'active',
      category: 'programming'
    },
    {
      id: 7,
      title: 'Digital Marketing Strategy',
      description: 'Learn comprehensive digital marketing strategies including SEO, SEM, social media, and analytics.',
      instructor: 'Jennifer Lee',
      duration: '6 weeks',
      enrolledStudents: 22,
      maxStudents: 30,
      status: 'active',
      category: 'business'
    },
    {
      id: 8,
      title: 'Web Design with Figma',
      description: 'Complete guide to modern web design using Figma. Learn prototyping, collaboration, and design systems.',
      instructor: 'Marcus Brown',
      duration: '5 weeks',
      enrolledStudents: 18,
      maxStudents: 25,
      status: 'upcoming',
      category: 'design'
    },
    {
      id: 9,
      title: 'SQL Database Management',
      description: 'Master SQL for database management, query optimization, and relational database design principles.',
      instructor: 'David Kumar',
      duration: '7 weeks',
      enrolledStudents: 35,
      maxStudents: 40,
      status: 'active',
      category: 'programming'
    },
    {
      id: 10,
      title: 'Data Analysis with Python',
      description: 'Learn data analysis using Python, pandas, numpy, and matplotlib for business intelligence.',
      instructor: 'Dr. Lisa Zhang',
      duration: '8 weeks',
      enrolledStudents: 25,
      maxStudents: 30,
      status: 'upcoming',
      category: 'data'
    },
    {
      id: 11,
      title: 'Leadership & Team Management',
      description: 'Develop leadership skills and learn effective team management strategies for organizational success.',
      instructor: 'Patricia Moore',
      duration: '5 weeks',
      enrolledStudents: 12,
      maxStudents: 20,
      status: 'active',
      category: 'business'
    },
    {
      id: 12,
      title: 'Mobile App Development with Flutter',
      description: 'Build cross-platform mobile applications using Flutter framework and Dart programming language.',
      instructor: 'James Wilson',
      duration: '10 weeks',
      enrolledStudents: 8,
      maxStudents: 15,
      status: 'upcoming',
      category: 'programming'
    }
  ];

  constructor(private dialogRef: MatDialogRef<BrowseCoursesDialogComponent>) {}

  ngOnInit() {
    this.filteredCourses = [...this.allCourses];
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce() {
    this.searchSubject$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim() !== '') {
      this.searchSubject$.next(this.searchQuery);
    } else {
      this.applyFilters();
    }
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredCourses = this.allCourses.filter(course => {
      const matchesSearch =
        query === '' ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query);

      const matchesCategory =
        this.selectedCategory === '' ||
        course.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === '' ||
        course.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase();
  }

  getCapacityPercentage(course: Course): number {
    if (course.maxStudents <= 0) return 0;
    return Math.min((course.enrolledStudents / course.maxStudents) * 100, 100);
  }

  enrollCourse(course: Course) {
    if (!course || course.enrolledStudents >= course.maxStudents) {
      console.warn('Cannot enroll: course is full or invalid');
      return;
    }
    console.log('Enroll in course:', course);
    this.dialogRef.close({ action: 'enroll', course });
  }

  viewDetails(course: Course) {
    if (!course) {
      console.warn('Cannot view details: invalid course');
      return;
    }
    console.log('View course details:', course);
    this.dialogRef.close({ action: 'details', course });
  }

  onClose() {
    this.dialogRef.close();
  }
}