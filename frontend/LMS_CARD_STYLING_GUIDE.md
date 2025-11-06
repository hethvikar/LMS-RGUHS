# LMS Module - Mat-Card Styling Guide

## Overview
This document provides a comprehensive guide to using the enhanced mat-card styles available in the LMS module.

## Implementation Date
November 6, 2025

## Location
`src/app/features/lms/styles/_lms-cards.scss`

## Imported In
`src/styles.scss` (globally available across the application)

---

## Available Card Styles

### 1. Gradient Backgrounds

#### Usage
Add these classes to your `<mat-card>` element:

```html
<mat-card class="gradient-purple">
  <!-- Content -->
</mat-card>
```

#### Available Gradients
- **`gradient-purple`** - Purple to violet gradient (#667eea → #764ba2)
- **`gradient-blue`** - Light blue to cyan gradient (#4facfe → #00f2fe)
- **`gradient-green`** - Green to teal gradient (#43e97b → #38f9d7)
- **`gradient-orange`** - Pink to coral gradient (#f093fb → #f5576c)
- **`gradient-sunset`** - Pink to yellow gradient (#fa709a → #fee140)
- **`gradient-ocean`** - Deep blue to light blue (#2193b0 → #6dd5ed)

**Note:** All text and icons automatically become white on gradient backgrounds.

---

### 2. Soft/Subtle Backgrounds

#### Usage
```html
<mat-card class="bg-soft-purple">
  <!-- Content -->
</mat-card>
```

#### Available Soft Backgrounds
- **`bg-soft-purple`** - Light purple background with purple left border
- **`bg-soft-blue`** - Light blue background with blue left border
- **`bg-soft-green`** - Light green background with green left border
- **`bg-soft-orange`** - Light orange background with orange left border
- **`bg-soft-red`** - Light red background with red left border
- **`bg-soft-teal`** - Light teal background with teal left border

---

### 3. Pattern Backgrounds

#### Usage
```html
<mat-card class="bg-pattern-dots">
  <!-- Content -->
</mat-card>
```

#### Available Patterns
- **`bg-pattern-dots`** - Dotted pattern overlay
- **`bg-pattern-grid`** - Grid pattern overlay

---

### 4. Special Effects

#### Glass Morphism
```html
<mat-card class="glass-effect">
  <!-- Content with blur effect -->
</mat-card>
```

#### Elevated Card
```html
<mat-card class="elevated">
  <!-- Card with enhanced shadow -->
</mat-card>
```

#### Glow Effect
```html
<mat-card class="glow">
  <!-- Card with glow on hover -->
</mat-card>
```

#### Interactive Card
```html
<mat-card class="interactive">
  <!-- Clickable card with hover effect -->
</mat-card>
```

---

### 5. Specialized Card Types

#### Stats Card
Perfect for dashboard statistics:
```html
<mat-card class="stat-card gradient-blue">
  <mat-icon>assignment</mat-icon>
  <h3>125</h3>
  <p>Total Courses</p>
</mat-card>
```

#### Course Card
For displaying course information:
```html
<mat-card class="course-card">
  <img src="course-image.jpg" class="course-image" />
  <span class="course-badge">NEW</span>
  <mat-card-content>
    <!-- Course details -->
  </mat-card-content>
</mat-card>
```

#### Assignment Card with Priority
```html
<mat-card class="assignment-card priority-high">
  <!-- High priority assignment -->
</mat-card>

<mat-card class="assignment-card priority-medium">
  <!-- Medium priority assignment -->
</mat-card>

<mat-card class="assignment-card priority-low">
  <!-- Low priority assignment -->
</mat-card>
```

#### Progress Card
For showing completion progress:
```html
<mat-card class="progress-card">
  <div class="progress-circle">75%</div>
  <p>Course Completion</p>
</mat-card>
```

---

### 6. Header Styles

#### Icon Header
```html
<mat-card class="icon-header">
  <mat-card-header>
    <mat-card-title>
      <mat-icon>school</mat-icon>
      Course Title
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <!-- Content -->
  </mat-card-content>
</mat-card>
```

---

### 7. Border & Shadow Variants

#### Bordered Card
```html
<mat-card class="bordered">
  <!-- Card with colored border -->
</mat-card>
```

#### Shadow Sizes
```html
<mat-card class="shadow-sm">   <!-- Small shadow -->
<mat-card class="shadow-md">   <!-- Medium shadow (default) -->
<mat-card class="shadow-lg">   <!-- Large shadow -->
<mat-card class="shadow-xl">   <!-- Extra large shadow -->
```

---

### 8. Spacing Variants

#### Compact Padding
```html
<mat-card class="compact">
  <!-- Less padding -->
</mat-card>
```

#### Spacious Padding
```html
<mat-card class="spacious">
  <!-- More padding -->
</mat-card>
```

---

### 9. Decorative Elements

#### Ribbon Badge
```html
<mat-card class="ribbon">
  <!-- Card with "NEW" ribbon in corner -->
</mat-card>
```

---

### 10. Animations

#### Fade In Animation
```html
<mat-card class="animate-in">
  <!-- Card fades in on load -->
</mat-card>
```

**Note:** Multiple cards with `animate-in` will stagger their animations automatically.

---

## Combining Classes

You can combine multiple classes for enhanced effects:

```html
<!-- Gradient background with glow effect -->
<mat-card class="gradient-purple glow elevated">
  <mat-card-content>
    <!-- Content -->
  </mat-card-content>
</mat-card>

<!-- Soft background with animation -->
<mat-card class="bg-soft-blue animate-in shadow-lg">
  <mat-card-content>
    <!-- Content -->
  </mat-card-content>
</mat-card>

<!-- Interactive stat card -->
<mat-card class="stat-card gradient-green interactive">
  <mat-icon>trending_up</mat-icon>
  <h3>95%</h3>
  <p>Success Rate</p>
</mat-card>
```

---

## Examples by Use Case

### Dashboard Stats
```html
<div class="stats-grid">
  <mat-card class="stat-card gradient-purple animate-in">
    <mat-icon>school</mat-icon>
    <h3>24</h3>
    <p>Active Courses</p>
  </mat-card>

  <mat-card class="stat-card gradient-blue animate-in">
    <mat-icon>assignment</mat-icon>
    <h3>156</h3>
    <p>Assignments</p>
  </mat-card>

  <mat-card class="stat-card gradient-green animate-in">
    <mat-icon>people</mat-icon>
    <h3>1,234</h3>
    <p>Students</p>
  </mat-card>

  <mat-card class="stat-card gradient-orange animate-in">
    <mat-icon>trending_up</mat-icon>
    <h3>89%</h3>
    <p>Completion Rate</p>
  </mat-card>
</div>
```

### Course Listing
```html
<mat-card class="course-card elevated interactive animate-in">
  <img src="angular-course.jpg" class="course-image" />
  <span class="course-badge">POPULAR</span>
  <mat-card-content>
    <h3>Advanced Angular Development</h3>
    <p>Master Angular framework with real-world projects</p>
  </mat-card-content>
</mat-card>
```

### Assignment List
```html
<mat-card class="assignment-card priority-high shadow-md">
  <mat-card-content>
    <h4>Complete Project Documentation</h4>
    <p>Due: Tomorrow</p>
  </mat-card-content>
</mat-card>

<mat-card class="assignment-card priority-medium shadow-md">
  <mat-card-content>
    <h4>Code Review Assignment</h4>
    <p>Due: Next Week</p>
  </mat-card-content>
</mat-card>
```

### Information Cards
```html
<mat-card class="bg-soft-blue icon-header">
  <mat-card-header>
    <mat-card-title>
      <mat-icon>info</mat-icon>
      Important Notice
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p>System maintenance scheduled for this weekend.</p>
  </mat-card-content>
</mat-card>
```

---

## Best Practices

1. **Consistency**: Use similar card styles for similar types of content
2. **Readability**: Avoid using too many gradient backgrounds in one view
3. **Performance**: Use animations sparingly on pages with many cards
4. **Accessibility**: Ensure text contrast meets WCAG standards
5. **Mobile**: Test responsive behavior, especially with elevated and glow effects

---

## Customization

To add your own custom card styles, edit:
```
src/app/features/lms/styles/_lms-cards.scss
```

Follow the existing pattern and naming conventions.

---

## Browser Support

All card styles support modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Glass morphism effects may have limited support in older browsers.

---

## Responsive Behavior

All card styles are mobile-responsive and will:
- Adjust padding on smaller screens
- Scale down icon and text sizes
- Maintain visual hierarchy
- Stack properly in flex/grid layouts

---

## Troubleshooting

### Cards not showing styles
1. Verify `_lms-cards.scss` is imported in `styles.scss`
2. Check that class names are spelled correctly
3. Ensure no conflicting styles in component-level SCSS

### Hover effects not working
1. Confirm card has proper cursor style (use `interactive` class)
2. Check if parent container has pointer-events disabled

### Animations not playing
1. Verify `animate-in` class is applied
2. Check if animations are disabled in browser settings
3. Ensure page is fully loaded before cards render

---

## Future Enhancements

Planned additions:
- Dark mode variants
- More gradient options
- Custom color theming system
- Advanced animation sequences
- Print-friendly styles

---

## Support

For issues or suggestions related to card styling, please contact the development team or create an issue in the project repository.
