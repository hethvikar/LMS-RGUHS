import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface ResourceUploadData {
  title: string;
  description: string;
  type: 'document' | 'video' | 'presentation' | 'code' | 'article' | 'ebook';
  category: string;
  courseName?: string;
  tags: string[];
  file?: File;
}

@Component({
  selector: 'app-resource-upload-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="upload-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>cloud_upload</mat-icon>
          Upload New Resource
        </h2>
        <button mat-icon-button (click)="closeDialog()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="uploadForm" class="upload-form">
          <!-- File Upload Section -->
          <div class="file-upload-section">
            <div class="file-drop-zone" 
                 [class.dragover]="isDragOver"
                 (dragover)="onDragOver($event)"
                 (dragleave)="onDragLeave($event)"
                 (drop)="onFileDrop($event)"
                 (click)="fileInput.click()">
              <div class="drop-zone-content" *ngIf="!selectedFile">
                <mat-icon class="upload-icon">cloud_upload</mat-icon>
                <h3>Drag and drop your file here</h3>
                <p>or click to browse files</p>
                <small>Supported formats: PDF, DOC, PPT, MP4, ZIP (Max: 100MB)</small>
              </div>
              <div class="selected-file-info" *ngIf="selectedFile">
                <mat-icon class="file-icon">{{ getFileIcon(selectedFile.type) }}</mat-icon>
                <div class="file-details">
                  <h4>{{ selectedFile.name }}</h4>
                  <p>{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <button mat-icon-button type="button" (click)="removeFile($event)" class="remove-file-btn">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
            <input #fileInput type="file" style="display: none" (change)="onFileSelected($event)" 
                   accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.zip,.rar">
          </div>

          <!-- Upload Progress -->
          <div class="upload-progress" *ngIf="isUploading">
            <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
            <p>Uploading... {{ uploadProgress }}%</p>
          </div>

          <!-- Form Fields -->
          <div class="form-fields">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Resource Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter resource title">
              <mat-error *ngIf="uploadForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" 
                        placeholder="Describe what this resource contains"></textarea>
              <mat-error *ngIf="uploadForm.get('description')?.hasError('required')">
                Description is required
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Resource Type</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="document">Document</mat-option>
                  <mat-option value="video">Video</mat-option>
                  <mat-option value="presentation">Presentation</mat-option>
                  <mat-option value="code">Code</mat-option>
                  <mat-option value="article">Article</mat-option>
                  <mat-option value="ebook">E-book</mat-option>
                </mat-select>
                <mat-error *ngIf="uploadForm.get('type')?.hasError('required')">
                  Resource type is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="programming">Programming</mat-option>
                  <mat-option value="design">Design</mat-option>
                  <mat-option value="data">Data Science</mat-option>
                  <mat-option value="business">Business</mat-option>
                  <mat-option value="marketing">Marketing</mat-option>
                  <mat-option value="general">General</mat-option>
                </mat-select>
                <mat-error *ngIf="uploadForm.get('category')?.hasError('required')">
                  Category is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Course Name (Optional)</mat-label>
              <input matInput formControlName="courseName" placeholder="Associate with a course">
            </mat-form-field>

            <!-- Tags Input -->
            <div class="tags-section">
              <mat-form-field appearance="outline" class="tag-input">
                <mat-label>Tags</mat-label>
                <input matInput #tagInput (keyup.enter)="addTag(tagInput.value); tagInput.value=''"
                       placeholder="Add tags (press Enter)">
              </mat-form-field>
              <div class="tags-container" *ngIf="tags.length > 0">
                <mat-chip-set>
                  <mat-chip *ngFor="let tag of tags" (removed)="removeTag(tag)" removable>
                    {{ tag }}
                    <mat-icon matChipRemove>cancel</mat-icon>
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="closeDialog()" [disabled]="isUploading">
          Cancel
        </button>
        <button mat-raised-button color="primary" (click)="uploadResource()" 
                [disabled]="!uploadForm.valid || !selectedFile || isUploading">
          <mat-icon>cloud_upload</mat-icon>
          {{ isUploading ? 'Uploading...' : 'Upload Resource' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .upload-dialog {
      width: 600px;
      max-width: 90vw;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px 16px 0;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1976d2;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      .close-btn {
        color: #666;
      }
    }

    .dialog-content {
      padding: 24px 0;
      max-height: 70vh;
      overflow-y: auto;
    }

    .file-upload-section {
      margin-bottom: 24px;
    }

    .file-drop-zone {
      border: 2px dashed #ccc;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fafafa;

      &:hover, &.dragover {
        border-color: #1976d2;
        background: rgba(25, 118, 210, 0.05);
      }
    }

    .drop-zone-content {
      .upload-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #1976d2;
        margin-bottom: 16px;
      }

      h3 {
        margin: 0 0 8px 0;
        color: #333;
        font-weight: 500;
      }

      p {
        margin: 0 0 16px 0;
        color: #666;
      }

      small {
        color: #999;
        font-size: 0.85rem;
      }
    }

    .selected-file-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;

      .file-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #1976d2;
      }

      .file-details {
        flex: 1;
        
        h4 {
          margin: 0 0 4px 0;
          font-weight: 500;
          color: #333;
        }

        p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
      }

      .remove-file-btn {
        color: #f44336;
      }
    }

    .upload-progress {
      margin-bottom: 24px;
      
      p {
        text-align: center;
        margin-top: 8px;
        color: #1976d2;
        font-weight: 500;
      }
    }

    .form-fields {
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }
    }

    .tags-section {
      margin-bottom: 16px;

      .tag-input {
        width: 100%;
        margin-bottom: 12px;
      }

      .tags-container {
        mat-chip-set {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;

      button {
        min-width: 120px;

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    @media (max-width: 768px) {
      .upload-dialog {
        width: 100%;
        height: 100%;
        max-width: none;
      }

      .form-row {
        grid-template-columns: 1fr !important;
      }

      .file-drop-zone {
        padding: 24px 16px;
      }
    }
  `]
})
export class ResourceUploadDialogComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResourceUploadDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['document', Validators.required],
      category: ['programming', Validators.required],
      courseName: ['']
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  private handleFileSelection(file: File) {
    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      this.snackBar.open('File size must be less than 100MB', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    this.selectedFile = file;
    
    // Auto-populate title from filename
    if (!this.uploadForm.get('title')?.value) {
      const fileName = file.name.split('.')[0];
      this.uploadForm.patchValue({ title: fileName });
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
  }

  addTag(tagValue: string) {
    const tag = tagValue.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'picture_as_pdf';
    if (mimeType.includes('video')) return 'video_file';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'slideshow';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'description';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
    return 'attach_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async uploadResource() {
    if (!this.uploadForm.valid || !this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      this.uploadProgress += Math.random() * 30;
      if (this.uploadProgress >= 95) {
        this.uploadProgress = 95;
      }
    }, 200);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      this.uploadProgress = 100;

      // Prepare upload data
      const uploadData: ResourceUploadData = {
        ...this.uploadForm.value,
        tags: this.tags,
        file: this.selectedFile
      };

      // Close dialog with success result
      this.snackBar.open('Resource uploaded successfully!', 'Close', {
        duration: 3000,
        panelClass: 'success-snackbar'
      });

      this.dialogRef.close(uploadData);
    } catch (error) {
      clearInterval(progressInterval);
      this.isUploading = false;
      this.uploadProgress = 0;
      
      this.snackBar.open('Upload failed. Please try again.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}