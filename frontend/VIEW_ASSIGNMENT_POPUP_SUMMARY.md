# View Assignment Popup Implementation Summary

## Overview
Added a "View Assignment" popup component to the admin/assessment-assignment module that displays detailed information about an assignment when the user clicks the "View Details" button in the assignments table.

## Files Created

### 1. view-assignment-popup.component.ts
- **Location**: `src/app/features/admin/components/assessment-assignment/view-assignment-popup/`
- **Features**:
  - Displays comprehensive assignment details
  - Shows student information, assessment info, timeline, attempts, and scores
  - Dynamic status display with color-coded chips
  - Grade visualization with color-coded score display
  - Calculates and displays time remaining until due date
  - Responsive design for mobile devices

### 2. view-assignment-popup.component.html
- **Layout Sections**:
  - **Header**: Assignment title with close button
  - **Student Information**: Student name and course
  - **Assessment Information**: Assessment title, max score, and status
  - **Timeline**: Assigned date, due date, submitted date, graded date, and time remaining
  - **Attempts**: Shows attempts used vs. max attempts
  - **Score Display** (if graded): Large visual score display with percentage and color-coded grades
  - **Footer**: Close button

### 3. view-assignment-popup.component.scss
- **Styling Features**:
  - Modern card-based design with gradient header
  - Color-coded status chips (assigned, in-progress, submitted, graded, overdue)
  - Grade-based color coding:
    - Excellent (≥90%): Green gradient
    - Good (≥75%): Blue gradient
    - Average (≥60%): Orange gradient
    - Poor (<60%): Red gradient
  - Responsive layout for mobile devices
  - Smooth animations and hover effects

## Changes to Existing Files

### assessment-assignment.component.ts
**Imports Added**:
```typescript
import { ViewAssignmentPopupComponent } from './view-assignment-popup/view-assignment-popup.component';
```

**Properties Added**:
```typescript
openViewAssignmentPopup = false;
selectedAssignment: AssessmentAssignment | null = null;
```

**Methods Updated**:
```typescript
viewAssignment(assignment: AssessmentAssignment) {
  this.selectedAssignment = assignment;
  this.openViewAssignmentPopup = true;
}

closeViewAssignmentPopup() {
  this.openViewAssignmentPopup = false;
  this.selectedAssignment = null;
}
```

**Component Imports Array**:
- Added `ViewAssignmentPopupComponent` to the imports array

### assessment-assignment.component.html
**Popup Added**:
```html
<!-- View Assignment Popup -->
<div *ngIf="openViewAssignmentPopup" class="popup-overlay" (click)="closeViewAssignmentPopup()">
  <div class="popup-container" (click)="$event.stopPropagation()">
    <app-view-assignment-popup
      [assignment]="selectedAssignment"
      (close)="closeViewAssignmentPopup()">
    </app-view-assignment-popup>
  </div>
</div>
```

## How It Works

1. **User clicks "View Details" button** in the assignments table (eye icon)
2. **viewAssignment() method** is triggered with the selected assignment
3. **selectedAssignment** is set to the clicked assignment
4. **openViewAssignmentPopup** flag is set to true, displaying the popup overlay
5. **View Assignment Popup** component receives the assignment data and displays all details
6. **User clicks Close or outside the popup** to dismiss it
7. **closeViewAssignmentPopup()** method resets the state

## Features Displayed in Popup

### Student Information
- Student name
- Course name

### Assessment Information
- Assessment title
- Maximum score
- Current status (with color-coded chip)

### Timeline
- Assigned date
- Due date
- Submitted date (if submitted)
- Graded date (if graded)
- Time remaining calculation

### Attempts Tracking
- Number of attempts used
- Maximum attempts allowed
- Remaining attempts

### Score Display (when graded)
- Large, prominent score display
- Percentage calculation
- Color-coded based on performance:
  - 90%+ = Green (Excellent)
  - 75-89% = Blue (Good)
  - 60-74% = Orange (Average)
  - <60% = Red (Poor)

## Button Location
The "View Details" button (eye icon) is located in the "Actions" column of the assignments table, next to other action buttons like Edit, Grade, Extend Deadline, and Remove.

## Styling Notes
- Follows the existing design pattern of the assign-assignment-popup
- Uses Material Design components for consistency
- Responsive design adapts to mobile screens
- Modern gradient backgrounds and smooth animations
- Accessible with proper ARIA labels and keyboard navigation

## Testing
To test the popup:
1. Navigate to the Assessment Assignment page
2. Find any assignment in the table
3. Click the eye icon (🔍) in the Actions column
4. The popup will open displaying all assignment details
5. Click "Close" button or click outside the popup to dismiss it
