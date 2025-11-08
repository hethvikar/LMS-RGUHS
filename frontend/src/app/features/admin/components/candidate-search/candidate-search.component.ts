import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ShareProfilesDialogComponent } from './share-profiles-dialog.component';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  batch: string;
  department: string;
  cgpa: number;
  skills: string[];
  certifications: string[];
  trainingCompleted: string[];
  assessmentScores: {
    average: number;
    highest: number;
    recent: number;
  };
  location: string;
  placementStatus: 'available' | 'placed' | 'not-interested';
  resumeUrl?: string;
}

@Component({
  selector: 'app-candidate-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './candidate-search.component.html',
  styleUrls: ['./candidate-search.component.scss']
})
export class CandidateSearchComponent implements OnInit {
  // Filter criteria
  selectedSkills: string[] = [];
  selectedCertifications: string[] = [];
  selectedBatches: string[] = [];
  selectedDepartments: string[] = [];
  selectedTrainings: string[] = [];
  minAssessmentScore: number = 0;
  maxAssessmentScore: number = 100;
  minCGPA: number = 0;
  placementStatus: string = 'available';
  searchQuery: string = '';

  // Available filter options
  availableSkills = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'
  ];
  availableCertifications = [
    'AWS Certified Solutions Architect',
    'Google Cloud Professional',
    'Microsoft Azure Fundamentals',
    'Oracle Certified Java Programmer',
    'Cisco CCNA',
    'CompTIA Security+',
    'PMP Certification',
    'Scrum Master Certification'
  ];
  availableBatches = ['2024', '2023', '2022', '2021'];
  availableDepartments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering'
  ];
  availableTrainings = [
    'Full Stack Development',
    'Data Science & AI',
    'Cloud Computing',
    'DevOps Fundamentals',
    'Mobile App Development',
    'Cybersecurity Basics'
  ];

  // Student data
  allStudents: StudentProfile[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@rguhs.edu',
      phone: '+91-9876543210',
      batch: '2024',
      department: 'Computer Science',
      cgpa: 8.5,
      skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'MongoDB'],
      certifications: ['AWS Certified Solutions Architect', 'Oracle Certified Java Programmer'],
      trainingCompleted: ['Full Stack Development', 'Cloud Computing'],
      assessmentScores: { average: 85, highest: 92, recent: 88 },
      location: 'Bangalore',
      placementStatus: 'available',
      resumeUrl: '/assets/resumes/rahul-sharma.pdf'
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@rguhs.edu',
      phone: '+91-9876543211',
      batch: '2024',
      department: 'Information Technology',
      cgpa: 9.1,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL'],
      certifications: ['Google Cloud Professional', 'Microsoft Azure Fundamentals'],
      trainingCompleted: ['Data Science & AI', 'Cloud Computing'],
      assessmentScores: { average: 92, highest: 97, recent: 94 },
      location: 'Mumbai',
      placementStatus: 'available',
      resumeUrl: '/assets/resumes/priya-patel.pdf'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@rguhs.edu',
      phone: '+91-9876543212',
      batch: '2023',
      department: 'Computer Science',
      cgpa: 7.8,
      skills: ['React', 'JavaScript', 'Node.js', 'Docker', 'AWS'],
      certifications: ['AWS Certified Solutions Architect', 'Scrum Master Certification'],
      trainingCompleted: ['Full Stack Development', 'DevOps Fundamentals'],
      assessmentScores: { average: 78, highest: 85, recent: 80 },
      location: 'Pune',
      placementStatus: 'available',
      resumeUrl: '/assets/resumes/amit-kumar.pdf'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@rguhs.edu',
      phone: '+91-9876543213',
      batch: '2024',
      department: 'Electronics & Communication',
      cgpa: 8.9,
      skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
      certifications: ['Oracle Certified Java Programmer', 'CompTIA Security+'],
      trainingCompleted: ['Cloud Computing', 'Cybersecurity Basics'],
      assessmentScores: { average: 88, highest: 93, recent: 91 },
      location: 'Hyderabad',
      placementStatus: 'available',
      resumeUrl: '/assets/resumes/sneha-reddy.pdf'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@rguhs.edu',
      phone: '+91-9876543214',
      batch: '2023',
      department: 'Information Technology',
      cgpa: 8.2,
      skills: ['Angular', 'TypeScript', 'RxJS', 'Material Design', 'Git'],
      certifications: ['Microsoft Azure Fundamentals'],
      trainingCompleted: ['Full Stack Development'],
      assessmentScores: { average: 82, highest: 88, recent: 85 },
      location: 'Delhi',
      placementStatus: 'placed',
      resumeUrl: '/assets/resumes/vikram-singh.pdf'
    }
  ];

  filteredStudents: StudentProfile[] = [];
  selectedStudents: Set<number> = new Set();
  displayedColumns: string[] = ['select', 'name', 'batch', 'department', 'cgpa', 'skills', 'assessmentScore', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredStudents = this.allStudents.filter(student => {
      // Search query filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesEmail = student.email.toLowerCase().includes(query);
        const matchesSkills = student.skills.some(skill => skill.toLowerCase().includes(query));
        if (!matchesName && !matchesEmail && !matchesSkills) {
          return false;
        }
      }

      // Skills filter
      if (this.selectedSkills.length > 0) {
        const hasAllSkills = this.selectedSkills.every(skill => 
          student.skills.includes(skill)
        );
        if (!hasAllSkills) return false;
      }

      // Certifications filter
      if (this.selectedCertifications.length > 0) {
        const hasAnyCertification = this.selectedCertifications.some(cert => 
          student.certifications.includes(cert)
        );
        if (!hasAnyCertification) return false;
      }

      // Batch filter
      if (this.selectedBatches.length > 0) {
        if (!this.selectedBatches.includes(student.batch)) return false;
      }

      // Department filter
      if (this.selectedDepartments.length > 0) {
        if (!this.selectedDepartments.includes(student.department)) return false;
      }

      // Training filter
      if (this.selectedTrainings.length > 0) {
        const hasAnyTraining = this.selectedTrainings.some(training => 
          student.trainingCompleted.includes(training)
        );
        if (!hasAnyTraining) return false;
      }

      // Assessment score filter
      if (student.assessmentScores.average < this.minAssessmentScore || 
          student.assessmentScores.average > this.maxAssessmentScore) {
        return false;
      }

      // CGPA filter
      if (student.cgpa < this.minCGPA) {
        return false;
      }

      // Placement status filter
      if (this.placementStatus && student.placementStatus !== this.placementStatus) {
        return false;
      }

      return true;
    });
  }

  clearFilters() {
    this.selectedSkills = [];
    this.selectedCertifications = [];
    this.selectedBatches = [];
    this.selectedDepartments = [];
    this.selectedTrainings = [];
    this.minAssessmentScore = 0;
    this.maxAssessmentScore = 100;
    this.minCGPA = 0;
    this.placementStatus = 'available';
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleStudentSelection(studentId: number) {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }
  }

  isStudentSelected(studentId: number): boolean {
    return this.selectedStudents.has(studentId);
  }

  selectAllStudents() {
    this.filteredStudents.forEach(student => {
      this.selectedStudents.add(student.id);
    });
  }

  deselectAllStudents() {
    this.selectedStudents.clear();
  }

  viewStudentProfile(student: StudentProfile) {
    // Navigate to student profile or open dialog
    console.log('View profile:', student);
  }

  shareProfilesWithCompany() {
    if (this.selectedStudents.size === 0) {
      this.snackBar.open('Please select at least one candidate', 'Close', { duration: 3000 });
      return;
    }

    const selectedProfiles = this.filteredStudents.filter(student => 
      this.selectedStudents.has(student.id)
    );

    const dialogRef = this.dialog.open(ShareProfilesDialogComponent, {
      width: '600px',
      data: { profiles: selectedProfiles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'shared') {
        this.snackBar.open(
          `Successfully shared ${this.selectedStudents.size} profile(s) with ${result.companyName}`,
          'Close',
          { duration: 5000 }
        );
        this.deselectAllStudents();
      }
    });
  }

  exportCandidateList() {
    if (this.selectedStudents.size === 0) {
      this.snackBar.open('Please select at least one candidate', 'Close', { duration: 3000 });
      return;
    }

    const selectedProfiles = this.filteredStudents.filter(student => 
      this.selectedStudents.has(student.id)
    );

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Batch', 'Department', 'CGPA', 'Skills', 'Avg Score', 'Location'];
    const rows = selectedProfiles.map(student => [
      student.name,
      student.email,
      student.phone,
      student.batch,
      student.department,
      student.cgpa,
      student.skills.join('; '),
      student.assessmentScores.average,
      student.location
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidate-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Candidate list exported successfully', 'Close', { duration: 3000 });
  }
}
