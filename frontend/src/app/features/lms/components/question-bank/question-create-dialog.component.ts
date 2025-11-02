import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuestionService, Question, GenerateQuestionsRequest } from '../../../../core/services/question.service';


// Question interface now imported from service

@Component({
  selector: 'app-question-create-dialog',
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
    MatDialogModule,
    MatProgressSpinnerModule,
    CdkTextareaAutosize
  ],
  templateUrl: './question-create-dialog.component.html',
  styleUrl: './question-create-dialog.component.scss'
})
export class QuestionCreateDialogComponent implements OnInit {
  questionForm: FormGroup;
  generateForm: FormGroup;
  generatedQuestions: Question[] = [];
  isGenerating = false;
  showGenerateForm = true;

  // Mock dropdown data
  questionTypes = [
    { value: 'mcq', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True / False' },
    { value: 'short_answer', label: 'Short Answer' },
  ];

  difficultyLevels = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  questions: Question[] = []; // store created questions
  selectedQuestions: Set<number> = new Set(); // track selected generated questions by index
  private nextQuestionId = 1; // track next unique question ID

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QuestionCreateDialogComponent>,
    private questionService: QuestionService
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['mcq', Validators.required],
      difficulty: ['medium', Validators.required],
      options: this.fb.array([]),
      correctAnswer: ['', Validators.required],
    });

    this.generateForm = this.fb.group({
      topic: ['Indian History', Validators.required],
      numQuestions: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      easyCount: [2, [Validators.required, Validators.min(0)]],
      mediumCount: [3, [Validators.required, Validators.min(0)]],
      hardCount: [5, [Validators.required, Validators.min(0)]],
      category: ['History', Validators.required],
    }, { validators: this.validateCounts });

    this.onQuestionTypeChange('mcq');
  }

  ngOnInit(): void {
    // Component initialization
  }

  private validateCounts(group: FormGroup): { [key: string]: any } | null {
    const easy = group.get('easyCount')?.value || 0;
    const medium = group.get('mediumCount')?.value || 0;
    const hard = group.get('hardCount')?.value || 0;
    const total = group.get('numQuestions')?.value || 0;

    if (easy + medium + hard !== total) {
      return { countMismatch: true };
    }
    return null;
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  onQuestionTypeChange(type: string) {
    this.options.clear();

    if (type === 'mcq') {
      // initialize with two default options
      this.addOption();
      this.addOption();
    } else if (type === 'true_false') {
      this.options.push(this.fb.control('True'));
      this.options.push(this.fb.control('False'));
    }
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  async generateQuestions() {
    if (this.generateForm.invalid) {
      return;
    }

    this.isGenerating = true;
    try {
      const request: GenerateQuestionsRequest = this.generateForm.value;
      this.generatedQuestions = await this.questionService.generateQuestions(request);
      this.selectedQuestions.clear(); // Clear previous selections
      this.showGenerateForm = false;
    } catch (error) {
      console.error('Error generating questions:', error);
      // Handle error - could show a snackbar or alert
    } finally {
      this.isGenerating = false;
    }
  }

  toggleQuestionSelection(index: number) {
    if (this.selectedQuestions.has(index)) {
      this.selectedQuestions.delete(index);
    } else {
      this.selectedQuestions.add(index);
    }
  }

  isQuestionSelected(index: number): boolean {
    return this.selectedQuestions.has(index);
  }

  selectAllQuestions() {
    this.generatedQuestions.forEach((_, index) => {
      this.selectedQuestions.add(index);
    });
  }

  deselectAllQuestions() {
    this.selectedQuestions.clear();
  }

  getSelectedQuestionsCount(): number {
    return this.selectedQuestions.size;
  }

  private getNextQuestionId(): number {
    return this.nextQuestionId++;
  }

  addGeneratedQuestions() {
    const selectedQuestionsToAdd = this.generatedQuestions
      .filter((_, index) => this.selectedQuestions.has(index))
      .map(question => ({
        ...question,
        id: this.getNextQuestionId() // Assign unique ID
      }));

    if (selectedQuestionsToAdd.length > 0) {
      this.questions.push(...selectedQuestionsToAdd);
      this.generatedQuestions = [];
      this.selectedQuestions.clear();
      this.showGenerateForm = true;
    }
  }

  regenerateQuestions() {
    if (this.generateForm.valid) {
      this.generateQuestions();
    }
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const question: Question = {
        id: this.getNextQuestionId(),
        type: this.mapQuestionType(this.questionForm.value.questionType),
        question: this.questionForm.value.questionText,
        options: this.questionForm.value.options,
        correctAnswer: this.questionForm.value.correctAnswer,
        category: 'Custom',
        difficulty: this.questionForm.value.difficulty,
        tags: [],
        points: 1
      };

      this.questions.push(question);
      console.log('Question Added:', question);
      this.questionForm.reset({
        questionType: 'mcq',
        difficulty: 'medium',
      });
      this.options.clear();
      this.onQuestionTypeChange('mcq');
    }
  }

  onSave() {
    if (this.questions.length > 0) {
      this.dialogRef.close(this.questions);
    } else {
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private mapQuestionType(type: string): Question['type'] {
    switch (type) {
      case 'mcq': return 'multiple-choice';
      case 'true_false': return 'true-false';
      case 'short_answer': return 'short-answer';
      default: return 'multiple-choice';
    }
  }
}