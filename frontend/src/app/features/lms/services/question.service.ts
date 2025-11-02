import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../../../environments/environment';

export interface Question {
  id?: number;
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
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey =
    (environment as any)?.openAiApiKey ??
    (typeof process !== 'undefined' ? (process.env as any)['OPENAI_API_KEY'] : undefined) ??
    (globalThis as any)?.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('OpenAI API key not configured. Set it in environment.ts as openAiApiKey or in process/global env.');
      return;
    }

    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateQuestions(request: GenerateQuestionsRequest): Promise<Question[]> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please check your API key configuration.');
    }

    const prompt = this.buildPrompt(request);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a question generation assistant. Generate questions in the specified JSON format. Ensure questions are diverse, accurate, and educational.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsedQuestions = JSON.parse(content);
      return this.validateAndParseQuestions(parsedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  }

  private buildPrompt(request: GenerateQuestionsRequest): string {
    return `Generate ${request.numQuestions} questions about "${request.topic}" in Indian History.

Requirements:
- ${request.easyCount} easy questions
- ${request.mediumCount} medium questions
- ${request.hardCount} hard questions
- Category: ${request.category}

Each question must be in this exact JSON format:
{
  "type": "multiple-choice" | "true-false" | "short-answer" | "essay" | "matching" | "fill-blank",
  "question": "The question text",
  "options": ["option1", "option2", "option3", "option4"] // only for multiple-choice
  "correctAnswer": "correct option" | number | ["answer1", "answer2"] // string for mcq/true-false, number for matching, array for fill-blank
  "explanation": "Brief explanation of why this is correct",
  "category": "${request.category}",
  "difficulty": "easy" | "medium" | "hard",
  "tags": ["tag1", "tag2"],
  "points": 1-10 based on difficulty
}

Return as a JSON array of question objects.`;
  }

  private validateAndParseQuestions(data: any): Question[] {
    if (!Array.isArray(data)) {
      throw new Error('Response must be an array of questions');
    }

    return data.map((q, index) => {
      if (!q.type || !q.question || !q.category || !q.difficulty || !q.tags || typeof q.points !== 'number') {
        throw new Error(`Invalid question structure at index ${index}`);
      }

      // Ensure tags is an array
      if (!Array.isArray(q.tags)) {
        q.tags = [];
      }

      return {
        ...q,
        id: index + 1
      } as Question;
    });
  }
}