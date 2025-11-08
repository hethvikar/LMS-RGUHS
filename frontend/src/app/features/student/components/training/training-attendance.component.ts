import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface TrainingSession {
  id: number;
  courseId: number;
  courseName: string;
  sessionNumber: number;
  totalSessions: number;
  topic: string;
  date: Date;
  startTime: string;
  endTime: string;
  mode: 'online' | 'offline';
  venue?: string;
  meetingLink?: string;
  instructor: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attended: boolean;
  attendanceMarked: boolean;
  duration: number; // in minutes
  materials?: string[];
  recordingAvailable?: boolean;
  recordingUrl?: string;
}

interface AttendanceStats {
  totalSessions: number;
  attended: number;
  percentage: number;
  requiredPercentage: number;
  eligible: boolean;
}

@Component({
  selector: 'app-training-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './training-attendance.component.html',
  styleUrls: ['./training-attendance.component.scss']
})
export class TrainingAttendanceComponent implements OnInit {
  sessions: TrainingSession[] = [
    {
      id: 1,
      courseId: 1,
      courseName: 'Full Stack Web Development',
      sessionNumber: 1,
      totalSessions: 24,
      topic: 'Introduction to MEAN Stack & Development Environment Setup',
      date: new Date('2025-01-15T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructor: 'Dr. Rajesh Kumar',
      status: 'completed',
      attended: true,
      attendanceMarked: true,
      duration: 120,
      materials: ['Introduction_Slides.pdf', 'Setup_Guide.pdf'],
      recordingAvailable: true,
      recordingUrl: 'https://drive.google.com/recording1'
    },
    {
      id: 2,
      courseId: 1,
      courseName: 'Full Stack Web Development',
      sessionNumber: 2,
      totalSessions: 24,
      topic: 'Node.js Fundamentals - Async Programming & Event Loop',
      date: new Date('2025-01-17T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructor: 'Dr. Rajesh Kumar',
      status: 'completed',
      attended: true,
      attendanceMarked: true,
      duration: 120,
      materials: ['NodeJS_Basics.pdf', 'Code_Examples.zip'],
      recordingAvailable: true,
      recordingUrl: 'https://drive.google.com/recording2'
    },
    {
      id: 3,
      courseId: 1,
      courseName: 'Full Stack Web Development',
      sessionNumber: 3,
      totalSessions: 24,
      topic: 'Express.js - RESTful API Development',
      date: new Date('2025-01-19T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructor: 'Dr. Rajesh Kumar',
      status: 'completed',
      attended: false,
      attendanceMarked: true,
      duration: 120,
      materials: ['ExpressJS_Guide.pdf'],
      recordingAvailable: true,
      recordingUrl: 'https://drive.google.com/recording3'
    },
    {
      id: 4,
      courseId: 1,
      courseName: 'Full Stack Web Development',
      sessionNumber: 4,
      totalSessions: 24,
      topic: 'MongoDB - NoSQL Database Fundamentals',
      date: new Date('2025-01-22T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      mode: 'offline',
      venue: 'Lab 301, Main Building',
      instructor: 'Dr. Rajesh Kumar',
      status: 'ongoing',
      attended: false,
      attendanceMarked: false,
      duration: 120
    },
    {
      id: 5,
      courseId: 1,
      courseName: 'Full Stack Web Development',
      sessionNumber: 5,
      totalSessions: 24,
      topic: 'MongoDB - CRUD Operations & Mongoose ODM',
      date: new Date('2025-01-24T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructor: 'Dr. Rajesh Kumar',
      status: 'upcoming',
      attended: false,
      attendanceMarked: false,
      duration: 120
    },
    {
      id: 6,
      courseId: 1,
      courseName: 'Full Stack Web Development',
      sessionNumber: 6,
      totalSessions: 24,
      topic: 'Angular Basics - Components & Templates',
      date: new Date('2025-01-26T18:00:00'),
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructor: 'Dr. Rajesh Kumar',
      status: 'upcoming',
      attended: false,
      attendanceMarked: false,
      duration: 120
    },
    {
      id: 7,
      courseId: 2,
      courseName: 'Python for Data Science',
      sessionNumber: 1,
      totalSessions: 20,
      topic: 'Python Refresher & NumPy Basics',
      date: new Date('2025-01-20T19:00:00'),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      instructor: 'Prof. Anita Sharma',
      status: 'completed',
      attended: true,
      attendanceMarked: true,
      duration: 120,
      materials: ['Python_NumPy.pdf', 'Jupyter_Notebooks.zip'],
      recordingAvailable: true,
      recordingUrl: 'https://drive.google.com/recording4'
    },
    {
      id: 8,
      courseId: 2,
      courseName: 'Python for Data Science',
      sessionNumber: 2,
      totalSessions: 20,
      topic: 'Pandas - Data Manipulation & Analysis',
      date: new Date('2025-01-23T19:00:00'),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      mode: 'online',
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      instructor: 'Prof. Anita Sharma',
      status: 'upcoming',
      attended: false,
      attendanceMarked: false,
      duration: 120
    }
  ];

  displayedColumns = ['session', 'topic', 'date', 'time', 'mode', 'status', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  getUpcomingSessions(): TrainingSession[] {
    return this.sessions.filter(s => s.status === 'upcoming' || s.status === 'ongoing');
  }

  getCompletedSessions(): TrainingSession[] {
    return this.sessions.filter(s => s.status === 'completed');
  }

  getAttendanceStats(courseId?: number): AttendanceStats {
    const courseSessions = courseId 
      ? this.sessions.filter(s => s.courseId === courseId && s.attendanceMarked)
      : this.sessions.filter(s => s.attendanceMarked);

    const totalSessions = courseSessions.length;
    const attended = courseSessions.filter(s => s.attended).length;
    const percentage = totalSessions > 0 ? (attended / totalSessions) * 100 : 0;
    const requiredPercentage = 75;
    const eligible = percentage >= requiredPercentage;

    return {
      totalSessions,
      attended,
      percentage: Math.round(percentage),
      requiredPercentage,
      eligible
    };
  }

  getOverallAttendanceStats(): AttendanceStats {
    return this.getAttendanceStats();
  }

  joinSession(session: TrainingSession) {
    if (session.mode === 'online' && session.meetingLink) {
      window.open(session.meetingLink, '_blank');
      this.snackBar.open(`Joining ${session.topic}...`, 'Close', { duration: 3000 });
    } else if (session.mode === 'offline' && session.venue) {
      this.snackBar.open(`Venue: ${session.venue}`, 'Close', { duration: 5000 });
    }
  }

  markSelfAttendance(session: TrainingSession) {
    // In production, this would verify location/time/etc
    session.attended = true;
    session.attendanceMarked = true;
    this.snackBar.open('Attendance marked successfully', 'Close', { duration: 3000 });
  }

  downloadMaterial(material: string) {
    this.snackBar.open(`Downloading ${material}...`, 'Close', { duration: 2000 });
    // In production, this would download the actual file
  }

  watchRecording(session: TrainingSession) {
    if (session.recordingUrl) {
      window.open(session.recordingUrl, '_blank');
    }
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'upcoming': 'primary',
      'ongoing': 'accent',
      'completed': 'success',
      'cancelled': 'warn'
    };
    return colors[status] || 'primary';
  }

  getModeIcon(mode: string): string {
    return mode === 'online' ? 'computer' : 'meeting_room';
  }

  getAttendanceColor(percentage: number): string {
    if (percentage >= 75) return 'success';
    if (percentage >= 60) return 'warn';
    return 'danger';
  }

  isSessionLive(session: TrainingSession): boolean {
    return session.status === 'ongoing';
  }

  canJoinSession(session: TrainingSession): boolean {
    if (session.status === 'ongoing') return true;
    if (session.status === 'upcoming') {
      const sessionTime = new Date(session.date).getTime();
      const now = new Date().getTime();
      const timeDiff = sessionTime - now;
      return timeDiff <= 15 * 60 * 1000; // Can join 15 minutes before
    }
    return false;
  }

  getUniqueCourses(): { id: number; name: string }[] {
    const coursesMap = new Map<number, string>();
    this.sessions.forEach(s => coursesMap.set(s.courseId, s.courseName));
    return Array.from(coursesMap.entries()).map(([id, name]) => ({ id, name }));
  }

  getCourseProgress(courseId: number): number {
    const courseSessions = this.sessions.filter(s => s.courseId === courseId);
    const completed = courseSessions.filter(s => s.status === 'completed').length;
    const total = courseSessions[0]?.totalSessions || 0;
    return total > 0 ? (completed / total) * 100 : 0;
  }
}
