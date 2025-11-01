import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface AssessmentResult {
  id: number;
  assessmentTitle: string;
  courseName: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  status: 'passed' | 'failed';
  submittedDate: Date;
  timeTaken: number; // in minutes
  attempts: number;
  maxAttempts: number;
  instructorFeedback?: string;
  nextAttemptDate?: Date;
}

interface DetailedResult {
  assessmentId: number;
  questionId: number;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  explanation?: string;
}

@Component({
  selector: 'app-assessment-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss']
})
export class AssessmentResultsComponent implements OnInit {
  assessmentResults: AssessmentResult[] = [
    {
      id: 1,
      assessmentTitle: 'JavaScript Fundamentals Quiz',
      courseName: 'Advanced JavaScript Concepts',
      score: 85,
      maxScore: 100,
      percentage: 85,
      grade: 'B',
      status: 'passed',
      submittedDate: new Date('2024-01-20T14:30:00'),
      timeTaken: 45,
      attempts: 1,
      maxAttempts: 2,
      instructorFeedback: 'Good work! Focus on advanced concepts for better scores.'
    },
    {
      id: 2,
      assessmentTitle: 'UI/UX Design Project',
      courseName: 'UI/UX Design Principles',
      score: 92,
      maxScore: 200,
      percentage: 46,
      grade: 'F',
      status: 'failed',
      submittedDate: new Date('2024-01-18T16:45:00'),
      timeTaken: 120,
      attempts: 1,
      maxAttempts: 3,
      nextAttemptDate: new Date('2024-01-25')
    },
    {
      id: 3,
      assessmentTitle: 'Data Structures Final Exam',
      courseName: 'Data Structures & Algorithms',
      score: 180,
      maxScore: 200,
      percentage: 90,
      grade: 'A',
      status: 'passed',
      submittedDate: new Date('2024-01-15T10:15:00'),
      timeTaken: 90,
      attempts: 1,
      maxAttempts: 1
    }
  ];

  selectedResult: AssessmentResult | null = null;
  detailedResults: DetailedResult[] | null = null;
  displayedColumns: string[] = ['assessment', 'score', 'status', 'submitted', 'actions'];

  ngOnInit() {
    // Load assessment results from API
  }

  getAverageScore(): number {
    if (this.assessmentResults.length === 0) return 0;
    const total = this.assessmentResults.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / this.assessmentResults.length);
  }

  getPassedAssessments(): number {
    return this.assessmentResults.filter(result => result.status === 'passed').length;
  }

  getFailedAssessments(): number {
    return this.assessmentResults.filter(result => result.status === 'failed').length;
  }

  getTotalAssessments(): number {
    return this.assessmentResults.length;
  }

  getPassedAssessmentsList(): AssessmentResult[] {
    return this.assessmentResults.filter(result => result.status === 'passed');
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'passed': 'Passed',
      'failed': 'Failed'
    };
    return statusMap[status] || status;
  }

  getGradeClass(grade: string): string {
    return grade.toUpperCase();
  }

  canRetake(result: AssessmentResult): boolean {
    return result.attempts < result.maxAttempts &&
           (!result.nextAttemptDate || result.nextAttemptDate <= new Date());
  }

  getScoreDistribution(min: number, max: number): number {
    const count = this.getScoreCount(min, max);
    return this.assessmentResults.length > 0 ? (count / this.assessmentResults.length) * 100 : 0;
  }

  getScoreCount(min: number, max: number): number {
    return this.assessmentResults.filter(result =>
      result.percentage >= min && result.percentage <= max
    ).length;
  }

  getRecentAverageScore(days: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentResults = this.assessmentResults.filter(result =>
      result.submittedDate >= cutoffDate
    );

    if (recentResults.length === 0) return 0;

    const total = recentResults.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / recentResults.length);
  }

  getPerformanceChange(days: number): string {
    const current = this.getRecentAverageScore(days);
    const previous = this.getRecentAverageScore(days * 2);

    if (previous === 0) return 'N/A';

    const change = current - previous;
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return '0%';
  }

  getPerformanceChangeClass(days: number): string {
    const change = this.getRecentAverageScore(days) - this.getRecentAverageScore(days * 2);
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  getImprovementRate(): number {
    // Simple improvement calculation based on recent assessments
    const sortedResults = [...this.assessmentResults].sort((a, b) =>
      a.submittedDate.getTime() - b.submittedDate.getTime()
    );

    if (sortedResults.length < 2) return 0;

    const firstHalf = sortedResults.slice(0, Math.floor(sortedResults.length / 2));
    const secondHalf = sortedResults.slice(Math.floor(sortedResults.length / 2));

    const firstAvg = firstHalf.reduce((sum, result) => sum + result.percentage, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, result) => sum + result.percentage, 0) / secondHalf.length;

    return Math.round(secondAvg - firstAvg);
  }

  viewDetailedResult(result: AssessmentResult) {
    this.selectedResult = result;
    // In real app, load detailed results from API
    this.detailedResults = [
      {
        assessmentId: result.id,
        questionId: 1,
        question: 'What is the correct way to declare a variable in JavaScript?',
        yourAnswer: 'var myVar;',
        correctAnswer: 'var myVar;',
        isCorrect: true,
        points: 20,
        maxPoints: 20,
        explanation: 'The var keyword is used to declare variables in JavaScript.'
      },
      {
        assessmentId: result.id,
        questionId: 2,
        question: 'Which of the following are JavaScript data types?',
        yourAnswer: 'String, Number, Boolean',
        correctAnswer: 'String, Number, Boolean, Object',
        isCorrect: false,
        points: 15,
        maxPoints: 20,
        explanation: 'JavaScript has String, Number, Boolean, Object, and other data types.'
      }
    ];
  }

  closeDetailedResult() {
    this.selectedResult = null;
    this.detailedResults = null;
  }

  downloadCertificate(result: AssessmentResult) {
    console.log('Download certificate for:', result);
    // Generate and download certificate
  }

  shareCertificate(result: AssessmentResult) {
    console.log('Share certificate for:', result);
    // Open share dialog
  }

  retakeAssessment(result: AssessmentResult) {
    console.log('Retake assessment:', result);
    // Navigate to assessment taking page
  }

  viewFeedback(result: AssessmentResult) {
    console.log('View feedback for:', result);
    // Open feedback modal
  }

  downloadReport() {
    console.log('Download performance report');
    // Generate and download comprehensive report
  }
}