import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent {
  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/company/profile']);
  }

  navigateToJobs() {
    this.router.navigate(['/company/jobs']);
  }

  navigateToCandidates() {
    this.router.navigate(['/company/candidates']);
  }

  navigateToInterviews() {
    this.router.navigate(['/company/interviews']);
  }
}