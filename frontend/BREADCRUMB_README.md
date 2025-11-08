# Dynamic Breadcrumb System

This dynamic breadcrumb system provides automatic breadcrumb navigation for all components in the application.

## Features

- **Automatic Generation**: Breadcrumbs are automatically generated based on the current route
- **Route Data Integration**: Uses route configuration data for better labels and icons
- **Material Design**: Built with Angular Material components and follows Material Design guidelines
- **Responsive**: Adapts to different screen sizes with mobile-friendly design
- **Accessible**: Includes proper ARIA labels and keyboard navigation support
- **Customizable**: Route labels and icons can be customized through route data or service methods

## How It Works

### 1. Breadcrumb Service (`BreadcrumbService`)

The service automatically listens to router navigation events and builds breadcrumbs based on:
- Current URL segments
- Route configuration data (`data.breadcrumb` and `data.icon`)
- Predefined route label mappings
- Automatic formatting of route segments

### 2. Breadcrumb Component (`BreadcrumbComponent`)

A standalone Angular Material component that displays the breadcrumb navigation with:
- Clickable breadcrumb links (except for the current page)
- Material icons for each breadcrumb item
- Responsive design with mobile adaptations
- Smooth animations

### 3. Integration

The breadcrumb component is integrated into the main header component and displays automatically for all authenticated pages.

## Usage

### Basic Usage (Automatic)

The breadcrumb system works automatically without any additional configuration. It will:
1. Parse the current URL
2. Generate breadcrumb labels from route segments
3. Display breadcrumbs in the header

Example: `/lms/courses` → Home > Learning Management System > Courses

### Enhanced Usage with Route Data

Add breadcrumb data to your route configurations for better labels and icons:

```typescript
{
  path: 'courses',
  loadComponent: () => import('./courses/courses.component').then(m => m.CoursesComponent),
  data: { 
    breadcrumb: 'Course Catalog', 
    icon: 'library_books' 
  }
}
```

### Programmatic Control

You can also control breadcrumbs programmatically:

```typescript
import { BreadcrumbService } from '../core/services/breadcrumb.service';

constructor(private breadcrumbService: BreadcrumbService) {}

// Set custom breadcrumbs
setBreadcrumbs() {
  this.breadcrumbService.setBreadcrumbs([
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Custom Page', url: '/custom', icon: 'star' },
    { label: 'Current Page', url: '', icon: 'location_on' }
  ]);
}

// Add route label mapping
addCustomRoute() {
  this.breadcrumbService.addRouteLabel('custom-route', 'Custom Route', 'custom_icon');
}
```

## Route Configuration Examples

### Main Routes (`app.routes.ts`)
```typescript
{
  path: 'lms',
  loadChildren: () => import('./features/lms/lms.routes').then(m => m.LMS_ROUTES),
  data: { breadcrumb: 'Learning Management System', icon: 'menu_book' }
}
```

### Child Routes (`lms.routes.ts`)
```typescript
{
  path: 'courses',
  loadComponent: () => import('./courses/courses.component').then(m => m.CoursesComponent),
  data: { breadcrumb: 'Courses', icon: 'library_books' }
}
```

## Styling and Theming

The breadcrumb component supports:
- Material Design color tokens
- Dark theme compatibility
- High contrast mode
- Custom CSS variables for theming

### Custom Styling

You can override breadcrumb styles by targeting these CSS classes:

```scss
.breadcrumb-container {
  // Main container styles
}

.breadcrumb-link {
  // Clickable breadcrumb styles
}

.breadcrumb-current {
  // Current page breadcrumb styles
}

.breadcrumb-icon {
  // Icon styles
}
```

## Accessibility Features

- **ARIA Labels**: Proper ARIA labels for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Uses proper semantic HTML structure with `<nav>` and `<ol>`

## Mobile Support

The breadcrumb component is fully responsive:
- Horizontal scrolling on small screens
- Reduced padding and font sizes on mobile
- Icon hiding on very small screens (< 480px)
- Touch-friendly click targets

## Browser Support

The breadcrumb system works with all modern browsers supported by Angular 18+:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading compatible
- Minimal bundle impact
- Efficient change detection
- Memory leak prevention with proper subscription cleanup

## Configuration

### Predefined Route Mappings

The service includes predefined mappings for common routes:

```typescript
// Home routes
'': 'Home'
'home': 'Home'

// Auth routes  
'auth': 'Authentication'
'login': 'Login'
'register': 'Register'

// LMS routes
'lms': 'Learning Management System'
'courses': 'Courses'
'assignments': 'Assignments'

// Admin routes
'admin': 'Administration'
'user-management': 'User Management'
// ... and more
```

### Icon Mappings

Icons use Material Icons font:

```typescript
'home': 'home'
'lms': 'menu_book' 
'courses': 'library_books'
'admin': 'admin_panel_settings'
// ... and more
```

## Troubleshooting

### Common Issues

1. **Breadcrumbs not showing**: Ensure the header component is displaying and the user is authenticated
2. **Wrong labels**: Add proper route data or check route label mappings
3. **Missing icons**: Verify Material Icons are loaded and icon names are correct
4. **Styling issues**: Check if Material Design tokens are properly configured

### Debug Mode

Enable console logging to debug breadcrumb generation:

```typescript
// In breadcrumb.service.ts
console.log('Current breadcrumbs:', this.breadcrumbsSubject.getValue());
```

## Future Enhancements

- Support for dynamic breadcrumb labels based on route parameters
- Breadcrumb caching for performance optimization  
- Integration with Angular Universal for SSR
- Custom breadcrumb templates
- Breadcrumb history and back navigation