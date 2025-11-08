import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    RouterModule
  ],
  template: `
    <div class="help-container">
      <div class="header">
        <h1>
          <mat-icon>help</mat-icon>
          Help & Support
        </h1>
        <p class="subtitle">Find answers to common questions and get support</p>
      </div>

      <div class="content">
        <mat-card class="help-section">
          <mat-card-header>
            <mat-card-title>Frequently Asked Questions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-accordion>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>How do I update my profile?</mat-panel-title>
                </mat-expansion-panel-header>
                <p>
                  Click on your account menu at the top right corner and select "Profile". 
                  You can then edit your personal information, contact details, and preferences.
                </p>
              </mat-expansion-panel>
              
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>How do I change my password?</mat-panel-title>
                </mat-expansion-panel-header>
                <p>
                  Go to your account menu at the top right and select "Change Password". 
                  Enter your current password and your new password to update it.
                </p>
              </mat-expansion-panel>
              
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>How do I access my courses?</mat-panel-title>
                </mat-expansion-panel-header>
                <p>
                  Students can access courses through the Learning section in the sidebar menu. 
                  Click on "Search Courses" to browse available courses and enroll.
                </p>
              </mat-expansion-panel>
              
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>How do I contact support?</mat-panel-title>
                </mat-expansion-panel-header>
                <p>
                  You can contact our support team via email at support&#64;lms-rguhs.edu.in 
                  or call us at +91-80-12345678 during business hours (9 AM - 6 PM).
                </p>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-card-content>
        </mat-card>

        <mat-card class="contact-section">
          <mat-card-header>
            <mat-card-title>Need More Help?</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="contact-options">
              <div class="contact-item">
                <mat-icon>chat</mat-icon>
                <div>
                  <h4>Live Chat</h4>
                  <p>Click the chat icon in the bottom right for instant help!</p>
                </div>
              </div>
              
              <div class="contact-item">
                <mat-icon>email</mat-icon>
                <div>
                  <h4>Email Support</h4>
                  <p>support&#64;lms-rguhs.edu.in</p>
                </div>
              </div>
              
              <div class="contact-item">
                <mat-icon>phone</mat-icon>
                <div>
                  <h4>Phone Support</h4>
                  <p>+91-80-12345678</p>
                </div>
              </div>
              
              <div class="contact-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <h4>Support Hours</h4>
                  <p>Monday - Friday: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">
              <mat-icon>chat</mat-icon>
              Start Live Chat
            </button>
            <button mat-raised-button routerLink="/report-issue">
              <mat-icon>bug_report</mat-icon>
              Report Issue
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .help-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
      text-align: center;
      
      h1 {
        display: flex;
        align-items: center;
        justify-content: center;
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

    .content {
      display: grid;
      gap: 24px;
    }

    .help-section,
    .contact-section {
      .mat-expansion-panel {
        margin-bottom: 8px;
      }
    }

    .contact-options {
      display: grid;
      gap: 16px;
      margin: 16px 0;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 16px;
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #666;
      }
      
      h4 {
        margin: 0 0 4px 0;
        color: #333;
        font-size: 16px;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .help-container {
        padding: 16px;
      }
      
      .header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class HelpComponent {
  constructor() {}
}