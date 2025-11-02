import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  points: number;
}

export interface GenerateQuestionsRequest {
  topic: string;
  numQuestions: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly API_URL = 'https://localhost:44353/api/Questions'; // Backend API URL

  constructor(private http: HttpClient) {}

  generateQuestions(request: GenerateQuestionsRequest): Promise<Question[]> {
    // For now, return mock data. Replace with actual API call when backend is ready
    return this.mockGenerateQuestions(request);
  }

  private mockGenerateQuestions(request: GenerateQuestionsRequest): Promise<Question[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions: Question[] = [];
        let questionId = 1;

        // Generate easy questions
        for (let i = 0; i < request.easyCount; i++) {
          questions.push(this.createMockQuestion(questionId++, 'easy', request.topic, request.category));
        }

        // Generate medium questions
        for (let i = 0; i < request.mediumCount; i++) {
          questions.push(this.createMockQuestion(questionId++, 'medium', request.topic, request.category));
        }

        // Generate hard questions
        for (let i = 0; i < request.hardCount; i++) {
          questions.push(this.createMockQuestion(questionId++, 'hard', request.topic, request.category));
        }

        resolve(questions);
      }, 1000); // Simulate API delay
    });
  }

  private createMockQuestion(id: number, difficulty: 'easy' | 'medium' | 'hard', topic: string, category: string): Question {
    const types: Question['type'][] = ['multiple-choice', 'true-false', 'short-answer'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    let question: Question;

    switch (randomType) {
      case 'multiple-choice':
        question = {
          id,
          type: 'multiple-choice',
          question: `What is an important aspect of ${topic} at ${difficulty} level?`,
          options: [
            'Option A',
            'Option B',
            'Option C',
            'Option D'
          ],
          correctAnswer: 'Option A',
          category,
          difficulty,
          tags: [topic.toLowerCase(), difficulty],
          points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
        };
        break;

      case 'true-false':
        question = {
          id,
          type: 'true-false',
          question: `Is ${topic} considered ${difficulty === 'easy' ? 'basic' : difficulty === 'medium' ? 'intermediate' : 'advanced'} knowledge?`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          category,
          difficulty,
          tags: [topic.toLowerCase(), difficulty],
          points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
        };
        break;

      case 'short-answer':
        question = {
          id,
          type: 'short-answer',
          question: `Briefly explain a key concept in ${topic} (${difficulty} level):`,
          correctAnswer: 'Sample answer',
          category,
          difficulty,
          tags: [topic.toLowerCase(), difficulty],
          points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
        };
        break;

      default:
        question = {
          id,
          type: 'multiple-choice',
          question: `Sample question about ${topic}`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          category,
          difficulty,
          tags: [topic.toLowerCase()],
          points: 1
        };
    }

    return question;
  }

  // Future API implementation
  // generateQuestions(request: GenerateQuestionsRequest): Observable<Question[]> {
  //   return this.http.post<Question[]>(`${this.API_URL}/generate`, request)
  //     .pipe(
  //       map(questions => questions),
  //       catchError(error => {
  //         console.error('Error generating questions:', error);
  //         return throwError(() => new Error('Failed to generate questions'));
  //       })
  //     );
  // }
}