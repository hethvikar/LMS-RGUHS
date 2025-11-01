import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface Assignment {
  id: number;
  title: string;
  courseName: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  submittedDate?: Date;
  grade?: string;
  feedback?: string;
  maxScore?: number;
  score?: number;
}

@Component({
  selector: 'app-lms-assignments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss']
})
export class LmsAssignmentsComponent implements OnInit {
  assignments: Assignment[] = [
    {
      id: 1,
      title: 'JavaScript Closures Exercise',
      courseName: 'Advanced JavaScript Concepts',
      description: 'Implement various closure patterns and explain their use cases.',
      dueDate: new Date('2024-02-01'),
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'UI Wireframe Design',
      courseName: 'UI/UX Design Principles',
      description: 'Create wireframes for a mobile application interface.',
      dueDate: new Date('2024-01-28'),
      status: 'submitted',
      priority: 'medium',
      submittedDate: new Date('2024-01-25'),
      grade: '85',
      maxScore: 100,
      feedback: 'Good work on the wireframes. Consider improving the user flow.'
    },
    {
      id: 3,
      title: 'Algorithm Complexity Analysis',
      courseName: 'Data Structures & Algorithms',
      description: 'Analyze time and space complexity of sorting algorithms.',
      dueDate: new Date('2024-01-20'),
      status: 'graded',
      priority: 'high',
      submittedDate: new Date('2024-01-18'),
      grade: '92',
      maxScore: 100,
      feedback: 'Excellent analysis with clear explanations.'
    },
    {
      id: 4,
      title: 'Business Case Study',
      courseName: 'Business Communication Skills',
      description: 'Prepare a business presentation on a given case study.',
      dueDate: new Date('2024-01-15'),
      status: 'overdue',
      priority: 'medium'
    }
  ];

  displayedColumns: string[] = ['title', 'dueDate', 'status', 'priority', 'grade', 'actions'];

  ngOnInit() {
    // Load assignments from API
  }

  getPendingAssignments(): Assignment[] {
    return this.assignments.filter(assignment => assignment.status === 'pending');
  }

  getSubmittedAssignments(): Assignment[] {
    return this.assignments.filter(assignment => assignment.status === 'submitted' || assignment.status === 'graded');
  }

  getGradedAssignments(): Assignment[] {
    return this.assignments.filter(assignment => assignment.status === 'graded');
  }

  getOverdueAssignments(): Assignment[] {
    const now = new Date();
    return this.assignments.filter(assignment =>
      assignment.status === 'pending' && assignment.dueDate < now
    );
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'submitted': 'Submitted',
      'graded': 'Graded',
      'overdue': 'Overdue'
    };
    return statusMap[status] || status;
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }

  getPriorityText(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High'
    };
    return priorityMap[priority] || priority;
  }

  getTimeRemainingText(dueDate: Date): string {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  }

  getTimeRemainingClass(dueDate: Date): string {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'overdue';
    } else if (diffDays <= 1) {
      return 'due-soon';
    } else {
      return 'on-time';
    }
  }

  viewAssignment(assignment: Assignment) {
    console.log('View assignment:', assignment);
    // Open assignment detail modal
  }

  submitAssignment(assignment: Assignment) {
    console.log('Submit assignment:', assignment);
    // Open file upload dialog
  }

  downloadSubmission(assignment: Assignment) {
    console.log('Download submission:', assignment);
    // Download submitted file
  }

  viewFeedback(assignment: Assignment) {
    console.log('View feedback:', assignment);
    // Open feedback modal
  }
}