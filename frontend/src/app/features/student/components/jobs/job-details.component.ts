import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { JobService, Job } from '../../services/job.service';
import { ApplyJobDialogComponent } from './apply-job-dialog.component';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  job: Job | null = null;
  loading = true;
  jobId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.jobId = +params['id'];
        if (this.jobId) {
          this.loadJobDetails();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadJobDetails(): void {
    if (!this.jobId) return;

    this.loading = true;
    this.jobService.getJobById(this.jobId).subscribe({
      next: (job) => {
        this.job = job || null;
        this.loading = false;
        if (!this.job) {
          this.showMessage('Job not found');
          this.goBack();
        }
      },
      error: (error) => {
        console.error('Error loading job details:', error);
        this.loading = false;
        this.showMessage('Error loading job details');
      }
    });
  }

  openApplyDialog(): void {
    if (!this.job) return;

    const dialogRef = this.dialog.open(ApplyJobDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { job: this.job },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.showMessage('Application submitted successfully!');
        if (this.job) {
          this.job.hasApplied = true;
        }
      }
    });
  }

  toggleBookmark(): void {
    if (!this.job) return;

    this.jobService.toggleBookmark(this.job.id).subscribe({
      next: (isBookmarked) => {
        if (this.job) {
          this.job.isBookmarked = isBookmarked;
          this.showMessage(isBookmarked ? 'Job bookmarked' : 'Bookmark removed');
        }
      },
      error: (error) => {
        console.error('Error toggling bookmark:', error);
        this.showMessage('Error updating bookmark');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/jobs']);
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getMatchColor(score?: number): string {
    if (!score) return '#gray';
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    return '#f56565';
  }

  getDaysAgo(date: Date): number {
    const today = new Date();
    const postedDate = new Date(date);
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysUntil(date?: Date): number {
    if (!date) return 0;
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  shareJob(): void {
    if (!this.job) return;

    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: this.job.title,
        text: `Check out this job opportunity: ${this.job.title} at ${this.job.company}`,
        url: url
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        this.showMessage('Job link copied to clipboard');
      });
    }
  }

  reportJob(): void {
    this.showMessage('Thank you for reporting. We will review this job posting.');
  }
}
