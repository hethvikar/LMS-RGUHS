import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { JobService, Job, JobFilters } from '../../services/job.service';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})
export class JobSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = false;
  
  searchForm: FormGroup;
  departments: string[] = [];
  locations: string[] = [];
  allSkills: string[] = [];
  
  jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' }
  ];

  postedWithinOptions = [
    { value: 1, label: 'Last 24 hours' },
    { value: 7, label: 'Last 7 days' },
    { value: 14, label: 'Last 14 days' },
    { value: 30, label: 'Last 30 days' }
  ];

  sortOptions = [
    { value: 'match', label: 'Best Match' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' }
  ];

  currentSort = 'match';
  showFilters = true;

  constructor(
    private jobService: JobService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      department: [''],
      location: [''],
      types: [[]],
      experienceLevels: [[]],
      salaryMin: [0],
      salaryMax: [5000000],
      remoteWork: [false],
      postedWithin: [''],
      selectedSkills: [[]]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadJobs();
    this.setupSearchListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData(): void {
    this.jobService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });

    this.jobService.getLocations().subscribe(locations => {
      this.locations = locations;
    });

    this.jobService.getSkills().subscribe(skills => {
      this.allSkills = skills;
    });
  }

  setupSearchListener(): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
        this.sortJobs();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loading = true;
    
    const formValue = this.searchForm.value;
    const filters: JobFilters = {
      search: formValue.search || undefined,
      department: formValue.department || undefined,
      location: formValue.location || undefined,
      type: formValue.types?.length > 0 ? formValue.types : undefined,
      experienceLevel: formValue.experienceLevels?.length > 0 ? formValue.experienceLevels : undefined,
      salaryMin: formValue.salaryMin || undefined,
      salaryMax: formValue.salaryMax || undefined,
      remoteWork: formValue.remoteWork || undefined,
      postedWithin: formValue.postedWithin || undefined,
      skills: formValue.selectedSkills?.length > 0 ? formValue.selectedSkills : undefined
    };

    this.jobService.getJobs(filters).subscribe({
      next: (jobs) => {
        this.filteredJobs = jobs;
        this.sortJobs();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering jobs:', error);
        this.loading = false;
      }
    });
  }

  sortJobs(): void {
    switch (this.currentSort) {
      case 'match':
        this.filteredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case 'recent':
        this.filteredJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'salary-high':
        this.filteredJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        break;
      case 'salary-low':
        this.filteredJobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        break;
    }
  }

  onSortChange(sort: string): void {
    this.currentSort = sort;
    this.sortJobs();
  }

  clearFilters(): void {
    this.searchForm.reset({
      search: '',
      department: '',
      location: '',
      types: [],
      experienceLevels: [],
      salaryMin: 0,
      salaryMax: 5000000,
      remoteWork: false,
      postedWithin: '',
      selectedSkills: []
    });
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/student/jobs', jobId]);
  }

  toggleBookmark(event: Event, jobId: number): void {
    event.stopPropagation();
    this.jobService.toggleBookmark(jobId).subscribe({
      next: (isBookmarked) => {
        const job = this.filteredJobs.find(j => j.id === jobId);
        if (job) {
          job.isBookmarked = isBookmarked;
        }
      },
      error: (error) => {
        console.error('Error toggling bookmark:', error);
      }
    });
  }

  getMatchColor(score?: number): string {
    if (!score) return 'gray';
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  }

  getExperienceLabel(level: string): string {
    const found = this.experienceLevels.find(e => e.value === level);
    return found ? found.label : level;
  }

  getTypeLabel(type: string): string {
    const found = this.jobTypes.find(t => t.value === type);
    return found ? found.label : type;
  }

  getDaysAgo(date: Date): number {
    const today = new Date();
    const postedDate = new Date(date);
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatSalary(amount?: number): string {
    if (!amount) return '';
    if (amount >= 100000) {
      return '₹' + (amount / 100000).toFixed(2) + 'L';
    }
    return '₹' + amount.toLocaleString('en-IN');
  }

  getActiveFiltersCount(): number {
    let count = 0;
    const formValue = this.searchForm.value;
    
    if (formValue.search) count++;
    if (formValue.department) count++;
    if (formValue.location) count++;
    if (formValue.types?.length > 0) count++;
    if (formValue.experienceLevels?.length > 0) count++;
    if (formValue.salaryMin > 0 || formValue.salaryMax < 5000000) count++;
    if (formValue.remoteWork) count++;
    if (formValue.postedWithin) count++;
    if (formValue.selectedSkills?.length > 0) count++;
    
    return count;
  }

  toggleType(typeValue: string, checked: boolean): void {
    const types = this.searchForm.get('types')?.value || [];
    if (checked) {
      if (!types.includes(typeValue)) {
        types.push(typeValue);
      }
    } else {
      const index = types.indexOf(typeValue);
      if (index > -1) {
        types.splice(index, 1);
      }
    }
    this.searchForm.get('types')?.setValue(types);
    this.applyFilters();
  }

  toggleExperienceLevel(levelValue: string, checked: boolean): void {
    const levels = this.searchForm.get('experienceLevels')?.value || [];
    if (checked) {
      if (!levels.includes(levelValue)) {
        levels.push(levelValue);
      }
    } else {
      const index = levels.indexOf(levelValue);
      if (index > -1) {
        levels.splice(index, 1);
      }
    }
    this.searchForm.get('experienceLevels')?.setValue(levels);
    this.applyFilters();
  }

  onImageError(event: any, job: Job): void {
    // Hide the image and show placeholder instead
    job.companyLogo = '';
  }
}
