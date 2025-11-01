import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }

  navigateToSettings() {
    this.router.navigate(['/admin/settings']);
  }

  navigateToReports() {
    this.router.navigate(['/admin/reports']);
  }

  navigateToHealth() {
    this.router.navigate(['/admin/health']);
  }

  navigateToEnrollment() {
    this.router.navigate(['/admin/enrollment']);
  }

  navigateToAssessmentAssignment() {
    this.router.navigate(['/admin/assessment-assignment']);
  }
}