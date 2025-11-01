import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdDate: Date;
  isSystemRole: boolean;
}

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  roles: Role[] = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access and management capabilities',
      permissions: ['user_management', 'system_settings', 'reports', 'full_access'],
      userCount: 3,
      createdDate: new Date('2023-01-01'),
      isSystemRole: true
    },
    {
      id: 'company',
      name: 'Company Representative',
      description: 'Manage company profile, job postings, and candidates',
      permissions: ['company_profile', 'job_posting', 'candidate_management', 'interview_scheduling'],
      userCount: 15,
      createdDate: new Date('2023-01-01'),
      isSystemRole: true
    },
    {
      id: 'student',
      name: 'Student',
      description: 'Access courses, assignments, and learning resources',
      permissions: ['course_access', 'assignment_submission', 'resource_download', 'progress_tracking'],
      userCount: 245,
      createdDate: new Date('2023-01-01'),
      isSystemRole: true
    },
    {
      id: 'instructor',
      name: 'Instructor',
      description: 'Create and manage courses, assignments, and assessments',
      permissions: ['course_creation', 'assignment_management', 'student_assessment', 'resource_upload'],
      userCount: 12,
      createdDate: new Date('2023-01-01'),
      isSystemRole: true
    },
    {
      id: 'hr_manager',
      name: 'HR Manager',
      description: 'Human resources management and recruitment',
      permissions: ['user_management', 'reports', 'candidate_management'],
      userCount: 5,
      createdDate: new Date('2023-06-15'),
      isSystemRole: false
    }
  ];

  permissions: Permission[] = [
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and delete user accounts', category: 'administration' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure system-wide settings', category: 'administration' },
    { id: 'reports', name: 'Reports', description: 'Access system reports and analytics', category: 'administration' },
    { id: 'full_access', name: 'Full Access', description: 'Complete system access', category: 'administration' },
    { id: 'company_profile', name: 'Company Profile', description: 'Manage company information', category: 'company' },
    { id: 'job_posting', name: 'Job Posting', description: 'Create and manage job postings', category: 'company' },
    { id: 'candidate_management', name: 'Candidate Management', description: 'Review and manage candidates', category: 'company' },
    { id: 'interview_scheduling', name: 'Interview Scheduling', description: 'Schedule and manage interviews', category: 'company' },
    { id: 'course_access', name: 'Course Access', description: 'Access enrolled courses', category: 'learning' },
    { id: 'assignment_submission', name: 'Assignment Submission', description: 'Submit assignments', category: 'learning' },
    { id: 'resource_download', name: 'Resource Download', description: 'Download learning resources', category: 'learning' },
    { id: 'progress_tracking', name: 'Progress Tracking', description: 'Track learning progress', category: 'learning' },
    { id: 'course_creation', name: 'Course Creation', description: 'Create and manage courses', category: 'teaching' },
    { id: 'assignment_management', name: 'Assignment Management', description: 'Create and grade assignments', category: 'teaching' },
    { id: 'student_assessment', name: 'Student Assessment', description: 'Assess student performance', category: 'teaching' },
    { id: 'resource_upload', name: 'Resource Upload', description: 'Upload learning resources', category: 'teaching' }
  ];

  displayedColumns: string[] = ['name', 'users', 'permissions', 'type', 'created', 'actions'];

  enabledPermissions: Set<string> = new Set([
    'user_management', 'system_settings', 'reports', 'full_access',
    'company_profile', 'job_posting', 'candidate_management', 'interview_scheduling',
    'course_access', 'assignment_submission', 'resource_download', 'progress_tracking',
    'course_creation', 'assignment_management', 'student_assessment', 'resource_upload'
  ]);

  ngOnInit() {
    // Load roles and permissions from API
  }

  getSystemRoles(): Role[] {
    return this.roles.filter(role => role.isSystemRole);
  }

  getTotalUsersWithRoles(): number {
    return this.roles.reduce((total, role) => total + role.userCount, 0);
  }

  getTotalPermissions(): number {
    return this.permissions.length;
  }

  getPermissionPreview(permissionIds: string[]): string[] {
    return permissionIds.slice(0, 3);
  }

  getPermissionName(permissionId: string): string {
    const permission = this.permissions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  }

  getPermissionCategories() {
    return [
      { id: 'administration', name: 'Administration', icon: 'admin_panel_settings' },
      { id: 'company', name: 'Company Management', icon: 'business' },
      { id: 'learning', name: 'Learning', icon: 'school' },
      { id: 'teaching', name: 'Teaching', icon: 'teach' }
    ];
  }

  getPermissionsByCategory(categoryId: string): Permission[] {
    return this.permissions.filter(p => p.category === categoryId);
  }

  isPermissionEnabled(permissionId: string): boolean {
    return this.enabledPermissions.has(permissionId);
  }

  togglePermission(permissionId: string, enabled: boolean) {
    if (enabled) {
      this.enabledPermissions.add(permissionId);
    } else {
      this.enabledPermissions.delete(permissionId);
    }
    console.log('Permission toggled:', permissionId, enabled);
  }

  createNewRole() {
    console.log('Create new role');
    // Open role creation dialog
  }

  editRole(role: Role) {
    console.log('Edit role:', role);
    // Open role edit dialog
  }

  managePermissions(role: Role) {
    console.log('Manage permissions for role:', role);
    // Open permissions management dialog
  }

  viewUsersInRole(role: Role) {
    console.log('View users in role:', role);
    // Navigate to users list filtered by role
  }

  duplicateRole(role: Role) {
    console.log('Duplicate role:', role);
    // Create duplicate role
  }

  deleteRole(role: Role) {
    console.log('Delete role:', role);
    // Open delete confirmation dialog
  }
}