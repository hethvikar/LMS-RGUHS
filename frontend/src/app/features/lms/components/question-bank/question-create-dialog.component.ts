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
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer?: string | number | string[];
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
}

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
    CdkTextareaAutosize
  ],
  templateUrl: './question-create-dialog.component.html',
  styleUrl: './question-create-dialog.component.scss'
})
export class QuestionCreateDialogComponent {
  questionForm: FormGroup;

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

  questions: any[] = []; // store created questions

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<QuestionCreateDialogComponent>) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['mcq', Validators.required],
      difficulty: ['medium', Validators.required],
      options: this.fb.array([]),
      correctAnswer: ['', Validators.required],
    });

    this.onQuestionTypeChange('mcq');
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

  onSubmit() {
    if (this.questionForm.valid) {
      this.questions.push(this.questionForm.value);
      console.log('Question Added:', this.questionForm.value);
      this.questionForm.reset({
        questionType: 'mcq',
        difficulty: 'medium',
      });
      this.options.clear();
      this.onQuestionTypeChange('mcq');
    }
  }

  onSave() {
    if (this.questionForm.valid) {
      this.questions.push(this.questionForm.value);
      console.log('Question Saved:', this.questionForm.value);
      this.dialogRef.close(this.questionForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}