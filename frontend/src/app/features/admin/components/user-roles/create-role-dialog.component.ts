import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RoleDialogData {
  permissions: Permission[];
  existingRole?: any;
}

@Component({
  selector: 'app-create-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule
  ],
  templateUrl: './create-role-dialog.component.html',
  styleUrls: ['./create-role-dialog.component.scss']
})
export class CreateRoleDialogComponent implements OnInit {
  roleForm!: FormGroup;
  selectedPermissions: Set<string> = new Set();
  isEditMode = false;

  permissionCategories = [
    { id: 'administration', name: 'Administration', icon: 'admin_panel_settings', color: '#4CAF50' },
    { id: 'company', name: 'Company Management', icon: 'business', color: '#2196F3' },
    { id: 'learning', name: 'Learning', icon: 'school', color: '#FF9800' },
    { id: 'teaching', name: 'Teaching', icon: 'local_library', color: '#9C27B0' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleDialogData
  ) {
    this.isEditMode = !!data?.existingRole;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.data?.existingRole?.permissions) {
      this.selectedPermissions = new Set(this.data.existingRole.permissions);
    }
  }

  private initForm(): void {
    this.roleForm = this.fb.group({
      name: [
        this.data?.existingRole?.name || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      description: [
        this.data?.existingRole?.description || '', 
        [Validators.required, Validators.minLength(10)]
      ],
      isSystemRole: [this.data?.existingRole?.isSystemRole || false]
    });
  }

  getPermissionsByCategory(categoryId: string): Permission[] {
    return this.data.permissions.filter(p => p.category === categoryId);
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissions.has(permissionId);
  }

  togglePermission(permissionId: string, event: any): void {
    if (event.checked) {
      this.selectedPermissions.add(permissionId);
    } else {
      this.selectedPermissions.delete(permissionId);
    }
  }

  selectAllInCategory(categoryId: string): void {
    const categoryPermissions = this.getPermissionsByCategory(categoryId);
    categoryPermissions.forEach(p => this.selectedPermissions.add(p.id));
  }

  deselectAllInCategory(categoryId: string): void {
    const categoryPermissions = this.getPermissionsByCategory(categoryId);
    categoryPermissions.forEach(p => this.selectedPermissions.delete(p.id));
  }

  getCategorySelectedCount(categoryId: string): number {
    const categoryPermissions = this.getPermissionsByCategory(categoryId);
    return categoryPermissions.filter(p => this.selectedPermissions.has(p.id)).length;
  }

  getCategoryTotalCount(categoryId: string): number {
    return this.getPermissionsByCategory(categoryId).length;
  }

  isCategoryFullySelected(categoryId: string): boolean {
    return this.getCategorySelectedCount(categoryId) === this.getCategoryTotalCount(categoryId);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isFormValid) {
      const roleData = {
        ...this.roleForm.value,
        permissions: Array.from(this.selectedPermissions),
        id: this.data.existingRole?.id || this.generateRoleId(),
        userCount: this.data.existingRole?.userCount || 0,
        createdDate: this.data.existingRole?.createdDate || new Date()
      };
      this.dialogRef.close(roleData);
    }
  }

  private generateRoleId(): string {
    return 'role_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  get selectedPermissionsCount(): number {
    return this.selectedPermissions.size;
  }

  get isFormValid(): boolean {
    return this.roleForm.valid && this.selectedPermissions.size > 0;
  }

  get nameErrors(): string {
    const control = this.roleForm.get('name');
    if (control?.hasError('required')) {
      return 'Role name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum 3 characters required';
    }
    return '';
  }

  get descriptionErrors(): string {
    const control = this.roleForm.get('description');
    if (control?.hasError('required')) {
      return 'Description is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum 10 characters required';
    }
    return '';
  }
}
