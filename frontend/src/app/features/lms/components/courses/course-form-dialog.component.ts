import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  enrolledStudents: number;
  maxStudents: number;
  status: 'active' | 'upcoming' | 'completed';
  category: string;
  progress?: number;
  enrolledDate?: Date;
  completionDate?: Date;
  scheduledDate?: Date;
  scheduledTime?: string;
  videoFile?: File;
}

@Component({
  selector: 'app-course-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './course-form-dialog.component.html',
  styleUrl: './course-form-dialog.component.scss'
})
export class CourseFormDialogComponent {
  courseForm: FormGroup;
  selectedVideoFile: File | null = null;
  videoPreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseFormDialogComponent>
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      instructor: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      maxStudents: [50, [Validators.required, Validators.min(1)]],
      category: ['programming', [Validators.required]],
      status: ['upcoming', [Validators.required]],
      scheduledDate: [null],
      scheduledTime: ['']
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;

      // Save video file if selected
      let savedVideoUrl: string | undefined;
      if (this.selectedVideoFile) {
        savedVideoUrl = this.saveVideoFile(this.selectedVideoFile);
      }

      const newCourse: Course = {
        id: Date.now(), // Simple ID generation
        title: formValue.title,
        description: formValue.description,
        instructor: formValue.instructor,
        duration: formValue.duration,
        enrolledStudents: 0,
        maxStudents: formValue.maxStudents,
        status: formValue.status,
        category: formValue.category,
        scheduledDate: formValue.scheduledDate,
        scheduledTime: formValue.scheduledTime,
        videoFile: this.selectedVideoFile || undefined
      };

      this.dialogRef.close({ action: 'create', course: newCourse, videoUrl: savedVideoUrl });
    }
  }

  saveVideoFile(file: File): string {
    // In a real application, this would upload to a server
    // For this demo, we'll create a blob URL that persists
    const videoUrl = URL.createObjectURL(file);

    // Store in localStorage for persistence (simplified approach)
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      localStorage.setItem(`course_video_${Date.now()}`, base64Data);
    };
    reader.readAsDataURL(file);

    return videoUrl;
  }

  onVideoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.validateVideoFile(file)) {
      this.selectedVideoFile = file;
      // Create preview URL for the video
      if (this.videoPreviewUrl) {
        URL.revokeObjectURL(this.videoPreviewUrl);
      }
      this.videoPreviewUrl = URL.createObjectURL(file);
    }
  }

  validateVideoFile(file: File): boolean {
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      alert(`Video file size must be less than ${maxSizeInMB}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return false;
    }

    // Check if it's a video file
    const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
    if (!videoTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM, MKV)');
      return false;
    }

    return true;
  }

  removeVideo() {
    this.selectedVideoFile = null;
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}