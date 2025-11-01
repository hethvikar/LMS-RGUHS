import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/student/profile']);
  }

  navigateToApplications() {
    this.router.navigate(['/student/applications']);
  }

  navigateToInterviews() {
    this.router.navigate(['/student/interviews']);
  }

  navigateToPlacementStatus() {
    this.router.navigate(['/student/placement-status']);
  }
}