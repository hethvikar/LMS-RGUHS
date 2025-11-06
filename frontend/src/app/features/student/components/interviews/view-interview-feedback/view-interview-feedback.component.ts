import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface InterviewFeedback {
  id: number;
  companyName: string;
  position: string;
  interviewDate: Date;
  interviewType: string;
  interviewer: string;
  duration: string;
  overallRating: number;
  technicalSkills?: {
    rating: number;
    comments: string;
  };
  communicationSkills?: {
    rating: number;
    comments: string;
  };
  problemSolving?: {
    rating: number;
    comments: string;
  };
  cultureFit?: {
    rating: number;
    comments: string;
  };
  strengths?: string[];
  areasOfImprovement?: string[];
  generalComments?: string;
  recommendation: 'strongly-recommended' | 'recommended' | 'maybe' | 'not-recommended';
  nextSteps?: string;
  followUpDate?: Date;
}

@Component({
  selector: 'app-view-interview-feedback',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  templateUrl: './view-interview-feedback.component.html',
  styleUrls: ['./view-interview-feedback.component.scss']
})
export class ViewInterviewFeedbackComponent {
  feedback: InterviewFeedback;

  constructor(
    public dialogRef: MatDialogRef<ViewInterviewFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { interview: any }
  ) {
    // Generate comprehensive feedback based on interview data
    this.feedback = this.generateFeedback(data.interview);
  }

  private generateFeedback(interview: any): InterviewFeedback {
    const baseRating = Math.floor(Math.random() * 3) + 3; // 3-5 rating

    return {
      id: interview.id,
      companyName: interview.companyName,
      position: interview.position,
      interviewDate: interview.interviewDate,
      interviewType: interview.interviewType,
      interviewer: interview.interviewer,
      duration: '45 minutes',
      overallRating: baseRating,
      technicalSkills: {
        rating: baseRating,
        comments: 'Demonstrated strong understanding of core concepts. Good problem-solving approach and ability to think through complex scenarios.'
      },
      communicationSkills: {
        rating: baseRating === 5 ? 5 : baseRating + 1,
        comments: 'Excellent communication skills. Able to articulate thoughts clearly and ask relevant questions. Active listener.'
      },
      problemSolving: {
        rating: baseRating,
        comments: 'Shows good analytical thinking. Approached problems systematically and considered multiple solutions before deciding.'
      },
      cultureFit: {
        rating: baseRating === 5 ? 5 : baseRating + 1,
        comments: 'Aligns well with company values. Shows enthusiasm for the role and team collaboration.'
      },
      strengths: [
        'Strong technical foundation',
        'Excellent communication skills',
        'Quick learner',
        'Team-oriented mindset',
        'Problem-solving abilities'
      ],
      areasOfImprovement: [
        'Could benefit from more experience with cloud technologies',
        'Consider deepening knowledge in system design patterns',
        'Practice more complex algorithm problems'
      ],
      generalComments: 'The candidate performed well throughout the interview. They showed genuine interest in the role and asked insightful questions about the team and projects. Their technical skills are solid, and with some additional experience, they would be a strong addition to the team.',
      recommendation: baseRating >= 4 ? 'recommended' : 'maybe',
      nextSteps: baseRating >= 4 
        ? 'Proceed to next round - Final interview with CTO scheduled' 
        : 'Waiting for decision from hiring committee',
      followUpDate: baseRating >= 4 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getRatingPercentage(rating: number): number {
    return (rating / 5) * 100;
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) return 'rating-high';
    if (rating >= 3) return 'rating-medium';
    return 'rating-low';
  }

  getRecommendationClass(recommendation: string): string {
    const classMap: { [key: string]: string } = {
      'strongly-recommended': 'rec-excellent',
      'recommended': 'rec-good',
      'maybe': 'rec-average',
      'not-recommended': 'rec-poor'
    };
    return classMap[recommendation] || '';
  }

  getRecommendationText(recommendation: string): string {
    const textMap: { [key: string]: string } = {
      'strongly-recommended': 'Strongly Recommended',
      'recommended': 'Recommended',
      'maybe': 'Under Consideration',
      'not-recommended': 'Not Recommended'
    };
    return textMap[recommendation] || recommendation;
  }

  getRecommendationIcon(recommendation: string): string {
    const iconMap: { [key: string]: string } = {
      'strongly-recommended': 'star',
      'recommended': 'thumb_up',
      'maybe': 'help_outline',
      'not-recommended': 'thumb_down'
    };
    return iconMap[recommendation] || 'info';
  }

  downloadFeedback(): void {
    console.log('Downloading feedback report for interview:', this.feedback.id);
    // In real app, generate and download PDF
  }
}
