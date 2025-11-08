import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbsSubject.asObservable();

  // Route label mappings for better display names
  private routeLabels: { [key: string]: string } = {
    // Home routes
    '': 'Home',
    'home': 'Home',
    
    // Auth routes
    'auth': 'Authentication',
    'login': 'Login',
    'register': 'Register',
    
    // Dashboard routes
    'dashboard': 'Dashboard',
    
    // Student routes
    'student': 'Student Portal',
    
    // Company routes
    'company': 'Company Portal',
    'candidates': 'Candidates',
    'jobs': 'Jobs',
    'interviews': 'Interviews',
    'screening': 'Screening',
    'profile': 'Profile',
    
    // LMS routes
    'lms': 'Learning Management System',
    'courses': 'Courses',
    'assignments': 'Assignments',
    'resources': 'Resources',
    'progress': 'Progress',
    'question-bank': 'Question Bank',
    'assessment-results': 'Assessment Results',
    'assessment-taking': 'Take Assessment',
    
    // Admin routes
    'admin': 'Administration',
    'user-management': 'User Management',
    'user-roles': 'User Roles',
    'user-activity': 'User Activity',
    'course-enrollment': 'Course Enrollment',
    'assessment-assignment': 'Assessment Assignment',
    'candidate-search': 'Candidate Search',
    'company-verification': 'Company Verification',
    'request-tracker': 'Request Tracker'
  };

  // Route icons mapping
  private routeIcons: { [key: string]: string } = {
    '': 'home',
    'home': 'home',
    'auth': 'security',
    'login': 'login',
    'register': 'person_add',
    'dashboard': 'dashboard',
    'student': 'school',
    'company': 'business',
    'candidates': 'groups',
    'jobs': 'work',
    'interviews': 'record_voice_over',
    'screening': 'filter_alt',
    'profile': 'account_circle',
    'lms': 'menu_book',
    'courses': 'library_books',
    'assignments': 'assignment',
    'resources': 'folder',
    'progress': 'trending_up',
    'question-bank': 'quiz',
    'assessment-results': 'assessment',
    'assessment-taking': 'edit_note',
    'admin': 'admin_panel_settings',
    'user-management': 'manage_accounts',
    'user-roles': 'badge',
    'user-activity': 'monitor',
    'course-enrollment': 'how_to_reg',
    'assessment-assignment': 'assignment_turned_in',
    'candidate-search': 'person_search',
    'company-verification': 'verified',
    'request-tracker': 'track_changes'
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }

  private buildBreadcrumbs(): void {
    const url = this.router.url;
    const breadcrumbs: Breadcrumb[] = [];

    // Add home breadcrumb
    if (url !== '' && url !== '/') {
      breadcrumbs.push({
        label: this.routeLabels[''] || 'Home',
        url: '/',
        icon: this.routeIcons[''] || 'home'
      });
    }

    // Parse URL segments and build breadcrumbs from route data
    const urlSegments = url.split('/').filter(segment => segment);
    let currentUrl = '';
    let route = this.activatedRoute.root;

    urlSegments.forEach((segment, index) => {
      currentUrl += `/${segment}`;
      
      // Skip if it's a parameter (starts with :) or contains numbers (likely an ID)
      if (segment.includes(':') || /^\d+$/.test(segment)) {
        return;
      }

      // Clean segment (remove query parameters and fragments)
      const cleanSegment = segment.split('?')[0].split('#')[0];

      // Try to find route data by traversing the route tree
      let routeData = this.getRouteDataForSegment(route, cleanSegment);
      
      // Get label and icon from route data or fallback to mappings
      const label = routeData?.breadcrumb || this.routeLabels[cleanSegment] || this.formatSegmentLabel(cleanSegment);
      const icon = routeData?.icon || this.routeIcons[cleanSegment];

      // Only add if it's not the last segment or if we want to show the current page
      if (index < urlSegments.length - 1) {
        breadcrumbs.push({
          label,
          url: currentUrl,
          icon
        });
      } else {
        // Add current page without link
        breadcrumbs.push({
          label,
          url: '',
          icon
        });
      }
    });

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private getRouteDataForSegment(route: ActivatedRoute, segment: string): any {
    // Traverse the route tree to find data for the specific segment
    if (route.snapshot.routeConfig?.path === segment) {
      return route.snapshot.data;
    }

    // Check child routes
    for (const child of route.children) {
      const result = this.getRouteDataForSegment(child, segment);
      if (result) {
        return result;
      }
    }

    return null;
  }

  private formatSegmentLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Method to manually update breadcrumbs if needed
  public setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  // Method to add route label mapping dynamically
  public addRouteLabel(route: string, label: string, icon?: string): void {
    this.routeLabels[route] = label;
    if (icon) {
      this.routeIcons[route] = icon;
    }
  }

  // Method to get current breadcrumbs
  public getCurrentBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.getValue();
  }
}