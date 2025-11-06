import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AddUserDialogComponent } from './add-user-dialog.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'student' | 'instructor';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin?: Date;
  createdDate: Date;
  department?: string;
  phone?: string;
  avatar?: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    AddUserDialogComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date('2024-01-20T10:30:00'),
      createdDate: new Date('2023-06-15'),
      department: 'IT',
      phone: '+1-234-567-8900'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@techcorp.com',
      role: 'company',
      status: 'active',
      lastLogin: new Date('2024-01-19T14:20:00'),
      createdDate: new Date('2023-08-10'),
      department: 'HR',
      phone: '+1-234-567-8901'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@student.edu',
      role: 'student',
      status: 'active',
      lastLogin: new Date('2024-01-18T09:15:00'),
      createdDate: new Date('2023-09-01'),
      department: 'Computer Science',
      phone: '+1-234-567-8902'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@university.edu',
      role: 'instructor',
      status: 'active',
      lastLogin: new Date('2024-01-17T16:45:00'),
      createdDate: new Date('2023-07-20'),
      department: 'Engineering',
      phone: '+1-234-567-8903'
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@newcompany.com',
      role: 'company',
      status: 'pending',
      createdDate: new Date('2024-01-15'),
      department: 'Marketing',
      phone: '+1-234-567-8904'
    }
  ];

  roleFilter = '';
  statusFilter = '';
  displayedColumns: string[] = ['avatar', 'name', 'role', 'status', 'lastLogin', 'actions'];

  adminPermissions = ['User Management', 'System Settings', 'Reports', 'Full Access'];
  companyPermissions = ['Job Posting', 'Candidate Management', 'Interview Scheduling', 'Company Profile'];
  studentPermissions = ['Course Access', 'Assignment Submission', 'Resource Download', 'Progress Tracking'];
  instructorPermissions = ['Course Creation', 'Assignment Management', 'Student Assessment', 'Resource Upload'];

  ngOnInit() {
    // Load users from API
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const roleMatch = !this.roleFilter || user.role === this.roleFilter;
      const statusMatch = !this.statusFilter || user.status === this.statusFilter;
      return roleMatch && statusMatch;
    });
  }

  getUserCountByStatus(status: string): number {
    return this.users.filter(user => user.status === status).length;
  }

  getUserCountByRole(role: string): number {
    return this.users.filter(user => user.role === role).length;
  }

  getPendingUsers(): User[] {
    return this.users.filter(user => user.status === 'pending');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#607d8b'];
    const index = name.length % colors.length;
    return colors[index];
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  getRoleText(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrator',
      'company': 'Company',
      'student': 'Student',
      'instructor': 'Instructor'
    };
    return roleMap[role] || role;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive',
      'suspended': 'Suspended',
      'pending': 'Pending'
    };
    return statusMap[status] || status;
  }

  applyFilters() {
    // Filters are applied automatically through the filteredUsers getter
  }

  addNewUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate new ID
        const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
        const newUser: User = {
          id: newId,
          ...result,
          createdDate: new Date()
        };
        this.users.push(newUser);
        console.log('New user added:', newUser);
      }
    });
  }

  viewUser(user: User) {
    console.log('View user details:', user);
    // Open user detail modal
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: false,
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...user, ...result };
          console.log('User updated:', this.users[index]);
        }
      }
    });
  }

  changeUserStatus(user: User) {
    console.log('Change user status:', user);
    // Open status change dialog
  }

  deleteUser(user: User) {
    console.log('Delete user:', user);
    // Open delete confirmation dialog
  }

  approveUser(user: User) {
    console.log('Approve user:', user);
    // Approve user registration
  }

  rejectUser(user: User) {
    console.log('Reject user:', user);
    // Reject user registration
  }

  editRolePermissions(role: string) {
    console.log('Edit permissions for role:', role);
    // Open role permissions dialog
  }
}