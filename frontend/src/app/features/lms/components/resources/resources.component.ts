import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'document' | 'video' | 'presentation' | 'code' | 'article' | 'ebook';
  category: string;
  courseName?: string;
  downloadUrl?: string;
  viewUrl?: string;
  fileSize?: string;
  uploadDate: Date;
  downloads: number;
  tags: string[];
}

@Component({
  selector: 'app-lms-resources',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatGridListModule,
    MatTabsModule
  ],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class LmsResourcesComponent implements OnInit {
  resources: Resource[] = [
    {
      id: 1,
      title: 'JavaScript Fundamentals Guide',
      description: 'Comprehensive guide covering JavaScript basics, ES6 features, and best practices.',
      type: 'document',
      category: 'programming',
      courseName: 'Advanced JavaScript Concepts',
      downloadUrl: 'js-fundamentals.pdf',
      fileSize: '2.5 MB',
      uploadDate: new Date('2024-01-15'),
      downloads: 245,
      tags: ['JavaScript', 'ES6', 'Fundamentals', 'Guide']
    },
    {
      id: 2,
      title: 'React Component Patterns',
      description: 'Video tutorial series on advanced React component patterns and hooks.',
      type: 'video',
      category: 'programming',
      courseName: 'Advanced JavaScript Concepts',
      viewUrl: 'react-patterns-video',
      uploadDate: new Date('2024-01-12'),
      downloads: 189,
      tags: ['React', 'Hooks', 'Patterns', 'Tutorial']
    },
    {
      id: 3,
      title: 'UI/UX Design Principles Presentation',
      description: 'Slide presentation covering fundamental UI/UX design principles.',
      type: 'presentation',
      category: 'design',
      courseName: 'UI/UX Design Principles',
      downloadUrl: 'ui-ux-principles.pptx',
      fileSize: '15.2 MB',
      uploadDate: new Date('2024-01-10'),
      downloads: 156,
      tags: ['UI/UX', 'Design', 'Principles', 'Presentation']
    },
    {
      id: 4,
      title: 'Algorithm Complexity Cheat Sheet',
      description: 'Quick reference guide for time and space complexity of common algorithms.',
      type: 'document',
      category: 'programming',
      courseName: 'Data Structures & Algorithms',
      downloadUrl: 'algorithm-complexity.pdf',
      fileSize: '1.1 MB',
      uploadDate: new Date('2024-01-08'),
      downloads: 312,
      tags: ['Algorithms', 'Complexity', 'Reference', 'Cheat Sheet']
    },
    {
      id: 5,
      title: 'Machine Learning Interview Questions',
      description: 'Comprehensive collection of ML interview questions with detailed answers.',
      type: 'article',
      category: 'data',
      courseName: 'Machine Learning Fundamentals',
      viewUrl: 'ml-interview-questions',
      uploadDate: new Date('2024-01-05'),
      downloads: 98,
      tags: ['Machine Learning', 'Interview', 'Questions', 'Data Science']
    },
    {
      id: 6,
      title: 'Business Communication Handbook',
      description: 'Complete handbook for effective business communication skills.',
      type: 'ebook',
      category: 'business',
      courseName: 'Business Communication Skills',
      downloadUrl: 'business-communication.epub',
      fileSize: '3.8 MB',
      uploadDate: new Date('2024-01-03'),
      downloads: 76,
      tags: ['Business', 'Communication', 'Handbook', 'Skills']
    }
  ];

  ngOnInit() {
    // Load resources from API
  }

  getResourceCount(type: string): number {
    return this.resources.filter(resource => resource.type === type).length;
  }

  getCategories(): string[] {
    return [...new Set(this.resources.map(resource => resource.category))];
  }

  getResourcesByCategory(category: string): Resource[] {
    return this.resources.filter(resource => resource.category === category);
  }

  getRecentResources(): Resource[] {
    return this.resources
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
      .slice(0, 10);
  }

  getTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'document': 'description',
      'video': 'videocam',
      'presentation': 'slideshow',
      'code': 'code',
      'article': 'article',
      'ebook': 'book'
    };
    return iconMap[type] || 'insert_drive_file';
  }

  getTypeIconClass(type: string): string {
    return type.toLowerCase();
  }

  getCategoryClass(category: string): string {
    return category.toLowerCase();
  }

  viewResource(resource: Resource) {
    console.log('View resource:', resource);
    // Open resource in viewer or new tab
  }

  downloadResource(resource: Resource) {
    console.log('Download resource:', resource);
    // Trigger download
  }

  shareResource(resource: Resource) {
    console.log('Share resource:', resource);
    // Open share dialog
  }

  uploadResource() {
    console.log('Upload new resource');
    // Open upload dialog
  }
}