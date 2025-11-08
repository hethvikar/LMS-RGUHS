import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { interval, Subscription } from 'rxjs';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
  lastCheck: Date;
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule
  ],
  template: `
    <div class="system-health-container">
      <div class="header">
        <p class="subtitle">Real-time system monitoring and performance metrics</p>
        
        <div class="actions">
          <button mat-raised-button color="primary" (click)="refreshMetrics()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-stroked-button (click)="exportHealthReport()">
            <mat-icon>file_download</mat-icon>
            Export Report
          </button>
        </div>
      </div>

      <!-- Overall System Status -->
      <div class="status-overview">
        <mat-card class="status-card" [ngClass]="overallStatus">
          <mat-card-content>
            <div class="status-header">
              <mat-icon>{{ getStatusIcon() }}</mat-icon>
              <h2>System Status: {{ overallStatus | titlecase }}</h2>
            </div>
            <p class="status-message">{{ getStatusMessage() }}</p>
            <div class="last-updated">
              Last updated: {{ lastUpdated | date:'medium' }}
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group class="health-tabs">
        <!-- Performance Metrics Tab -->
        <mat-tab label="Performance Metrics">
          <div class="metrics-grid">
            <mat-card *ngFor="let metric of performanceMetrics" class="metric-card">
              <mat-card-content>
                <div class="metric-header">
                  <h3>{{ metric.name }}</h3>
                  <mat-chip [ngClass]="'status-' + metric.status">
                    {{ metric.status | titlecase }}
                  </mat-chip>
                </div>
                
                <div class="metric-value">
                  <span class="value">{{ metric.value }}</span>
                  <span class="unit">{{ metric.unit }}</span>
                </div>
                
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="(metric.value / metric.threshold) * 100"
                  [ngClass]="'progress-' + metric.status">
                </mat-progress-bar>
                
                <div class="threshold">
                  Threshold: {{ metric.threshold }}{{ metric.unit }}
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Service Status Tab -->
        <mat-tab label="Service Status">
          <div class="services-container">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Application Services</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="applicationServices" class="services-table">
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Service Name</th>
                    <td mat-cell *matCellDef="let service">{{ service.name }}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let service">
                      <mat-chip [ngClass]="'status-' + service.status">
                        <mat-icon>{{ getServiceIcon(service.status) }}</mat-icon>
                        {{ service.status | titlecase }}
                      </mat-chip>
                    </td>
                  </ng-container>
                  
                  <ng-container matColumnDef="uptime">
                    <th mat-header-cell *matHeaderCellDef>Uptime</th>
                    <td mat-cell *matCellDef="let service">{{ service.uptime }}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="responseTime">
                    <th mat-header-cell *matHeaderCellDef>Response Time</th>
                    <td mat-cell *matCellDef="let service">{{ service.responseTime }}ms</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="lastCheck">
                    <th mat-header-cell *matHeaderCellDef>Last Check</th>
                    <td mat-cell *matCellDef="let service">{{ service.lastCheck | date:'short' }}</td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="serviceColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: serviceColumns;"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Resource Usage Tab -->
        <mat-tab label="Resource Usage">
          <div class="resource-grid">
            <mat-card class="resource-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>memory</mat-icon>
                  Memory Usage
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="resource-stats">
                  <div class="stat">
                    <span class="label">Used:</span>
                    <span class="value">{{ memoryUsage.used }}GB</span>
                  </div>
                  <div class="stat">
                    <span class="label">Total:</span>
                    <span class="value">{{ memoryUsage.total }}GB</span>
                  </div>
                  <div class="stat">
                    <span class="label">Usage:</span>
                    <span class="value">{{ memoryUsage.percentage }}%</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="memoryUsage.percentage"
                  [ngClass]="getResourceStatus(memoryUsage.percentage)">
                </mat-progress-bar>
              </mat-card-content>
            </mat-card>

            <mat-card class="resource-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>developer_board</mat-icon>
                  CPU Usage
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="resource-stats">
                  <div class="stat">
                    <span class="label">Current:</span>
                    <span class="value">{{ cpuUsage.current }}%</span>
                  </div>
                  <div class="stat">
                    <span class="label">Average:</span>
                    <span class="value">{{ cpuUsage.average }}%</span>
                  </div>
                  <div class="stat">
                    <span class="label">Peak:</span>
                    <span class="value">{{ cpuUsage.peak }}%</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="cpuUsage.current"
                  [ngClass]="getResourceStatus(cpuUsage.current)">
                </mat-progress-bar>
              </mat-card-content>
            </mat-card>

            <mat-card class="resource-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>storage</mat-icon>
                  Disk Usage
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="resource-stats">
                  <div class="stat">
                    <span class="label">Used:</span>
                    <span class="value">{{ diskUsage.used }}GB</span>
                  </div>
                  <div class="stat">
                    <span class="label">Total:</span>
                    <span class="value">{{ diskUsage.total }}GB</span>
                  </div>
                  <div class="stat">
                    <span class="label">Free:</span>
                    <span class="value">{{ diskUsage.free }}GB</span>
                  </div>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="diskUsage.percentage"
                  [ngClass]="getResourceStatus(diskUsage.percentage)">
                </mat-progress-bar>
              </mat-card-content>
            </mat-card>

            <mat-card class="resource-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>network_check</mat-icon>
                  Network Usage
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="resource-stats">
                  <div class="stat">
                    <span class="label">Inbound:</span>
                    <span class="value">{{ networkUsage.inbound }} MB/s</span>
                  </div>
                  <div class="stat">
                    <span class="label">Outbound:</span>
                    <span class="value">{{ networkUsage.outbound }} MB/s</span>
                  </div>
                  <div class="stat">
                    <span class="label">Latency:</span>
                    <span class="value">{{ networkUsage.latency }}ms</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- System Logs Tab -->
        <mat-tab label="System Logs">
          <div class="logs-container">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Recent System Events</mat-card-title>
                <div class="log-actions">
                  <button mat-button (click)="clearLogs()">
                    <mat-icon>clear</mat-icon>
                    Clear Logs
                  </button>
                </div>
              </mat-card-header>
              <mat-card-content>
                <div class="log-entries">
                  <div *ngFor="let log of systemLogs" class="log-entry" [ngClass]="'log-' + log.level">
                    <div class="log-timestamp">{{ log.timestamp | date:'short' }}</div>
                    <div class="log-level">
                      <mat-chip [ngClass]="'level-' + log.level">{{ log.level | uppercase }}</mat-chip>
                    </div>
                    <div class="log-service">{{ log.service }}</div>
                    <div class="log-message">{{ log.message }}</div>
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
    .system-health-container {
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

    .status-overview {
      margin-bottom: 32px;
    }

    .status-card {
      &.healthy {
        border-left: 4px solid #4CAF50;
        background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
      }
      
      &.warning {
        border-left: 4px solid #FF9800;
        background: linear-gradient(135deg, #fff3e0 0%, #fef7e4 100%);
      }
      
      &.critical {
        border-left: 4px solid #F44336;
        background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
      }

      .status-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
        }

        h2 {
          margin: 0;
          font-size: 1.8rem;
        }
      }

      .status-message {
        font-size: 1.1rem;
        margin-bottom: 12px;
      }

      .last-updated {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .health-tabs {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .metric-card {
      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          margin: 0;
          font-size: 1.1rem;
        }
      }

      .metric-value {
        margin-bottom: 16px;

        .value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
        }

        .unit {
          font-size: 1.2rem;
          color: #666;
          margin-left: 8px;
        }
      }

      .threshold {
        margin-top: 8px;
        font-size: 0.9rem;
        color: #666;
      }
    }

    .services-container {
      padding: 24px;
    }

    .services-table {
      width: 100%;
    }

    .resource-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .resource-card {
      .resource-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 16px;

        .stat {
          text-align: center;

          .label {
            display: block;
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 4px;
          }

          .value {
            display: block;
            font-size: 1.4rem;
            font-weight: 600;
            color: #333;
          }
        }
      }
    }

    .logs-container {
      padding: 24px;
    }

    .log-entries {
      max-height: 500px;
      overflow-y: auto;
    }

    .log-entry {
      display: grid;
      grid-template-columns: 150px 100px 150px 1fr;
      gap: 16px;
      padding: 12px;
      border-bottom: 1px solid #eee;
      align-items: center;

      &.log-error {
        background: rgba(244, 67, 54, 0.05);
      }

      &.log-warning {
        background: rgba(255, 152, 0, 0.05);
      }

      &.log-info {
        background: rgba(33, 150, 243, 0.05);
      }

      .log-timestamp {
        font-size: 0.9rem;
        color: #666;
      }

      .log-service {
        font-weight: 500;
      }

      .log-message {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
      }
    }

    .log-actions {
      display: flex;
      gap: 8px;
    }

    // Status chips
    .status-healthy { background: #e8f5e8; color: #2e7d32; }
    .status-warning { background: #fff3e0; color: #f57c00; }
    .status-critical { background: #ffebee; color: #c62828; }
    .status-online { background: #e8f5e8; color: #2e7d32; }
    .status-offline { background: #ffebee; color: #c62828; }
    .status-degraded { background: #fff3e0; color: #f57c00; }

    // Progress bars
    .progress-healthy .mdc-linear-progress__bar-inner { background-color: #4CAF50 !important; }
    .progress-warning .mdc-linear-progress__bar-inner { background-color: #FF9800 !important; }
    .progress-critical .mdc-linear-progress__bar-inner { background-color: #F44336 !important; }

    // Log level chips
    .level-error { background: #ffebee; color: #c62828; }
    .level-warning { background: #fff3e0; color: #f57c00; }
    .level-info { background: #e3f2fd; color: #1976d2; }
    .level-debug { background: #f3e5f5; color: #7b1fa2; }

    @media (max-width: 768px) {
      .system-health-container {
        padding: 16px;
      }

      .metrics-grid,
      .resource-grid {
        grid-template-columns: 1fr;
        padding: 16px;
      }

      .log-entry {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 16px;
      }
    }
  `]
})
export class SystemHealthComponent implements OnInit, OnDestroy {
  overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  lastUpdated = new Date();
  
  performanceMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', threshold: 80 },
    { name: 'Memory Usage', value: 62, unit: '%', status: 'warning', threshold: 85 },
    { name: 'Disk I/O', value: 23, unit: 'MB/s', status: 'healthy', threshold: 100 },
    { name: 'Network Latency', value: 12, unit: 'ms', status: 'healthy', threshold: 50 },
    { name: 'Database Connections', value: 45, unit: '', status: 'healthy', threshold: 100 },
    { name: 'Active Sessions', value: 234, unit: '', status: 'healthy', threshold: 500 }
  ];

  serviceColumns = ['name', 'status', 'uptime', 'responseTime', 'lastCheck'];
  
  applicationServices: ServiceStatus[] = [
    {
      name: 'Authentication Service',
      status: 'online',
      uptime: '99.9%',
      responseTime: 45,
      lastCheck: new Date()
    },
    {
      name: 'Database Service',
      status: 'online',
      uptime: '99.8%',
      responseTime: 12,
      lastCheck: new Date()
    },
    {
      name: 'File Storage Service',
      status: 'online',
      uptime: '99.7%',
      responseTime: 89,
      lastCheck: new Date()
    },
    {
      name: 'Email Service',
      status: 'degraded',
      uptime: '98.5%',
      responseTime: 156,
      lastCheck: new Date()
    },
    {
      name: 'Notification Service',
      status: 'online',
      uptime: '99.9%',
      responseTime: 23,
      lastCheck: new Date()
    }
  ];

  memoryUsage = { used: 6.2, total: 16, percentage: 38 };
  cpuUsage = { current: 45, average: 35, peak: 78 };
  diskUsage = { used: 145, total: 500, free: 355, percentage: 29 };
  networkUsage = { inbound: 2.3, outbound: 1.8, latency: 12 };

  systemLogs = [
    {
      timestamp: new Date(),
      level: 'info',
      service: 'Auth Service',
      message: 'User login successful for admin@example.com'
    },
    {
      timestamp: new Date(Date.now() - 60000),
      level: 'warning',
      service: 'Email Service',
      message: 'Email delivery delayed - retrying in 5 minutes'
    },
    {
      timestamp: new Date(Date.now() - 120000),
      level: 'error',
      service: 'Database',
      message: 'Connection timeout - attempting reconnection'
    },
    {
      timestamp: new Date(Date.now() - 180000),
      level: 'info',
      service: 'File Storage',
      message: 'File upload completed successfully'
    }
  ];

  private refreshSubscription?: Subscription;

  ngOnInit(): void {
    this.updateOverallStatus();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshMetrics(): void {
    // Simulate refreshing metrics
    this.performanceMetrics = this.performanceMetrics.map(metric => ({
      ...metric,
      value: Math.floor(Math.random() * metric.threshold),
      status: this.getMetricStatus(Math.floor(Math.random() * metric.threshold), metric.threshold)
    }));
    
    this.lastUpdated = new Date();
    this.updateOverallStatus();
  }

  exportHealthReport(): void {
    console.log('Exporting health report...');
    // Implement health report export
    alert('Health report export feature will be implemented');
  }

  clearLogs(): void {
    this.systemLogs = [];
  }

  getStatusIcon(): string {
    switch (this.overallStatus) {
      case 'healthy': return 'check_circle';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'help';
    }
  }

  getStatusMessage(): string {
    switch (this.overallStatus) {
      case 'healthy': return 'All systems are operating normally';
      case 'warning': return 'Some services are experiencing minor issues';
      case 'critical': return 'Critical issues detected - immediate attention required';
      default: return 'Status unknown';
    }
  }

  getServiceIcon(status: string): string {
    switch (status) {
      case 'online': return 'check_circle';
      case 'offline': return 'cancel';
      case 'degraded': return 'warning';
      default: return 'help';
    }
  }

  getResourceStatus(percentage: number): string {
    if (percentage < 70) return 'progress-healthy';
    if (percentage < 85) return 'progress-warning';
    return 'progress-critical';
  }

  private updateOverallStatus(): void {
    const criticalCount = this.performanceMetrics.filter(m => m.status === 'critical').length;
    const warningCount = this.performanceMetrics.filter(m => m.status === 'warning').length;
    
    if (criticalCount > 0) {
      this.overallStatus = 'critical';
    } else if (warningCount > 0) {
      this.overallStatus = 'warning';
    } else {
      this.overallStatus = 'healthy';
    }
  }

  private getMetricStatus(value: number, threshold: number): 'healthy' | 'warning' | 'critical' {
    const percentage = (value / threshold) * 100;
    if (percentage < 70) return 'healthy';
    if (percentage < 85) return 'warning';
    return 'critical';
  }

  private startAutoRefresh(): void {
    // Auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.refreshMetrics();
    });
  }
}