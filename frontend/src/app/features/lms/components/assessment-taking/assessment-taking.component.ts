import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface Question {
  id: number;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: any;
  points: number;
  explanation?: string;
}

interface Assessment {
  id: number;
  title: string;
  courseName: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  questions: Question[];
  instructions: string;
}

interface StudentAnswer {
  questionId: number;
  answer: any;
  isCorrect?: boolean;
  points?: number;
}

@Component({
  selector: 'app-assessment-taking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './assessment-taking.component.html',
  styleUrls: ['./assessment-taking.component.scss']
})
export class AssessmentTakingComponent implements OnInit, OnDestroy {
  assessment: Assessment = {
    id: 1,
    title: 'JavaScript Fundamentals Quiz',
    courseName: 'Advanced JavaScript Concepts',
    duration: 60, // 60 minutes
    totalQuestions: 5,
    totalPoints: 100,
    passingScore: 70,
    instructions: 'Answer all questions to the best of your ability. You have 60 minutes to complete this assessment.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
        correctAnswer: 0,
        points: 20,
        explanation: 'The var keyword is used to declare variables in JavaScript.'
      },
      {
        id: 2,
        type: 'multiple-select',
        question: 'Which of the following are JavaScript data types? (Select all that apply)',
        options: ['String', 'Number', 'Boolean', 'Character', 'Object'],
        correctAnswer: [true, true, true, false, true],
        points: 20,
        explanation: 'JavaScript has String, Number, Boolean, and Object as primitive/complex data types.'
      },
      {
        id: 3,
        type: 'true-false',
        question: 'JavaScript is a case-sensitive language.',
        correctAnswer: true,
        points: 15,
        explanation: 'JavaScript is case-sensitive, meaning "myVar" and "myvar" are different variables.'
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'What does the "===" operator do in JavaScript?',
        correctAnswer: 'strict equality comparison',
        points: 20,
        explanation: 'The === operator performs strict equality comparison, checking both value and type.'
      },
      {
        id: 5,
        type: 'essay',
        question: 'Explain the difference between let, const, and var in JavaScript.',
        correctAnswer: 'Let and const are block-scoped, var is function-scoped. Const cannot be reassigned.',
        points: 25,
        explanation: 'let and const are block-scoped and were introduced in ES6. var is function-scoped. const variables cannot be reassigned after declaration.'
      }
    ]
  };

  currentQuestionIndex = 0;
  answers: StudentAnswer[] = [];
  timeRemaining = 60 * 60; // 60 minutes in seconds
  timer: any;
  isSubmitted = false;
  showConfirmation = false;

  results: any = null;

  ngOnInit() {
    this.initializeAnswers();
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get currentQuestion(): Question {
    return this.assessment.questions[this.currentQuestionIndex];
  }

  get currentAnswer(): any {
    const answer = this.answers.find(a => a.questionId === this.currentQuestion.id);
    return answer ? answer.answer : null;
  }

  set currentAnswer(value: any) {
    let answer = this.answers.find(a => a.questionId === this.currentQuestion.id);
    if (!answer) {
      answer = { questionId: this.currentQuestion.id, answer: value };
      this.answers.push(answer);
    } else {
      answer.answer = value;
    }
  }

  initializeAnswers() {
    this.answers = this.assessment.questions.map(question => ({
      questionId: question.id,
      answer: null
    }));
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.autoSubmit();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  getProgressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.assessment.totalQuestions) * 100;
  }

  getAnsweredQuestionsCount(): number {
    return this.answers.filter(answer => answer.answer !== null && answer.answer !== '').length;
  }

  getQuestionTypeText(type: string): string {
    const typeMap: { [key: string]: string } = {
      'multiple-choice': 'Multiple Choice',
      'multiple-select': 'Multiple Select',
      'true-false': 'True/False',
      'short-answer': 'Short Answer',
      'essay': 'Essay'
    };
    return typeMap[type] || type;
  }

  getQuestionButtonClass(index: number): string {
    if (index === this.currentQuestionIndex) {
      return 'current';
    }
    if (this.isAnswered(index)) {
      return 'answered';
    }
    return '';
  }

  isAnswered(questionIndex: number): boolean {
    const question = this.assessment.questions[questionIndex];
    const answer = this.answers.find(a => a.questionId === question.id);
    return !!(answer && answer.answer !== null && answer.answer !== '');
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.assessment.totalQuestions - 1) {
      this.currentQuestionIndex++;
    }
  }

  saveAnswer() {
    // Answer is automatically saved when changed
    console.log('Answer saved for question:', this.currentQuestion.id);
  }

  clearAnswer() {
    const answer = this.answers.find(a => a.questionId === this.currentQuestion.id);
    if (answer) {
      answer.answer = null;
    }
  }

  canSubmit(): boolean {
    return this.getAnsweredQuestionsCount() > 0;
  }

  submitAssessment() {
    this.showConfirmation = true;
  }

  cancelSubmit() {
    this.showConfirmation = false;
  }

  confirmSubmit() {
    this.showConfirmation = false;
    this.processSubmission();
  }

  autoSubmit() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.processSubmission();
  }

  processSubmission() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Calculate results
    let totalScore = 0;
    let correctAnswers = 0;
    const questionReviews: any[] = [];

    this.assessment.questions.forEach((question, index) => {
      const studentAnswer = this.answers.find(a => a.questionId === question.id);
      let isCorrect = false;
      let points = 0;

      if (studentAnswer && studentAnswer.answer !== null) {
        // Simple grading logic (in real app, this would be more sophisticated)
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          isCorrect = studentAnswer.answer === question.correctAnswer;
        } else if (question.type === 'multiple-select') {
          isCorrect = JSON.stringify(studentAnswer.answer) === JSON.stringify(question.correctAnswer);
        } else {
          // For short answer and essay, assume correct for demo
          isCorrect = true;
        }

        if (isCorrect) {
          points = question.points;
          correctAnswers++;
        }
      }

      totalScore += points;

      questionReviews.push({
        question: question.question,
        yourAnswer: this.formatAnswer(studentAnswer?.answer),
        correctAnswer: this.formatAnswer(question.correctAnswer),
        isCorrect,
        explanation: question.explanation
      });
    });

    this.results = {
      score: totalScore,
      correctAnswers,
      totalQuestions: this.assessment.totalQuestions,
      timeTaken: this.assessment.duration * 60 - this.timeRemaining,
      submittedAt: new Date(),
      questionReviews
    };

    this.isSubmitted = true;
    console.log('Assessment submitted with results:', this.results);
  }

  formatAnswer(answer: any): string {
    if (answer === null || answer === undefined) return 'Not answered';

    if (typeof answer === 'boolean') return answer ? 'True' : 'False';

    if (Array.isArray(answer)) {
      return answer.map((item, index) => item ? this.currentQuestion.options?.[index] : null)
                   .filter(item => item !== null)
                   .join(', ') || 'None selected';
    }

    if (typeof answer === 'number' && this.currentQuestion.options) {
      return this.currentQuestion.options[answer] || answer.toString();
    }

    return answer.toString();
  }

  getScorePercentage(score: number, total: number): number {
    return Math.round((score / total) * 100);
  }

  getScoreClass(score: number, passingScore: number): string {
    return score >= passingScore ? 'passed' : 'failed';
  }

  getLetterGrade(score: number, total: number): string {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  canRetake(): boolean {
    // In real app, check if attempts remaining
    return true;
  }

  retakeAssessment() {
    // Reset assessment state
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.timeRemaining = this.assessment.duration * 60;
    this.isSubmitted = false;
    this.showConfirmation = false;
    this.results = null;
    this.initializeAnswers();
    this.startTimer();
  }

  saveProgress() {
    console.log('Progress saved');
    // Save current answers to local storage or server
  }

  viewCourse() {
    console.log('Navigate to course');
    // Navigate back to course page
  }
}