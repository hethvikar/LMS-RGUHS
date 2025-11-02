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
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { QuestionCreateDialogComponent } from './question-create-dialog.component';
import { OptionsCellRendererComponent } from './options-cell-renderer.component';

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
    MatDialogModule,
    AgGridAngular,
    OptionsCellRendererComponent
  ],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.scss'
})
export class QuestionBankComponent implements OnInit {
  questionForm: FormGroup;
  questions: Question[] = [];
  editingQuestion: Question | null = null;

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

  // AG Grid properties
  gridApi!: GridApi;
  columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      minWidth: 55,
      maxWidth: 70,
      filter: 'agNumberColumnFilter',
      sortable: true,
      cellStyle: { textAlign: 'center', fontSize: '0.8rem' }
    },
    {
      field: 'question',
      headerName: 'Question',
      width: 280,
      minWidth: 250,
      filter: 'agTextColumnFilter',
      sortable: true,
      cellRenderer: (params: any) => {
        return `<div style="white-space: normal; line-height: 1.3; word-wrap: break-word; font-size: 0.8rem;">${params.value}</div>`;
      },
      autoHeight: true
    },
    {
      field: 'options',
      headerName: 'Options',
      width: 120,
      minWidth: 100,
      maxWidth: 140,
      filter: 'agTextColumnFilter',
      sortable: false,
      cellRenderer: OptionsCellRendererComponent
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 110,
      minWidth: 100,
      filter: 'agTextColumnFilter',
      sortable: true,
      valueFormatter: (params) => this.getQuestionTypeLabel(params.value),
      cellStyle: { textAlign: 'center', fontSize: '0.8rem' }
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 110,
      minWidth: 100,
      filter: 'agTextColumnFilter',
      sortable: true,
      cellStyle: { textAlign: 'center', fontSize: '0.8rem' }
    },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      width: 90,
      minWidth: 85,
      filter: 'agTextColumnFilter',
      sortable: true,
      cellRenderer: (params: any) => {
        const color = this.getDifficultyColor(params.value);
        return `<span class="difficulty-chip ${color}" style="font-size: 0.75rem;">${params.value}</span>`;
      },
      cellStyle: { textAlign: 'center' }
    },
    {
      field: 'points',
      headerName: 'Points',
      width: 70,
      minWidth: 60,
      maxWidth: 80,
      filter: 'agNumberColumnFilter',
      sortable: true,
      cellStyle: { textAlign: 'center', fontSize: '0.8rem' }
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 140,
      minWidth: 120,
      filter: 'agTextColumnFilter',
      sortable: false,
      cellRenderer: (params: any) => {
        if (params.value && params.value.length > 0) {
          return params.value.map((tag: string) => `<span class="tag-chip" style="font-size: 0.7rem;">${tag}</span>`).join('');
        }
        return '';
      }
    },
    {
      headerName: 'Actions',
      width: 130,
      minWidth: 120,
      maxWidth: 150,
      cellRenderer: (params: any) => {
        return `
          <div style="display: flex; justify-content: center; gap: 3px;">
            <button class="action-btn edit-btn" style="font-size: 0.75rem; padding: 4px 8px;" data-action="edit" data-id="${params.data.id}">Edit</button>
            <button class="action-btn delete-btn" style="font-size: 0.75rem; padding: 4px 8px;" data-action="delete" data-id="${params.data.id}">Delete</button>
          </div>
        `;
      },
      pinned: 'right',
      sortable: false,
      filter: false,
      cellStyle: { textAlign: 'center' }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    filter: true
  };

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 15,
    paginationPageSizeSelector: [10, 15, 20, 50, 100],
    rowHeight: 50,
    headerHeight: 42,
    suppressRowHoverHighlight: false,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    domLayout: 'autoHeight'
  };

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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(event: any) {
    if (event.event.target.classList.contains('action-btn')) {
      const action = event.event.target.getAttribute('data-action');
      const id = parseInt(event.event.target.getAttribute('data-id'));
      const question = this.questions.find(q => q.id === id);

      if (question) {
        if (action === 'edit') {
          this.openEditDialog(question);
        } else if (action === 'delete') {
          this.deleteQuestion(question);
        }
      }
    }
  }

  refreshGrid() {
    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.questions);
    }
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
      this.refreshGrid();
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
    this.refreshGrid();
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
        this.refreshGrid();
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
          this.refreshGrid();
        }
      }
    });
  }
}
