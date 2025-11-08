import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

interface SystemSetting {
  key: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
  description: string;
  category: string;
  editable: boolean;
}

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule
  ],
  template: `
    <div class="system-settings-container">
      <div class="header">
        
        <p class="subtitle">Configure system-wide settings and preferences</p>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="saveAllSettings()" [disabled]="!hasUnsavedChanges">
            <mat-icon>save</mat-icon>
            Save Changes
          </button>
          <button mat-stroked-button (click)="resetToDefaults()">
            <mat-icon>restore</mat-icon>
            Reset to Defaults
          </button>
          <button mat-stroked-button (click)="exportSettings()">
            <mat-icon>file_download</mat-icon>
            Export Settings
          </button>
        </div>
      </div>

      <mat-tab-group class="settings-tabs">
        <!-- General Settings Tab -->
        <mat-tab label="General">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Application Settings</mat-card-title>
                <mat-card-subtitle>Basic application configuration</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="generalForm" class="settings-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Application Name</mat-label>
                      <input matInput formControlName="appName">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Default Language</mat-label>
                      <mat-select formControlName="defaultLanguage">
                        <mat-option value="en">English</mat-option>
                        <mat-option value="hi">Hindi</mat-option>
                        <mat-option value="kn">Kannada</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Timezone</mat-label>
                      <mat-select formControlName="timezone">
                        <mat-option value="Asia/Kolkata">Asia/Kolkata (IST)</mat-option>
                        <mat-option value="UTC">UTC</mat-option>
                        <mat-option value="America/New_York">America/New_York (EST)</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Support Email</mat-label>
                      <input matInput type="email" formControlName="supportEmail">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="maintenanceMode">
                      Maintenance Mode
                    </mat-slide-toggle>
                    <p class="setting-description">Enable maintenance mode to restrict access during updates</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="userRegistration">
                      Allow User Registration
                    </mat-slide-toggle>
                    <p class="setting-description">Allow new users to register accounts</p>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Security Settings Tab -->
        <mat-tab label="Security">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Authentication & Security</mat-card-title>
                <mat-card-subtitle>Security policies and authentication settings</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="securityForm" class="settings-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Session Timeout (minutes)</mat-label>
                      <input matInput type="number" formControlName="sessionTimeout">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Max Login Attempts</mat-label>
                      <input matInput type="number" formControlName="maxLoginAttempts">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Password Min Length</mat-label>
                      <input matInput type="number" formControlName="passwordMinLength">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Password Expiry (days)</mat-label>
                      <input matInput type="number" formControlName="passwordExpiry">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="twoFactorAuth">
                      Require Two-Factor Authentication
                    </mat-slide-toggle>
                    <p class="setting-description">Require 2FA for all administrative accounts</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="passwordComplexity">
                      Enforce Password Complexity
                    </mat-slide-toggle>
                    <p class="setting-description">Require uppercase, lowercase, numbers, and special characters</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="auditLogging">
                      Enable Audit Logging
                    </mat-slide-toggle>
                    <p class="setting-description">Log all administrative actions for security auditing</p>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Email Settings Tab -->
        <mat-tab label="Email">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Email Configuration</mat-card-title>
                <mat-card-subtitle>SMTP and email notification settings</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="emailForm" class="settings-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>SMTP Host</mat-label>
                      <input matInput formControlName="smtpHost">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>SMTP Port</mat-label>
                      <input matInput type="number" formControlName="smtpPort">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>SMTP Username</mat-label>
                      <input matInput formControlName="smtpUsername">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>SMTP Password</mat-label>
                      <input matInput type="password" formControlName="smtpPassword">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>From Email Address</mat-label>
                      <input matInput type="email" formControlName="fromEmail">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="enableSsl">
                      Enable SSL/TLS
                    </mat-slide-toggle>
                    <p class="setting-description">Use secure connection for SMTP</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="emailNotifications">
                      Enable Email Notifications
                    </mat-slide-toggle>
                    <p class="setting-description">Send automated email notifications to users</p>
                  </div>

                  <div class="form-actions">
                    <button mat-button type="button" (click)="testEmailConnection()">
                      <mat-icon>email</mat-icon>
                      Test Connection
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Storage Settings Tab -->
        <mat-tab label="Storage">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>File Storage Configuration</mat-card-title>
                <mat-card-subtitle>File upload and storage settings</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="storageForm" class="settings-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Max File Size (MB)</mat-label>
                      <input matInput type="number" formControlName="maxFileSize">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Storage Quota per User (GB)</mat-label>
                      <input matInput type="number" formControlName="userStorageQuota">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Allowed File Types</mat-label>
                      <input matInput formControlName="allowedFileTypes" placeholder="pdf,doc,docx,jpg,png">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Storage Path</mat-label>
                      <input matInput formControlName="storagePath">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="enableCompression">
                      Enable File Compression
                    </mat-slide-toggle>
                    <p class="setting-description">Compress uploaded files to save storage space</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="virusScan">
                      Enable Virus Scanning
                    </mat-slide-toggle>
                    <p class="setting-description">Scan uploaded files for malware</p>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Storage Analytics</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="storage-stats">
                  <div class="stat-item">
                    <mat-icon>storage</mat-icon>
                    <div class="stat-details">
                      <h3>Total Used Storage</h3>
                      <p class="stat-value">145.6 GB</p>
                    </div>
                  </div>
                  
                  <div class="stat-item">
                    <mat-icon>folder</mat-icon>
                    <div class="stat-details">
                      <h3>Total Files</h3>
                      <p class="stat-value">45,678</p>
                    </div>
                  </div>
                  
                  <div class="stat-item">
                    <mat-icon>cloud_upload</mat-icon>
                    <div class="stat-details">
                      <h3>Files Uploaded Today</h3>
                      <p class="stat-value">234</p>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- API Settings Tab -->
        <mat-tab label="API & Integrations">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>API Configuration</mat-card-title>
                <mat-card-subtitle>External API and integration settings</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="apiForm" class="settings-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>API Rate Limit (requests/hour)</mat-label>
                      <input matInput type="number" formControlName="rateLimit">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>API Timeout (seconds)</mat-label>
                      <input matInput type="number" formControlName="apiTimeout">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="enableApiLogging">
                      Enable API Logging
                    </mat-slide-toggle>
                    <p class="setting-description">Log all API requests and responses</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="enableCors">
                      Enable CORS
                    </mat-slide-toggle>
                    <p class="setting-description">Allow cross-origin requests</p>
                  </div>
                </form>

                <mat-expansion-panel class="integration-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>Third-Party Integrations</mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  <div class="integration-list">
                    <div class="integration-item">
                      <div class="integration-info">
                        <h4>Razorpay Payment Gateway</h4>
                        <p>Payment processing integration</p>
                      </div>
                      <mat-slide-toggle [checked]="true">Enabled</mat-slide-toggle>
                    </div>
                    
                    <div class="integration-item">
                      <div class="integration-info">
                        <h4>Google Analytics</h4>
                        <p>Website analytics and tracking</p>
                      </div>
                      <mat-slide-toggle [checked]="false">Disabled</mat-slide-toggle>
                    </div>
                    
                    <div class="integration-item">
                      <div class="integration-info">
                        <h4>SMS Gateway</h4>
                        <p>SMS notifications service</p>
                      </div>
                      <mat-slide-toggle [checked]="true">Enabled</mat-slide-toggle>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Advanced Settings Tab -->
        <mat-tab label="Advanced">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Advanced System Configuration</mat-card-title>
                <mat-card-subtitle>Advanced settings for system administrators</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="advancedForm" class="settings-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Cache TTL (minutes)</mat-label>
                      <input matInput type="number" formControlName="cacheTtl">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Log Level</mat-label>
                      <mat-select formControlName="logLevel">
                        <mat-option value="debug">Debug</mat-option>
                        <mat-option value="info">Info</mat-option>
                        <mat-option value="warning">Warning</mat-option>
                        <mat-option value="error">Error</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Database Connection Pool Size</mat-label>
                      <input matInput type="number" formControlName="dbPoolSize">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="enableCaching">
                      Enable Application Caching
                    </mat-slide-toggle>
                    <p class="setting-description">Enable caching to improve performance</p>
                  </div>

                  <div class="form-row">
                    <mat-slide-toggle formControlName="enableDebugMode">
                      Debug Mode
                    </mat-slide-toggle>
                    <p class="setting-description">Enable debug mode for development (not recommended for production)</p>
                  </div>
                </form>

                <div class="danger-zone">
                  <h3>Danger Zone</h3>
                  <p>These actions are irreversible. Please be certain before proceeding.</p>
                  
                  <div class="danger-actions">
                    <button mat-stroked-button color="warn" (click)="clearAllCache()">
                      <mat-icon>clear_all</mat-icon>
                      Clear All Cache
                    </button>
                    
                    <button mat-stroked-button color="warn" (click)="resetDatabase()">
                      <mat-icon>storage</mat-icon>
                      Reset Database
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .system-settings-container {
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .header {
      margin-bottom: 32px;
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      h1 {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 0 0 8px 0;
        font-size: 2.5rem;
        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        color: #666;
        margin: 0 0 24px 0;
        font-size: 1.2rem;
      }

      .actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }
    }

    .settings-tabs {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .settings-form {
      .form-row {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        align-items: center;
        flex-wrap: wrap;

        .full-width {
          flex: 1;
          min-width: 300px;
        }

        .half-width {
          flex: 1;
          min-width: 200px;
        }

        mat-slide-toggle {
          margin-bottom: 8px;
        }

        .setting-description {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          flex-basis: 100%;
        }
      }

      .form-actions {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #eee;
      }
    }

    .storage-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 16px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: #f5f5f5;
        border-radius: 8px;

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          color: #666;
        }

        .stat-details {
          h3 {
            margin: 0 0 4px 0;
            font-size: 0.9rem;
            color: #666;
          }

          .stat-value {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
          }
        }
      }
    }

    .integration-panel {
      margin-top: 24px;
    }

    .integration-list {
      .integration-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .integration-info {
          h4 {
            margin: 0 0 4px 0;
            font-size: 1rem;
          }

          p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
          }
        }
      }
    }

    .danger-zone {
      margin-top: 32px;
      padding: 24px;
      background: #ffebee;
      border-radius: 8px;
      border-left: 4px solid #f44336;

      h3 {
        margin: 0 0 8px 0;
        color: #c62828;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      p {
        margin: 0 0 16px 0;
        color: #666;
      }

      .danger-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }
    }

    @media (max-width: 768px) {
      .system-settings-container {
        padding: 16px;
      }

      .tab-content {
        padding: 16px;
      }

      .settings-form .form-row {
        flex-direction: column;
        align-items: stretch;

        .half-width,
        .full-width {
          min-width: auto;
        }
      }

      .storage-stats {
        grid-template-columns: 1fr;
      }

      .integration-item {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 12px;
      }
    }
  `]
})
export class SystemSettingsComponent implements OnInit {
  generalForm: FormGroup;
  securityForm: FormGroup;
  emailForm: FormGroup;
  storageForm: FormGroup;
  apiForm: FormGroup;
  advancedForm: FormGroup;
  
  hasUnsavedChanges = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.generalForm = this.createGeneralForm();
    this.securityForm = this.createSecurityForm();
    this.emailForm = this.createEmailForm();
    this.storageForm = this.createStorageForm();
    this.apiForm = this.createApiForm();
    this.advancedForm = this.createAdvancedForm();
  }

  ngOnInit(): void {
    this.loadSettings();
    this.setupFormChangeDetection();
  }

  private createGeneralForm(): FormGroup {
    return this.fb.group({
      appName: ['RGUHS LMS Portal', Validators.required],
      defaultLanguage: ['en'],
      timezone: ['Asia/Kolkata'],
      supportEmail: ['support@rguhs.edu.in', [Validators.required, Validators.email]],
      maintenanceMode: [false],
      userRegistration: [true]
    });
  }

  private createSecurityForm(): FormGroup {
    return this.fb.group({
      sessionTimeout: [30, [Validators.required, Validators.min(5)]],
      maxLoginAttempts: [5, [Validators.required, Validators.min(3)]],
      passwordMinLength: [8, [Validators.required, Validators.min(6)]],
      passwordExpiry: [90, [Validators.required, Validators.min(30)]],
      twoFactorAuth: [false],
      passwordComplexity: [true],
      auditLogging: [true]
    });
  }

  private createEmailForm(): FormGroup {
    return this.fb.group({
      smtpHost: ['smtp.gmail.com', Validators.required],
      smtpPort: [587, [Validators.required, Validators.min(1)]],
      smtpUsername: ['', Validators.required],
      smtpPassword: [''],
      fromEmail: ['noreply@rguhs.edu.in', [Validators.required, Validators.email]],
      enableSsl: [true],
      emailNotifications: [true]
    });
  }

  private createStorageForm(): FormGroup {
    return this.fb.group({
      maxFileSize: [50, [Validators.required, Validators.min(1)]],
      userStorageQuota: [5, [Validators.required, Validators.min(1)]],
      allowedFileTypes: ['pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif'],
      storagePath: ['/uploads'],
      enableCompression: [true],
      virusScan: [true]
    });
  }

  private createApiForm(): FormGroup {
    return this.fb.group({
      rateLimit: [1000, [Validators.required, Validators.min(100)]],
      apiTimeout: [30, [Validators.required, Validators.min(5)]],
      enableApiLogging: [true],
      enableCors: [false]
    });
  }

  private createAdvancedForm(): FormGroup {
    return this.fb.group({
      cacheTtl: [60, [Validators.required, Validators.min(5)]],
      logLevel: ['info'],
      dbPoolSize: [10, [Validators.required, Validators.min(5)]],
      enableCaching: [true],
      enableDebugMode: [false]
    });
  }

  private setupFormChangeDetection(): void {
    const forms = [
      this.generalForm,
      this.securityForm,
      this.emailForm,
      this.storageForm,
      this.apiForm,
      this.advancedForm
    ];

    forms.forEach(form => {
      form.valueChanges.subscribe(() => {
        this.hasUnsavedChanges = true;
      });
    });
  }

  private loadSettings(): void {
    // In a real application, this would load settings from the backend
    console.log('Loading system settings...');
    // Mock data is already set in form initialization
  }

  saveAllSettings(): void {
    const allValid = [
      this.generalForm.valid,
      this.securityForm.valid,
      this.emailForm.valid,
      this.storageForm.valid,
      this.apiForm.valid,
      this.advancedForm.valid
    ].every(valid => valid);

    if (!allValid) {
      this.snackBar.open('Please fix validation errors before saving', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const settings = {
      general: this.generalForm.value,
      security: this.securityForm.value,
      email: this.emailForm.value,
      storage: this.storageForm.value,
      api: this.apiForm.value,
      advanced: this.advancedForm.value
    };

    console.log('Saving settings:', settings);
    
    // Simulate API call
    setTimeout(() => {
      this.hasUnsavedChanges = false;
      this.snackBar.open('Settings saved successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
  }

  resetToDefaults(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Reset to Defaults',
        message: 'Are you sure you want to reset all settings to default values? This action cannot be undone.',
        confirmText: 'Reset',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generalForm.reset();
        this.securityForm.reset();
        this.emailForm.reset();
        this.storageForm.reset();
        this.apiForm.reset();
        this.advancedForm.reset();
        
        // Reinitialize with default values
        this.generalForm = this.createGeneralForm();
        this.securityForm = this.createSecurityForm();
        this.emailForm = this.createEmailForm();
        this.storageForm = this.createStorageForm();
        this.apiForm = this.createApiForm();
        this.advancedForm = this.createAdvancedForm();
        
        this.setupFormChangeDetection();
        this.hasUnsavedChanges = true;
        
        this.snackBar.open('Settings reset to defaults', 'Close', {
          duration: 3000
        });
      }
    });
  }

  exportSettings(): void {
    const settings = {
      general: this.generalForm.value,
      security: this.securityForm.value,
      email: this.emailForm.value,
      storage: this.storageForm.value,
      api: this.apiForm.value,
      advanced: this.advancedForm.value,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  testEmailConnection(): void {
    if (this.emailForm.invalid) {
      this.snackBar.open('Please fill in all required email settings', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    console.log('Testing email connection...');
    
    // Simulate API call
    setTimeout(() => {
      this.snackBar.open('Email connection test successful!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 2000);
  }

  clearAllCache(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Clear All Cache',
        message: 'This will clear all cached data and may temporarily impact performance. Continue?',
        confirmText: 'Clear Cache',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Clearing all cache...');
        setTimeout(() => {
          this.snackBar.open('Cache cleared successfully', 'Close', {
            duration: 3000
          });
        }, 1000);
      }
    });
  }

  resetDatabase(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Reset Database',
        message: 'WARNING: This will permanently delete all data and reset the database to its initial state. This action cannot be undone!',
        confirmText: 'I Understand, Reset Database',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Resetting database...');
        // This would typically require additional confirmation steps
        alert('Database reset feature requires additional security validation.');
      }
    });
  }
}

// Confirmation Dialog Component (inline for simplicity)
@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}