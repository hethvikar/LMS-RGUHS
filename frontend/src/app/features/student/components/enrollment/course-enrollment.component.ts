import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { PaymentDialogComponent } from '../payment/payment-dialog.component';

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  category: 'technical' | 'soft-skills' | 'domain' | 'certification';
  duration: string;
  mode: 'online' | 'offline' | 'hybrid';
  fee: number;
  instructor: string;
  instructorImage: string;
  rating: number;
  enrolledStudents: number;
  startDate: Date;
  endDate: Date;
  schedule: string;
  prerequisites: string[];
  syllabus: string[];
  skills: string[];
  certificateProvided: boolean;
  seatsAvailable: number;
  totalSeats: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

@Component({
  selector: 'app-course-enrollment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTabsModule
  ],
  templateUrl: './course-enrollment.component.html',
  styleUrls: ['./course-enrollment.component.scss']
})
export class CourseEnrollmentComponent implements OnInit {
  filterForm!: FormGroup;
  
  allCourses: Course[] = [
    {
      id: 1,
      name: 'Full Stack Web Development with MEAN Stack',
      code: 'CS-401',
      description: 'Comprehensive course covering MongoDB, Express.js, Angular, and Node.js. Build production-ready web applications with modern JavaScript frameworks.',
      category: 'technical',
      duration: '12 weeks',
      mode: 'hybrid',
      fee: 15000,
      instructor: 'Dr. Rajesh Kumar',
      instructorImage: 'assets/instructors/rajesh.jpg',
      rating: 4.8,
      enrolledStudents: 156,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-04-10'),
      schedule: 'Mon, Wed, Fri - 6:00 PM to 8:00 PM',
      prerequisites: ['Basic JavaScript', 'HTML/CSS', 'Programming fundamentals'],
      syllabus: [
        'Module 1: Node.js & Express.js Fundamentals',
        'Module 2: MongoDB & Database Design',
        'Module 3: Angular Framework Deep Dive',
        'Module 4: REST API Development',
        'Module 5: Authentication & Authorization',
        'Module 6: Deployment & DevOps',
        'Module 7: Final Project'
      ],
      skills: ['Angular', 'Node.js', 'MongoDB', 'Express.js', 'REST API', 'TypeScript'],
      certificateProvided: true,
      seatsAvailable: 24,
      totalSeats: 50,
      level: 'intermediate'
    },
    {
      id: 2,
      name: 'Python for Data Science & Machine Learning',
      code: 'DS-201',
      description: 'Master data science and machine learning using Python. Learn pandas, NumPy, scikit-learn, and deep learning frameworks.',
      category: 'technical',
      duration: '10 weeks',
      mode: 'online',
      fee: 12000,
      instructor: 'Prof. Anita Sharma',
      instructorImage: 'assets/instructors/anita.jpg',
      rating: 4.9,
      enrolledStudents: 203,
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-03-30'),
      schedule: 'Tue, Thu, Sat - 7:00 PM to 9:00 PM',
      prerequisites: ['Basic Python', 'Mathematics', 'Statistics fundamentals'],
      syllabus: [
        'Module 1: Python for Data Analysis',
        'Module 2: Data Visualization with Matplotlib & Seaborn',
        'Module 3: Machine Learning Fundamentals',
        'Module 4: Supervised Learning Algorithms',
        'Module 5: Unsupervised Learning & Clustering',
        'Module 6: Deep Learning with TensorFlow',
        'Module 7: Real-world ML Projects'
      ],
      skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow', 'Pandas', 'NumPy'],
      certificateProvided: true,
      seatsAvailable: 15,
      totalSeats: 60,
      level: 'intermediate'
    },
    {
      id: 3,
      name: 'AWS Cloud Practitioner Certification',
      code: 'CLD-101',
      description: 'Prepare for AWS Certified Cloud Practitioner exam. Learn cloud computing fundamentals, AWS services, and best practices.',
      category: 'certification',
      duration: '6 weeks',
      mode: 'online',
      fee: 8000,
      instructor: 'Mr. Vikram Singh',
      instructorImage: 'assets/instructors/vikram.jpg',
      rating: 4.7,
      enrolledStudents: 178,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-03-15'),
      schedule: 'Mon to Fri - 8:00 PM to 9:30 PM',
      prerequisites: ['Basic IT knowledge', 'Understanding of networking'],
      syllabus: [
        'Module 1: Cloud Computing Fundamentals',
        'Module 2: AWS Core Services (EC2, S3, RDS)',
        'Module 3: AWS Security & Compliance',
        'Module 4: AWS Pricing & Support',
        'Module 5: AWS Architecture Best Practices',
        'Module 6: Exam Preparation & Mock Tests'
      ],
      skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Cloud Architecture'],
      certificateProvided: true,
      seatsAvailable: 30,
      totalSeats: 40,
      level: 'beginner'
    },
    {
      id: 4,
      name: 'Communication & Soft Skills for IT Professionals',
      code: 'SS-301',
      description: 'Enhance your communication, presentation, and interpersonal skills. Essential for interviews and workplace success.',
      category: 'soft-skills',
      duration: '4 weeks',
      mode: 'offline',
      fee: 5000,
      instructor: 'Ms. Priya Desai',
      instructorImage: 'assets/instructors/priya.jpg',
      rating: 4.6,
      enrolledStudents: 142,
      startDate: new Date('2025-01-25'),
      endDate: new Date('2025-02-22'),
      schedule: 'Sat, Sun - 10:00 AM to 1:00 PM',
      prerequisites: [],
      syllabus: [
        'Module 1: Effective Communication Basics',
        'Module 2: Business Email Writing',
        'Module 3: Presentation Skills',
        'Module 4: Interview Preparation',
        'Module 5: Team Collaboration',
        'Module 6: Conflict Resolution',
        'Module 7: Professional Etiquette'
      ],
      skills: ['Communication', 'Presentation', 'Leadership', 'Teamwork'],
      certificateProvided: true,
      seatsAvailable: 18,
      totalSeats: 35,
      level: 'beginner'
    },
    {
      id: 5,
      name: 'Advanced React & Redux Development',
      code: 'CS-502',
      description: 'Deep dive into React ecosystem. Learn hooks, context API, Redux state management, and build scalable applications.',
      category: 'technical',
      duration: '8 weeks',
      mode: 'hybrid',
      fee: 10000,
      instructor: 'Mr. Arjun Mehta',
      instructorImage: 'assets/instructors/arjun.jpg',
      rating: 4.8,
      enrolledStudents: 189,
      startDate: new Date('2025-02-05'),
      endDate: new Date('2025-04-01'),
      schedule: 'Wed, Fri - 7:00 PM to 9:00 PM',
      prerequisites: ['JavaScript ES6+', 'Basic React knowledge'],
      syllabus: [
        'Module 1: React Hooks Mastery',
        'Module 2: Context API & State Management',
        'Module 3: Redux Fundamentals',
        'Module 4: Redux Toolkit & Best Practices',
        'Module 5: Testing React Applications',
        'Module 6: Performance Optimization',
        'Module 7: Production Deployment'
      ],
      skills: ['React', 'Redux', 'JavaScript', 'State Management', 'Testing'],
      certificateProvided: true,
      seatsAvailable: 12,
      totalSeats: 45,
      level: 'advanced'
    },
    {
      id: 6,
      name: 'Cybersecurity Fundamentals',
      code: 'SEC-201',
      description: 'Learn essential cybersecurity concepts, network security, cryptography, and ethical hacking basics.',
      category: 'domain',
      duration: '10 weeks',
      mode: 'online',
      fee: 13000,
      instructor: 'Dr. Suresh Reddy',
      instructorImage: 'assets/instructors/suresh.jpg',
      rating: 4.7,
      enrolledStudents: 167,
      startDate: new Date('2025-01-18'),
      endDate: new Date('2025-03-28'),
      schedule: 'Mon, Wed - 6:30 PM to 8:30 PM',
      prerequisites: ['Networking basics', 'Operating systems knowledge'],
      syllabus: [
        'Module 1: Introduction to Cybersecurity',
        'Module 2: Network Security',
        'Module 3: Cryptography Fundamentals',
        'Module 4: Web Application Security',
        'Module 5: Ethical Hacking Basics',
        'Module 6: Security Tools & Frameworks',
        'Module 7: Incident Response'
      ],
      skills: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Cryptography'],
      certificateProvided: true,
      seatsAvailable: 22,
      totalSeats: 50,
      level: 'intermediate'
    }
  ];

  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  cart: Course[] = [];

  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical' },
    { value: 'soft-skills', label: 'Soft Skills' },
    { value: 'domain', label: 'Domain Specific' },
    { value: 'certification', label: 'Certifications' }
  ];

  modes = [
    { value: 'all', label: 'All Modes' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['all'],
      mode: ['all'],
      level: ['all'],
      maxFee: [20000]
    });

    this.filteredCourses = [...this.allCourses];

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;
    
    this.filteredCourses = this.allCourses.filter(course => {
      const matchesSearch = filters.search === '' || 
        course.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesMode = filters.mode === 'all' || course.mode === filters.mode;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      const matchesFee = course.fee <= filters.maxFee;

      return matchesSearch && matchesCategory && matchesMode && matchesLevel && matchesFee;
    });
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
  }

  addToCart(course: Course) {
    if (!this.cart.find(c => c.id === course.id)) {
      this.cart.push(course);
      this.snackBar.open(`${course.name} added to cart`, 'Close', { duration: 2000 });
    } else {
      this.snackBar.open('Course already in cart', 'Close', { duration: 2000 });
    }
  }

  removeFromCart(course: Course) {
    this.cart = this.cart.filter(c => c.id !== course.id);
    this.snackBar.open('Course removed from cart', 'Close', { duration: 2000 });
  }

  getTotalAmount(): number {
    return this.cart.reduce((sum, course) => sum + course.fee, 0);
  }

  proceedToPayment() {
    if (this.cart.length === 0) {
      this.snackBar.open('Please add courses to cart', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '700px',
      data: {
        courses: this.cart,
        totalAmount: this.getTotalAmount()
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.cart = [];
        this.snackBar.open('Enrollment successful! Redirecting to your courses...', 'Close', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['/student/my-courses']);
        }, 2000);
      }
    });
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'technical': 'code',
      'soft-skills': 'people',
      'domain': 'business_center',
      'certification': 'verified'
    };
    return icons[category] || 'book';
  }

  getModeColor(mode: string): string {
    const colors: { [key: string]: string } = {
      'online': 'accent',
      'offline': 'primary',
      'hybrid': 'warn'
    };
    return colors[mode] || 'primary';
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    };
    return colors[level] || 'info';
  }

  getSeatsStatus(course: Course): { text: string; color: string } {
    const percentage = (course.seatsAvailable / course.totalSeats) * 100;
    
    if (percentage > 50) {
      return { text: 'Available', color: 'success' };
    } else if (percentage > 20) {
      return { text: 'Filling Fast', color: 'warning' };
    } else {
      return { text: 'Few Seats Left', color: 'danger' };
    }
  }
}
