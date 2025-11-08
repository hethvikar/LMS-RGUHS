import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  personalInfoForm!: FormGroup;
  academicInfoForm!: FormGroup;
  skillsForm!: FormGroup;
  
  profilePicture: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Biotechnology',
    'MBA',
    'MCA'
  ];

  batches = ['2025', '2024', '2023', '2022', '2021'];

  allSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
    'Angular', 'React', 'Vue.js', 'Node.js', 'Express.js',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Redis',
    'AWS', 'Azure', 'Docker', 'Kubernetes',
    'HTML5', 'CSS3', 'SCSS', 'Tailwind',
    'Git', 'CI/CD', 'REST API', 'GraphQL',
    'Machine Learning', 'Data Science', 'AI',
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving'
  ];

  selectedSkills: string[] = [];
  filteredSkills: string[] = [];

  certifications: { name: string; issuer: string; year: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.filteredSkills = [...this.allSkills];
  }

  initializeForms() {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });

    this.academicInfoForm = this.fb.group({
      usn: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      department: ['', Validators.required],
      batch: ['', Validators.required],
      semester: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      tenthPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      twelfthPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      backlogs: [0, [Validators.required, Validators.min(0)]],
      academicGap: [0, [Validators.min(0)]]
    });

    this.skillsForm = this.fb.group({
      skillInput: [''],
      linkedin: ['', Validators.pattern(/^https:\/\/(www\.)?linkedin\.com\/.*$/)],
      github: ['', Validators.pattern(/^https:\/\/(www\.)?github\.com\/.*$/)],
      portfolio: ['', Validators.pattern(/^https?:\/\/.*$/)],
      bio: ['', [Validators.maxLength(500)]],
      careerObjective: ['', [Validators.maxLength(1000)]],
      certificationName: [''],
      certificationIssuer: [''],
      certificationYear: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select an image file', 'Close', { duration: 3000 });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('File size should not exceed 2MB', 'Close', { duration: 3000 });
        return;
      }

      this.selectedFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  addSkill(skill: string) {
    if (skill && !this.selectedSkills.includes(skill) && this.selectedSkills.length < 15) {
      this.selectedSkills.push(skill);
      this.skillsForm.patchValue({ skillInput: '' });
    }
  }

  removeSkill(skill: string) {
    const index = this.selectedSkills.indexOf(skill);
    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    }
  }

  filterSkills(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredSkills = this.allSkills.filter(skill =>
      skill.toLowerCase().includes(filterValue) && !this.selectedSkills.includes(skill)
    );
  }

  addCertification() {
    const name = this.skillsForm.get('certificationName')?.value;
    const issuer = this.skillsForm.get('certificationIssuer')?.value;
    const year = this.skillsForm.get('certificationYear')?.value;

    if (name && issuer && year) {
      this.certifications.push({ name, issuer, year: parseInt(year) });
      this.skillsForm.patchValue({
        certificationName: '',
        certificationIssuer: '',
        certificationYear: ''
      });
      this.snackBar.open('Certification added', 'Close', { duration: 2000 });
    }
  }

  removeCertification(index: number) {
    this.certifications.splice(index, 1);
  }

  saveProfile() {
    if (this.personalInfoForm.invalid || this.academicInfoForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const profileData = {
      personal: this.personalInfoForm.value,
      academic: this.academicInfoForm.value,
      skills: this.selectedSkills,
      certifications: this.certifications,
      socialLinks: {
        linkedin: this.skillsForm.get('linkedin')?.value,
        github: this.skillsForm.get('github')?.value,
        portfolio: this.skillsForm.get('portfolio')?.value
      },
      bio: this.skillsForm.get('bio')?.value,
      careerObjective: this.skillsForm.get('careerObjective')?.value,
      profilePicture: this.profilePicture
    };

    // In production, this would be an API call
    console.log('Profile Data:', profileData);

    this.snackBar.open('Profile created successfully!', 'Close', { duration: 3000 });
    
    // Navigate to course enrollment
    setTimeout(() => {
      this.router.navigate(['/student/enroll-course']);
    }, 1500);
  }

  getCompletionPercentage(): number {
    let completed = 0;
    let total = 3;

    if (this.personalInfoForm.valid) completed++;
    if (this.academicInfoForm.valid) completed++;
    if (this.selectedSkills.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }
}
