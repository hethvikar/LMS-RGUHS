import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ScheduleMultiRoundDialogComponent } from './schedule-multi-round-dialog.component';
import { RecordFeedbackDialogComponent } from './record-feedback-dialog.component';
import { FinalSelectionDialogComponent } from './final-selection-dialog.component';

interface InterviewRound {
  roundNumber: number;
  roundType: 'technical' | 'hr' | 'managerial' | 'final';
  scheduledDate?: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  interviewer?: string;
  location?: string;
  feedback?: string;
  rating?: number; // 1-5
  result?: 'pass' | 'fail' | 'on-hold';
  notes?: string;
}

interface CandidateInterview {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  appliedDate: Date;
  currentRound: number;
  totalRounds: number;
  overallStatus: 'in-process' | 'selected' | 'rejected' | 'on-hold';
  rounds: InterviewRound[];
  finalDecision?: 'selected' | 'rejected' | 'on-hold';
  offerLetterUploaded?: boolean;
  offerLetterUrl?: string;
  offerDate?: Date;
}

@Component({
  selector: 'app-interview-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatExpansionModule,
    MatMenuModule
  ],
  templateUrl: './interview-management.component.html',
  styleUrls: ['./interview-management.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class InterviewManagementComponent implements OnInit {
  candidateInterviews: CandidateInterview[] = [
    {
      id: 1,
      candidateId: 101,
      candidateName: 'Rahul Sharma',
      candidateEmail: 'rahul.sharma@rguhs.edu',
      candidatePhone: '+91-9876543210',
      position: 'Frontend Developer',
      appliedDate: new Date('2024-01-15'),
      currentRound: 2,
      totalRounds: 3,
      overallStatus: 'in-process',
      rounds: [
        {
          roundNumber: 1,
          roundType: 'technical',
          scheduledDate: new Date('2024-01-20T10:00:00'),
          status: 'completed',
          interviewer: 'Sarah Johnson',
          location: 'Online (Zoom)',
          feedback: 'Strong Angular skills, good problem-solving. Needs improvement in RxJS operators.',
          rating: 4,
          result: 'pass',
          notes: 'Recommended for Round 2'
        },
        {
          roundNumber: 2,
          roundType: 'hr',
          scheduledDate: new Date('2024-01-25T14:00:00'),
          status: 'scheduled',
          interviewer: 'Mike Chen',
          location: 'Online (Teams)'
        },
        {
          roundNumber: 3,
          roundType: 'final',
          status: 'pending'
        }
      ]
    },
    {
      id: 2,
      candidateId: 102,
      candidateName: 'Priya Patel',
      candidateEmail: 'priya.patel@rguhs.edu',
      candidatePhone: '+91-9876543211',
      position: 'Data Scientist',
      appliedDate: new Date('2024-01-12'),
      currentRound: 3,
      totalRounds: 3,
      overallStatus: 'selected',
      finalDecision: 'selected',
      offerLetterUploaded: true,
      offerLetterUrl: '/assets/offers/priya-patel-offer.pdf',
      offerDate: new Date('2024-01-30'),
      rounds: [
        {
          roundNumber: 1,
          roundType: 'technical',
          scheduledDate: new Date('2024-01-18T11:00:00'),
          status: 'completed',
          interviewer: 'Dr. Emily Davis',
          location: 'Company Office',
          feedback: 'Excellent Python and ML knowledge. Strong portfolio.',
          rating: 5,
          result: 'pass'
        },
        {
          roundNumber: 2,
          roundType: 'hr',
          scheduledDate: new Date('2024-01-22T15:00:00'),
          status: 'completed',
          interviewer: 'Mike Chen',
          location: 'Online (Zoom)',
          feedback: 'Great communication skills, cultural fit.',
          rating: 5,
          result: 'pass'
        },
        {
          roundNumber: 3,
          roundType: 'final',
          scheduledDate: new Date('2024-01-28T10:00:00'),
          status: 'completed',
          interviewer: 'CEO - Robert Smith',
          location: 'Company Office',
          feedback: 'Impressive background. Strong candidate. Recommend immediate hiring.',
          rating: 5,
          result: 'pass'
        }
      ]
    },
    {
      id: 3,
      candidateId: 103,
      candidateName: 'Amit Kumar',
      candidateEmail: 'amit.kumar@rguhs.edu',
      candidatePhone: '+91-9876543212',
      position: 'Backend Developer',
      appliedDate: new Date('2024-01-10'),
      currentRound: 1,
      totalRounds: 3,
      overallStatus: 'rejected',
      finalDecision: 'rejected',
      rounds: [
        {
          roundNumber: 1,
          roundType: 'technical',
          scheduledDate: new Date('2024-01-16T14:30:00'),
          status: 'completed',
          interviewer: 'Sarah Johnson',
          location: 'Online (Zoom)',
          feedback: 'Basic Node.js knowledge. Struggled with system design questions. Not ready for mid-level role.',
          rating: 2,
          result: 'fail',
          notes: 'Rejected after Round 1'
        },
        {
          roundNumber: 2,
          roundType: 'hr',
          status: 'cancelled'
        },
        {
          roundNumber: 3,
          roundType: 'final',
          status: 'cancelled'
        }
      ]
    },
    {
      id: 4,
      candidateId: 104,
      candidateName: 'Sneha Reddy',
      candidateEmail: 'sneha.reddy@rguhs.edu',
      candidatePhone: '+91-9876543213',
      position: 'Full Stack Developer',
      appliedDate: new Date('2024-01-14'),
      currentRound: 1,
      totalRounds: 2,
      overallStatus: 'in-process',
      rounds: [
        {
          roundNumber: 1,
          roundType: 'technical',
          scheduledDate: new Date('2024-01-26T10:00:00'),
          status: 'scheduled',
          interviewer: 'Dr. Emily Davis',
          location: 'Online (Teams)',
          notes: 'Focus on React and Spring Boot'
        },
        {
          roundNumber: 2,
          roundType: 'final',
          status: 'pending'
        }
      ]
    }
  ];

  displayedColumns: string[] = ['candidate', 'progress', 'currentRound', 'status', 'actions'];
  expandedCandidate: CandidateInterview | null = null;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize
  }

  get inProcessCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'in-process');
  }

  get selectedCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'selected');
  }

  get rejectedCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'rejected');
  }

  get upcomingInterviews() {
    const upcoming: Array<{ candidate: CandidateInterview; round: InterviewRound }> = [];
    this.candidateInterviews.forEach(candidate => {
      candidate.rounds.forEach(round => {
        if (round.status === 'scheduled' && round.scheduledDate) {
          upcoming.push({ candidate, round });
        }
      });
    });
    return upcoming.sort((a, b) => 
      (a.round.scheduledDate?.getTime() || 0) - (b.round.scheduledDate?.getTime() || 0)
    );
  }

  scheduleInterview(candidate: CandidateInterview) {
    const nextRound = candidate.rounds.find(r => r.status === 'pending');
    
    const dialogRef = this.dialog.open(ScheduleMultiRoundDialogComponent, {
      width: '700px',
      data: { candidate, round: nextRound }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'scheduled' && nextRound) {
        nextRound.scheduledDate = result.date;
        nextRound.interviewer = result.interviewer;
        nextRound.location = result.location;
        nextRound.notes = result.notes;
        nextRound.status = 'scheduled';

        this.snackBar.open(
          `${this.getRoundLabel(nextRound.roundType)} scheduled for ${candidate.candidateName}`,
          'Close',
          { duration: 4000 }
        );
      }
    });
  }

  recordFeedback(candidate: CandidateInterview, round: InterviewRound) {
    const dialogRef = this.dialog.open(RecordFeedbackDialogComponent, {
      width: '800px',
      data: { candidate, round }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'submitted') {
        round.feedback = result.feedback;
        round.rating = result.rating;
        round.result = result.result;
        round.notes = result.notes;
        round.status = 'completed';

        // Move to next round or finalize
        if (result.result === 'pass') {
          if (candidate.currentRound < candidate.totalRounds) {
            candidate.currentRound++;
            this.snackBar.open(
              `${candidate.candidateName} moved to Round ${candidate.currentRound}`,
              'Close',
              { duration: 3000 }
            );
          } else {
            // All rounds completed - time for final decision
            this.openFinalSelection(candidate);
          }
        } else if (result.result === 'fail') {
          candidate.overallStatus = 'rejected';
          candidate.finalDecision = 'rejected';
          // Cancel remaining rounds
          candidate.rounds.forEach(r => {
            if (r.status === 'pending' || r.status === 'scheduled') {
              r.status = 'cancelled';
            }
          });
          this.snackBar.open(
            `${candidate.candidateName} rejected`,
            'Close',
            { duration: 3000 }
          );
        }
      }
    });
  }

  openFinalSelection(candidate: CandidateInterview) {
    const dialogRef = this.dialog.open(FinalSelectionDialogComponent, {
      width: '900px',
      data: { candidate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'decided') {
        candidate.finalDecision = result.decision;
        candidate.overallStatus = result.decision === 'selected' ? 'selected' : 
                                   result.decision === 'rejected' ? 'rejected' : 'on-hold';
        
        if (result.decision === 'selected') {
          if (result.offerLetterUrl) {
            candidate.offerLetterUploaded = true;
            candidate.offerLetterUrl = result.offerLetterUrl;
            candidate.offerDate = new Date();
          }
          this.snackBar.open(
            `${candidate.candidateName} selected! Offer letter ${result.offerLetterUrl ? 'uploaded' : 'pending'}`,
            'Close',
            { duration: 5000 }
          );
        } else if (result.decision === 'rejected') {
          this.snackBar.open(
            `${candidate.candidateName} rejected`,
            'Close',
            { duration: 3000 }
          );
        } else {
          candidate.overallStatus = 'on-hold';
          this.snackBar.open(
            `${candidate.candidateName} put on hold`,
            'Close',
            { duration: 3000 }
          );
        }
      }
    });
  }

  getProgressPercentage(candidate: CandidateInterview): number {
    return Math.round((candidate.currentRound / candidate.totalRounds) * 100);
  }

  getCurrentRoundInfo(candidate: CandidateInterview): string {
    const currentRound = candidate.rounds[candidate.currentRound - 1];
    if (currentRound) {
      return `Round ${candidate.currentRound}: ${this.getRoundLabel(currentRound.roundType)}`;
    }
    return `${candidate.currentRound}/${candidate.totalRounds}`;
  }

  getRoundLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'technical': 'Technical Round',
      'hr': 'HR Round',
      'managerial': 'Managerial Round',
      'final': 'Final Round'
    };
    return labels[type] || type;
  }

  getRoundIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'technical': 'code',
      'hr': 'people',
      'managerial': 'manage_accounts',
      'final': 'star'
    };
    return icons[type] || 'help';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'in-process': 'status-process',
      'selected': 'status-selected',
      'rejected': 'status-rejected',
      'on-hold': 'status-hold'
    };
    return classes[status] || '';
  }

  getRoundStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'round-pending',
      'scheduled': 'round-scheduled',
      'completed': 'round-completed',
      'cancelled': 'round-cancelled'
    };
    return classes[status] || '';
  }

  downloadOfferLetter(url: string) {
    window.open(url, '_blank');
  }

  resendOfferNotification(candidate: CandidateInterview) {
    this.snackBar.open(
      `Offer notification resent to ${candidate.candidateName}`,
      'Close',
      { duration: 3000 }
    );
  }

  // Filter methods for tabs
  getInProcessCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'in-process');
  }

  getSelectedCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'selected');
  }

  getRejectedCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'rejected');
  }

  getOnHoldCandidates(): CandidateInterview[] {
    return this.candidateInterviews.filter(c => c.overallStatus === 'on-hold');
  }

  // Template helper methods
  getRoundTypeLabel(type: string): string {
    return this.getRoundLabel(type);
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'in-process': 'schedule',
      'selected': 'check_circle',
      'rejected': 'cancel',
      'on-hold': 'pause_circle'
    };
    return icons[status] || 'help_outline';
  }

  getRoundStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': 'pending',
      'scheduled': 'event',
      'completed': 'check_circle',
      'cancelled': 'cancel'
    };
    return icons[status] || 'help_outline';
  }

  getResultIcon(result: string): string {
    const icons: { [key: string]: string } = {
      'pass': 'check_circle',
      'fail': 'cancel',
      'on-hold': 'schedule'
    };
    return icons[result] || 'help_outline';
  }

  viewRounds(candidate: CandidateInterview) {
    this.expandedCandidate = this.expandedCandidate === candidate ? null : candidate;
  }

  getLastCompletedRound(candidate: CandidateInterview): InterviewRound | undefined {
    return candidate.rounds.find(r => r.status === 'completed' && r.result === 'fail');
  }
}
