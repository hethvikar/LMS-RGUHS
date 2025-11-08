import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-question-bank',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule
  ],
  template: `
    <div class="question-bank-container">
      <div class="header">
        <h1>
          <mat-icon>quiz</mat-icon>
          Question Bank Management
        </h1>
        <p class="subtitle">Create, manage, and organize assessment questions</p>
      </div>

      <div class="navigation-links">
        <mat-card class="nav-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>library_books</mat-icon>
            <mat-card-title>Full Question Bank</mat-card-title>
            <mat-card-subtitle>Access the complete question management system</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Access the full-featured question bank with advanced editing, categorization, and import/export capabilities.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="openQuestionBank()">
              <mat-icon>quiz</mat-icon>
              Open Question Bank
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-tab-group class="admin-tabs">
        <mat-tab label="Quick Actions">
          <div class="tab-content">
            <div class="actions-grid">
              <mat-card class="action-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar color="primary">add_circle</mat-icon>
                  <mat-card-title>Create Question</mat-card-title>
                  <mat-card-subtitle>Add new questions to the bank</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="createQuestion()">
                    <mat-icon>add</mat-icon>
                    Create New
                  </button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="action-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar color="accent">file_upload</mat-icon>
                  <mat-card-title>Import Questions</mat-card-title>
                  <mat-card-subtitle>Bulk upload from Excel/CSV</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="accent">
                    <mat-icon>upload_file</mat-icon>
                    Import
                  </button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="action-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar color="warn">analytics</mat-icon>
                  <mat-card-title>Question Analytics</mat-card-title>
                  <mat-card-subtitle>View usage statistics</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="warn">
                    <mat-icon>bar_chart</mat-icon>
                    View Stats
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Recent Questions">
          <div class="tab-content">
            <div class="recent-questions">
              <mat-card class="question-preview">
                <mat-card-header>
                  <mat-card-title>Sample Question 1</mat-card-title>
                  <mat-card-subtitle>Computer Science • Multiple Choice • Medium</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p><strong>Q:</strong> What is the time complexity of binary search?</p>
                  <div class="options">
                    <p>A) O(n)</p>
                    <p>B) O(log n) ✓</p>
                    <p>C) O(n²)</p>
                    <p>D) O(1)</p>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button><mat-icon>delete</mat-icon></button>
                </mat-card-actions>
              </mat-card>

              <mat-card class="question-preview">
                <mat-card-header>
                  <mat-card-title>Sample Question 2</mat-card-title>
                  <mat-card-subtitle>Mathematics • True/False • Easy</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p><strong>Q:</strong> The derivative of sin(x) is cos(x).</p>
                  <div class="options">
                    <p>True ✓</p>
                    <p>False</p>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button><mat-icon>delete</mat-icon></button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Categories">
          <div class="tab-content">
            <div class="categories-grid">
              <mat-card *ngFor="let category of categories" class="category-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar>folder</mat-icon>
                  <mat-card-title>{{category.name}}</mat-card-title>
                  <mat-card-subtitle>{{category.count}} questions</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-button>VIEW</button>
                  <button mat-button>EDIT</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .question-bank-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
      
      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 8px 0;
        color: #333;
        font-size: 28px;
        font-weight: 500;
      }

      .subtitle {
        margin: 0;
        color: #666;
        font-size: 16px;
      }
    }

    .navigation-links {
      margin-bottom: 32px;

      .nav-card {
        max-width: 500px;
        
        mat-card-actions {
          padding: 16px;
        }
      }
    }

    .admin-tabs {
      .mat-mdc-tab-body-content {
        padding: 0;
      }
    }

    .tab-content {
      padding: 24px 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;

      .action-card {
        text-align: center;

        mat-card-actions {
          padding: 16px;
          justify-content: center;
        }
      }
    }

    .recent-questions {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .question-preview {
        .options {
          margin: 12px 0;
          padding-left: 16px;
          
          p {
            margin: 4px 0;
            font-size: 14px;
          }
        }

        mat-card-actions {
          padding: 8px 16px;
        }
      }
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;

      .category-card {
        mat-card-actions {
          padding: 16px;
          justify-content: space-between;
        }
      }
    }

    @media (max-width: 768px) {
      .question-bank-container {
        padding: 16px;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .navigation-links .nav-card {
        max-width: none;
      }
    }
  `]
})
export class AdminQuestionBankComponent {
  categories = [
    { name: 'Computer Science', count: 45 },
    { name: 'Mathematics', count: 38 },
    { name: 'Physics', count: 29 },
    { name: 'Chemistry', count: 33 },
    { name: 'Biology', count: 27 },
    { name: 'English', count: 31 }
  ];

  constructor(private router: Router) {}

  openQuestionBank(): void {
    console.log('Navigating to LMS Question Bank...');
    this.router.navigate(['/lms/question-bank']).then(
      (success) => console.log('Navigation success:', success),
      (error) => console.error('Navigation failed:', error)
    );
  }

  createQuestion(): void {
    console.log('Navigating to LMS Question Bank with create action...');
    this.router.navigate(['/lms/question-bank'], { 
      queryParams: { action: 'create' } 
    }).then(
      (success) => console.log('Navigation success:', success),
      (error) => console.error('Navigation failed:', error)
    );
  }
}