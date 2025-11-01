import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { QuestionCreateDialogComponent } from './question-create-dialog.component';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
}

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.scss'
})
export class QuestionBankComponent implements OnInit {
  questionForm: FormGroup;
  questions: Question[] = [];
  editingQuestion: Question | null = null;

  questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' },
    { value: 'matching', label: 'Matching' },
    { value: 'fill-blank', label: 'Fill in the Blank' }
  ];

  difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  categories = [
    'Mathematics',
    'Science',
    'History',
    'Literature',
    'Programming',
    'Business',
    'Art',
    'Geography',
    'Physics',
    'Chemistry'
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.questionForm = this.fb.group({
      type: ['multiple-choice', [Validators.required]],
      question: ['', [Validators.required, Validators.minLength(5)]],
      options: this.fb.array([]),
      correctAnswer: ['', [Validators.required]],
      explanation: [''],
      category: ['Mathematics', [Validators.required]],
      difficulty: ['medium', [Validators.required]],
      tags: this.fb.array([]),
      points: [1, [Validators.required, Validators.min(1)]],
      multipleCorrect: [false]
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.loadMockData();
  }

  loadMockData() {
    this.questions = [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
        explanation: 'Paris is the capital and most populous city of France.',
        category: 'Geography',
        difficulty: 'easy',
        tags: ['capital', 'Europe'],
        points: 1
      },
      {
        id: 2,
        type: 'true-false',
        question: 'The Earth is flat.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'The Earth is an oblate spheroid.',
        category: 'Science',
        difficulty: 'easy',
        tags: ['science', 'Earth'],
        points: 1
      },
      {
        id: 3,
        type: 'short-answer',
        question: 'What is 2 + 2?',
        correctAnswer: '4',
        explanation: 'Basic arithmetic.',
        category: 'Mathematics',
        difficulty: 'easy',
        tags: ['math', 'addition'],
        points: 1
      },
      {
        id: 4,
        type: 'essay',
        question: 'Describe the water cycle.',
        correctAnswer: 'The water cycle involves evaporation, condensation, precipitation, and collection.',
        explanation: 'A detailed explanation of the processes.',
        category: 'Science',
        difficulty: 'medium',
        tags: ['science', 'environment'],
        points: 5
      },
      {
        id: 5,
        type: 'matching',
        question: 'Match the countries with their capitals.',
        options: ['France - Paris', 'Germany - Berlin', 'Italy - Rome'],
        correctAnswer: 'France - Paris, Germany - Berlin, Italy - Rome',
        explanation: 'Correct matches.',
        category: 'Geography',
        difficulty: 'medium',
        tags: ['geography', 'capitals'],
        points: 3
      }
    ];
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get tags(): FormArray {
    return this.questionForm.get('tags') as FormArray;
  }

  initializeForm() {
    // Add default options for multiple choice
    this.options.clear();
    this.addOption();
    this.addOption();
    this.addOption();
    this.addOption();
  }

  addOption() {
    this.options.push(this.fb.group({
      option: ['', Validators.required]
    }));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  addTag(tag: string) {
    if (tag && !this.tags.value.includes(tag)) {
      this.tags.push(this.fb.control(tag));
    }
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  onQuestionTypeChange() {
    const type = this.questionForm.get('type')?.value;
    this.updateFormForQuestionType(type);
  }

  updateFormForQuestionType(type: string) {
    // Reset options and correct answer based on type
    this.options.clear();
    this.questionForm.patchValue({ correctAnswer: '', multipleCorrect: false });

    switch (type) {
      case 'multiple-choice':
        this.addOption();
        this.addOption();
        this.addOption();
        this.addOption();
        break;
      case 'true-false':
        this.options.push(this.fb.group({ option: 'True' }));
        this.options.push(this.fb.group({ option: 'False' }));
        break;
      case 'matching':
      case 'fill-blank':
        // No predefined options needed
        break;
      default:
        break;
    }
  }

  saveQuestion() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const question: Question = {
        id: this.editingQuestion ? this.editingQuestion.id : Date.now(),
        type: formValue.type,
        question: formValue.question,
        options: formValue.options.map((opt: any) => opt.option).filter((opt: string) => opt && opt.trim()),
        correctAnswer: formValue.correctAnswer,
        explanation: formValue.explanation,
        category: formValue.category,
        difficulty: formValue.difficulty,
        tags: formValue.tags,
        points: formValue.points
      };

      if (this.editingQuestion) {
        const index = this.questions.findIndex(q => q.id === this.editingQuestion!.id);
        this.questions[index] = question;
        this.editingQuestion = null;
      } else {
        this.questions.push(question);
      }

      this.resetForm();
    }
  }

  editQuestion(question: Question) {
    this.editingQuestion = question;
    this.questionForm.patchValue({
      type: question.type,
      question: question.question,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      category: question.category,
      difficulty: question.difficulty,
      points: question.points,
      multipleCorrect: Array.isArray(question.correctAnswer)
    });

    // Update options
    this.options.clear();
    if (question.options) {
      question.options.forEach(option => this.options.push(this.fb.group({ option: option })));
    }

    // Update tags
    this.tags.clear();
    question.tags.forEach(tag => this.tags.push(this.fb.control(tag)));
  }

  deleteQuestion(question: Question) {
    this.questions = this.questions.filter(q => q.id !== question.id);
  }

  resetForm() {
    this.questionForm.reset({
      type: 'multiple-choice',
      category: 'Mathematics',
      difficulty: 'medium',
      points: 1,
      multipleCorrect: false
    });
    this.options.clear();
    this.tags.clear();
    this.initializeForm();
    this.editingQuestion = null;
  }

  getQuestionTypeLabel(type: string): string {
    return this.questionTypes.find(t => t.value === type)?.label || type;
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'accent';
      case 'medium': return 'primary';
      case 'hard': return 'warn';
      default: return 'primary';
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(QuestionCreateDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questions.push(result);
      }
    });
  }

  openEditDialog(question: Question) {
    const dialogRef = this.dialog.open(QuestionCreateDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { question }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.questions.findIndex(q => q.id === result.id);
        if (index !== -1) {
          this.questions[index] = result;
        }
      }
    });
  }
}
