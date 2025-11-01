import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
  activityLogs: ActivityLog[] = [
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      action: 'login',
      resource: 'System',
      details: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date('2024-01-20T09:30:00'),
      severity: 'low'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@techcorp.com',
      action: 'create',
      resource: 'Job Posting',
      details: 'Created new job posting: Senior Frontend Developer',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: new Date('2024-01-20T10:15:00'),
      severity: 'medium'
    },
    {
      id: 3,
      userId: 3,
      userName: 'Bob Johnson',
      userEmail: 'bob.johnson@student.edu',
      action: 'update',
      resource: 'Assignment',
      details: 'Submitted assignment: JavaScript Closures Exercise',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
      timestamp: new Date('2024-01-20T11:45:00'),
      severity: 'low'
    },
    {
      id: 4,
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      action: 'delete',
      resource: 'User Account',
      details: 'Attempted to delete user account (blocked by system)',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date('2024-01-20T14:20:00'),
      severity: 'high'
    },
    {
      id: 5,
      userId: 4,
      userName: 'Alice Brown',
      userEmail: 'alice.brown@university.edu',
      action: 'view',
      resource: 'Student Grades',
      details: 'Viewed grades for course: Data Structures & Algorithms',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      timestamp: new Date('2024-01-20T16:30:00'),
      severity: 'low'
    }
  ];

  userFilter = '';
  actionFilter = '';
  severityFilter = '';
  searchFilter = '';
  displayedColumns: string[] = ['timestamp', 'user', 'action', 'details', 'severity', 'actions'];

  ngOnInit() {
    // Load activity logs from API
  }

  get filteredLogs(): ActivityLog[] {
    return this.activityLogs.filter(log => {
      const userMatch = !this.userFilter || log.userId.toString() === this.userFilter;
      const actionMatch = !this.actionFilter || log.action === this.actionFilter;
      const severityMatch = !this.severityFilter || log.severity === this.severityFilter;
      const searchMatch = !this.searchFilter ||
        log.userName.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        log.details.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        log.resource.toLowerCase().includes(this.searchFilter.toLowerCase());

      return userMatch && actionMatch && severityMatch && searchMatch;
    });
  }

  getTodaysActivities(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.activityLogs.filter(log =>
      log.timestamp >= today && log.timestamp < tomorrow
    ).length;
  }

  getCriticalActivities(): number {
    return this.activityLogs.filter(log => log.severity === 'critical').length;
  }

  getUniqueUsers(): number {
    const uniqueUsers = new Set(this.activityLogs.map(log => log.userId));
    return uniqueUsers.size;
  }

  getUniqueUserList() {
    const uniqueUsers = new Map<number, { id: number; name: string; email: string }>();
    this.activityLogs.forEach(log => {
      if (!uniqueUsers.has(log.userId)) {
        uniqueUsers.set(log.userId, {
          id: log.userId,
          name: log.userName,
          email: log.userEmail
        });
      }
    });
    return Array.from(uniqueUsers.values());
  }

  getRecentActivities(): ActivityLog[] {
    return this.activityLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }

  getSecurityEvents(): ActivityLog[] {
    return this.activityLogs.filter(log =>
      log.severity === 'high' || log.severity === 'critical'
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#607d8b'];
    const index = name.length % colors.length;
    return colors[index];
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  getActionClass(action: string): string {
    return action.toLowerCase();
  }

  getActionText(action: string): string {
    const actionMap: { [key: string]: string } = {
      'login': 'Login',
      'logout': 'Logout',
      'create': 'Create',
      'update': 'Update',
      'delete': 'Delete',
      'view': 'View'
    };
    return actionMap[action] || action;
  }

  getSeverityClass(severity: string): string {
    return severity.toLowerCase();
  }

  getSeverityText(severity: string): string {
    const severityMap: { [key: string]: string } = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'critical': 'Critical'
    };
    return severityMap[severity] || severity;
  }

  getSeverityIcon(severity: string): string {
    const iconMap: { [key: string]: string } = {
      'low': 'info',
      'medium': 'warning',
      'high': 'error',
      'critical': 'report_problem'
    };
    return iconMap[severity] || 'info';
  }

  getSeverityIconClass(severity: string): string {
    const classMap: { [key: string]: string } = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical'
    };
    return classMap[severity] || 'low';
  }

  viewActivityDetails(log: ActivityLog) {
    console.log('View activity details:', log);
    // Open activity detail modal
  }

  viewUserProfile(userId: number) {
    console.log('View user profile:', userId);
    // Navigate to user profile
  }

  exportLogs() {
    console.log('Export activity logs');
    // Export logs to CSV/Excel
  }

  investigateEvent(log: ActivityLog) {
    console.log('Investigate security event:', log);
    // Open investigation modal
  }

  blockUser(userId: number) {
    console.log('Block user:', userId);
    // Block user account
  }
}