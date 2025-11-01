import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lms-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './lms-dashboard.component.html',
  styleUrls: ['./lms-dashboard.component.scss']
})
export class LmsDashboardComponent {
  constructor(private router: Router) {}

  navigateToCourses() {
    this.router.navigate(['/lms/courses']);
  }

  navigateToAssignments() {
    this.router.navigate(['/lms/assignments']);
  }

  navigateToResources() {
    this.router.navigate(['/lms/resources']);
  }

  navigateToProgress() {
    this.router.navigate(['/lms/progress']);
  }
}