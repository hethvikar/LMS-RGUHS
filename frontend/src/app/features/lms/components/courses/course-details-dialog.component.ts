import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="course-details-dialog">
      <div class="course-header">
        <div class="course-title-section">
          <h1 class="course-title">{{ data.title }}</h1>
          <mat-chip [class]="getCategoryClass(data.category)">
            {{ data.category | titlecase }}
          </mat-chip>
        </div>
        <div class="course-status" *ngIf="data.status">
          <mat-chip [class]="getStatusClass(data.status)">
            {{ getStatusText(data.status) }}
          </mat-chip>
        </div>
      </div>

      <div class="course-content">
        <div class="course-description-section">
          <h3>About This Course</h3>
          <p class="course-description">{{ data.description }}</p>
        </div>

        <div class="course-details-grid">
          <div class="detail-card">
            <div class="detail-content">
              <h4>Instructor</h4>
              <p>{{ data.instructor }}</p>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-content">
              <h4>Duration</h4>
              <p>{{ data.duration }}</p>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-content">
              <h4>Enrollment</h4>
              <p>{{ data.enrolledStudents }}/{{ data.maxStudents }} students</p>
            </div>
          </div>

          <div class="detail-card" *ngIf="data.enrolledDate">
            <div class="detail-content">
              <h4>Enrolled Date</h4>
              <p>{{ data.enrolledDate | date:'mediumDate' }}</p>
            </div>
          </div>

          <div class="detail-card" *ngIf="data.completionDate">
            <div class="detail-content">
              <h4>Completed Date</h4>
              <p>{{ data.completionDate | date:'mediumDate' }}</p>
            </div>
          </div>
        </div>

        <div class="course-progress-section" *ngIf="data.progress !== undefined">
          <h3>Course Progress</h3>
          <div class="progress-container">
            <div class="progress-info">
              <span class="progress-text">Progress</span>
              <span class="progress-percentage">{{ data.progress }}%</span>
            </div>
            <mat-progress-bar
              mode="determinate"
              [value]="data.progress"
              class="course-progress-bar">
            </mat-progress-bar>
          </div>
        </div>

        <div class="course-objectives" *ngIf="getCourseObjectives().length > 0">
          <h3>Learning Objectives</h3>
          <ul class="objectives-list">
            <li *ngFor="let objective of getCourseObjectives()">
              <span>{{ objective }}</span>
            </li>
          </ul>
        </div>

        <div class="course-prerequisites" *ngIf="getPrerequisites().length > 0">
          <h3>Prerequisites</h3>
          <ul class="prerequisites-list">
            <li *ngFor="let prerequisite of getPrerequisites()">
              <span>{{ prerequisite }}</span>
            </li>
          </ul>
        </div>

        <div class="course-video-section" *ngIf="data.videoUrl">
          <h3>Course Video</h3>
          <div class="video-player-container">
            <video controls class="course-video-player" [src]="data.videoUrl">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div class="course-schedule-section" *ngIf="data.scheduledDate || data.scheduledTime">
          <h3>Course Schedule</h3>
          <div class="schedule-details">
            <div class="schedule-item" *ngIf="data.scheduledDate">
              <strong>Scheduled Date:</strong> {{ data.scheduledDate | date:'dd/MM/yyyy' }}
            </div>
            <div class="schedule-item" *ngIf="data.scheduledTime">
              <strong>Scheduled Time:</strong> {{ data.scheduledTime }}
            </div>
          </div>
        </div>
      </div>

      <div class="course-actions">
        <button mat-button (click)="closeDialog()">
          Close
        </button>

        <ng-container *ngIf="!data.enrolledDate">
          <button mat-raised-button color="primary" (click)="enrollInCourse()">
            Enroll Now
          </button>
        </ng-container>

        <ng-container *ngIf="data.enrolledDate && data.status !== 'completed'">
          <button mat-raised-button color="primary" (click)="continueCourse()">
            {{ data.status === 'completed' ? 'Review Course' : 'Continue Learning' }}
          </button>
        </ng-container>

        <ng-container *ngIf="data.status === 'completed'">
          <button mat-raised-button color="accent" (click)="downloadCertificate()">
            Download Certificate
          </button>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .course-details-dialog {
      max-width: 100%;
      padding: 0;
    }

    .course-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 12px 12px 0 0;
    }

    .course-title-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }

    .course-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      flex: 1;
    }

    .course-status {
      margin-top: 8px;
    }

    .course-content {
      padding: 32px;
    }

    .course-description-section h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 16px;
    }

    .course-description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #555;
      margin: 0;
    }

    .course-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 32px 0;
    }

    .detail-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }



    .detail-content h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #6c757d;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-content p {
      font-size: 1rem;
      font-weight: 500;
      color: #2c3e50;
      margin: 0;
    }

    .course-progress-section h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 16px;
    }

    .progress-container {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .progress-text {
      font-weight: 600;
      color: #2c3e50;
    }

    .progress-percentage {
      font-weight: 600;
      color: #667eea;
    }

    .course-progress-bar {
      height: 8px;
      border-radius: 4px;
    }

    .course-objectives h3,
    .course-prerequisites h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 32px 0 16px 0;
    }

    .objectives-list,
    .prerequisites-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .objectives-list li,
    .prerequisites-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .objectives-list li:last-child,
    .prerequisites-list li:last-child {
      border-bottom: none;
    }



    .objectives-list span,
    .prerequisites-list span {
      flex: 1;
      font-size: 1rem;
      line-height: 1.5;
      color: #555;
    }

    .course-video-section h3,
    .course-schedule-section h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 32px 0 16px 0;
    }

    .video-player-container {
      display: flex;
      justify-content: center;
      background: #000;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }

    .course-video-player {
      max-width: 100%;
      max-height: 400px;
      border-radius: 4px;
    }

    .schedule-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .schedule-item {
      margin-bottom: 12px;
      font-size: 1rem;
      color: #2c3e50;
    }

    .schedule-item:last-child {
      margin-bottom: 0;
    }

    .schedule-item strong {
      color: #495057;
      margin-right: 8px;
    }

    .course-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px 32px;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
      border-radius: 0 0 12px 12px;
    }

    .course-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Status chip styles */
    .mat-mdc-chip.active { background-color: #e3f2fd; color: #1976d2; }
    .mat-mdc-chip.completed { background-color: #e8f5e8; color: #2e7d32; }
    .mat-mdc-chip.upcoming { background-color: #fff3e0; color: #f57c00; }

    /* Category chip styles */
    .mat-mdc-chip.programming { background-color: #e3f2fd; color: #1976d2; }
    .mat-mdc-chip.design { background-color: #f3e5f5; color: #7b1fa2; }
    .mat-mdc-chip.business { background-color: #e8f5e8; color: #2e7d32; }
    .mat-mdc-chip.data { background-color: #fff3e0; color: #f57c00; }

    @media (max-width: 768px) {
      .course-header {
        padding: 24px;
      }

      .course-title {
        font-size: 1.5rem;
      }

      .course-title-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .course-content {
        padding: 24px;
      }

      .course-details-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .course-actions {
        padding: 20px 24px;
        flex-direction: column;
      }

      .course-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CourseDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CourseDetailsDialogComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  enrollInCourse() {
    this.dialogRef.close({ action: 'enroll', course: this.data });
  }

  continueCourse() {
    this.dialogRef.close({ action: 'continue', course: this.data });
  }

  downloadCertificate() {
    // In a real application, this would download the course completion certificate
    alert('Certificate download functionality would be implemented here');
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'completed': 'Completed',
      'upcoming': 'Upcoming'
    };
    return statusMap[status] || status;
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase();
  }

  getCourseObjectives(): string[] {
    // Mock objectives based on course category
    const objectives: { [key: string]: string[] } = {
      'programming': [
        'Understand advanced programming concepts',
        'Implement complex algorithms and data structures',
        'Debug and optimize code performance',
        'Apply best practices in software development'
      ],
      'design': [
        'Master UI/UX design principles',
        'Create user-centered design solutions',
        'Use design tools effectively',
        'Conduct user research and testing'
      ],
      'business': [
        'Develop effective communication skills',
        'Master presentation techniques',
        'Understand business etiquette',
        'Build professional networks'
      ],
      'data': [
        'Learn machine learning fundamentals',
        'Apply statistical methods to data',
        'Build predictive models',
        'Interpret and visualize data insights'
      ]
    };

    return objectives[this.data.category] || [];
  }

  getPrerequisites(): string[] {
    // Mock prerequisites based on course category
    const prerequisites: { [key: string]: string[] } = {
      'programming': [
        'Basic programming knowledge',
        'Understanding of variables and functions',
        'Familiarity with a programming language'
      ],
      'design': [
        'Basic computer skills',
        'Interest in visual design',
        'Creative thinking abilities'
      ],
      'business': [
        'Basic communication skills',
        'Professional work experience preferred'
      ],
      'data': [
        'Basic mathematics and statistics',
        'Programming knowledge preferred',
        'Understanding of data concepts'
      ]
    };

    return prerequisites[this.data.category] || [];
  }
}