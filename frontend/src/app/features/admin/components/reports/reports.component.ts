import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { 
  Chart, 
  ChartConfiguration, 
  ChartType, 
  registerables,
  ChartOptions,
  TooltipItem,
  ScriptableContext 
} from 'chart.js';
import { ReportsService, ReportData } from '../../services/reports.service';

Chart.register(...registerables);

interface PlacementData {
  studentId: string;
  studentName: string;
  branch: string;
  cgpa: number;
  company: string;
  package: number;
  placementDate: Date;
  jobRole: string;
  status: 'placed' | 'pending' | 'rejected';
}

interface CompanyData {
  companyId: string;
  companyName: string;
  industry: string;
  visitDate: Date;
  jobsOffered: number;
  studentsHired: number;
  avgPackage: number;
  maxPackage: number;
  status: 'verified' | 'pending' | 'rejected';
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    FormsModule
  ],
  template: `
    <div class="reports-container">
      <div class="reports-header">
        <h1>
          <mat-icon>analytics</mat-icon>
          Reports & Analytics Dashboard
        </h1>
        <p class="subtitle">Comprehensive placement cell analytics and insights</p>
        
        <div class="filter-controls">
          <mat-form-field appearance="outline">
            <mat-label>Academic Year</mat-label>
            <mat-select [(value)]="selectedYear" (selectionChange)="onFilterChange()">
              <mat-option value="2024-25">2024-25</mat-option>
              <mat-option value="2023-24">2023-24</mat-option>
              <mat-option value="2022-23">2022-23</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Branch</mat-label>
            <mat-select [(value)]="selectedBranch" (selectionChange)="onFilterChange()">
              <mat-option value="all">All Branches</mat-option>
              <mat-option value="CSE">Computer Science</mat-option>
              <mat-option value="ECE">Electronics</mat-option>
              <mat-option value="ME">Mechanical</mat-option>
              <mat-option value="EEE">Electrical</mat-option>
            </mat-select>
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="exportReports()">
            <mat-icon>file_download</mat-icon>
            Export Reports
          </button>
        </div>
      </div>

      <div class="key-metrics">
        <mat-card class="metric-card placement-rate">
          <mat-card-content>
            <div class="metric-header">
              <mat-icon>trending_up</mat-icon>
              <h3>Overall Placement Rate</h3>
            </div>
            <div class="metric-value">{{ placementRate }}%</div>
            <div class="metric-change positive">
              <mat-icon>arrow_upward</mat-icon>
              +{{ placementRateChange }}% from last year
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card avg-package">
          <mat-card-content>
            <div class="metric-header">
              <mat-icon>currency_rupee</mat-icon>
              <h3>Average Package</h3>
            </div>
            <div class="metric-value">₹{{ avgPackage | number:'1.1-1' }} LPA</div>
            <div class="metric-change positive">
              <mat-icon>arrow_upward</mat-icon>
              +₹{{ packageIncrease | number:'1.1-1' }} LPA increase
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card companies">
          <mat-card-content>
            <div class="metric-header">
              <mat-icon>business</mat-icon>
              <h3>Companies Visited</h3>
            </div>
            <div class="metric-value">{{ totalCompanies }}</div>
            <div class="metric-change positive">
              <mat-icon>arrow_upward</mat-icon>
              {{ newCompanies }} new companies
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card students">
          <mat-card-content>
            <div class="metric-header">
              <mat-icon>school</mat-icon>
              <h3>Total Students</h3>
            </div>
            <div class="metric-value">{{ totalStudents }}</div>
            <div class="metric-change">
              <mat-icon>people</mat-icon>
              {{ placedStudents }} placed
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group class="reports-tabs" animationDuration="300ms">
        <!-- Report 1: Placement Statistics -->
        <mat-tab label="Placement Statistics">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Branch-wise Placement Rate</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #placementChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Monthly Placement Trend</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #trendChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 2: Package Analysis -->
        <mat-tab label="Package Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Package Distribution</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #packageChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Branch-wise Average Package</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #branchPackageChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 3: Company Analysis -->
        <mat-tab label="Company Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Top Recruiting Companies</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #companyChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="company-table">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Company Performance Metrics</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <table mat-table [dataSource]="companyData" class="company-metrics-table">
                    <ng-container matColumnDef="companyName">
                      <th mat-header-cell *matHeaderCellDef>Company</th>
                      <td mat-cell *matCellDef="let company">{{ company.companyName }}</td>
                    </ng-container>
                    
                    <ng-container matColumnDef="studentsHired">
                      <th mat-header-cell *matHeaderCellDef>Students Hired</th>
                      <td mat-cell *matCellDef="let company">{{ company.studentsHired }}</td>
                    </ng-container>
                    
                    <ng-container matColumnDef="avgPackage">
                      <th mat-header-cell *matHeaderCellDef>Avg Package</th>
                      <td mat-cell *matCellDef="let company">₹{{ company.avgPackage }} LPA</td>
                    </ng-container>
                    
                    <ng-container matColumnDef="maxPackage">
                      <th mat-header-cell *matHeaderCellDef>Max Package</th>
                      <td mat-cell *matCellDef="let company">₹{{ company.maxPackage }} LPA</td>
                    </ng-container>
                    
                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let company">
                        <mat-chip [class]="'status-' + company.status">{{ company.status | titlecase }}</mat-chip>
                      </td>
                    </ng-container>
                    
                    <tr mat-header-row *matHeaderRowDef="companyColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: companyColumns;"></tr>
                  </table>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 4: Student Performance -->
        <mat-tab label="Student Performance">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>CGPA vs Package Correlation</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #cgpaChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Skill-wise Placement Distribution</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #skillChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 5: Geographic Analysis -->
        <mat-tab label="Geographic Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Location-wise Job Distribution</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #locationChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 6: Industry Analysis -->
        <mat-tab label="Industry Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Industry-wise Placement Distribution</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #industryChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 7: Time Series Analysis -->
        <mat-tab label="Time Series Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Multi-Year Placement Trends</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #timeSeriesChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 8: Success Rate Analysis -->
        <mat-tab label="Success Rate Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Interview Success Rate by Stage</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #successRateChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 9: Comparative Analysis -->
        <mat-tab label="Comparative Analysis">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Year-over-Year Comparison</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #comparativeChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Report 10: Predictive Analytics -->
        <mat-tab label="Predictive Analytics">
          <div class="tab-content">
            <div class="chart-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Placement Probability Prediction</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <canvas #predictiveChart></canvas>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .reports-header {
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

      .filter-controls {
        display: flex;
        gap: 16px;
        align-items: end;
        flex-wrap: wrap;

        mat-form-field {
          min-width: 200px;
        }
      }
    }

    .key-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;

      .metric-card {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        &.placement-rate::before {
          background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
        }

        &.avg-package::before {
          background: linear-gradient(90deg, #2196F3 0%, #21CBF3 100%);
        }

        &.companies::before {
          background: linear-gradient(90deg, #FF9800 0%, #FFC107 100%);
        }

        &.students::before {
          background: linear-gradient(90deg, #9C27B0 0%, #E91E63 100%);
        }

        mat-card-content {
          padding: 24px !important;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;

          mat-icon {
            font-size: 2rem;
            width: 2rem;
            height: 2rem;
            opacity: 0.7;
          }

          h3 {
            margin: 0;
            font-size: 1.1rem;
            color: #666;
            font-weight: 500;
          }
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #333;
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          
          &.positive {
            color: #4CAF50;
          }

          mat-icon {
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }
    }

    .reports-tabs {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      .mat-mdc-tab-group {
        .mat-mdc-tab-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          
          .mat-mdc-tab {
            color: rgba(255, 255, 255, 0.8);
            
            &.mdc-tab--active {
              color: white;
            }
          }
        }
      }
    }

    .tab-content {
      padding: 32px;
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    }

    .chart-container {
      mat-card {
        height: 400px;
        
        mat-card-content {
          height: calc(100% - 64px);
          position: relative;
          
          canvas {
            max-height: 100%;
            width: 100% !important;
            height: auto !important;
          }
        }
      }
    }

    .company-table {
      grid-column: 1 / -1;
      
      .company-metrics-table {
        width: 100%;
        
        .status-verified {
          background: #e8f5e8;
          color: #2e7d32;
        }
        
        .status-pending {
          background: #fff3e0;
          color: #f57c00;
        }
        
        .status-rejected {
          background: #ffebee;
          color: #c62828;
        }
      }
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: 16px;
      }

      .key-metrics {
        grid-template-columns: 1fr;
      }

      .tab-content {
        grid-template-columns: 1fr;
        padding: 16px;
      }

      .filter-controls {
        flex-direction: column;
        align-items: stretch !important;
      }
    }
  `]
})
export class AdminReportsComponent implements OnInit {
  private reportsService = inject(ReportsService);
  @ViewChild('placementChart') placementChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('packageChart') packageChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('branchPackageChart') branchPackageChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('companyChart') companyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cgpaChart') cgpaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('skillChart') skillChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('locationChart') locationChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('industryChart') industryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeSeriesChart') timeSeriesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('successRateChart') successRateChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comparativeChart') comparativeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('predictiveChart') predictiveChartRef!: ElementRef<HTMLCanvasElement>;

  // Filter properties
  selectedYear = '2024-25';
  selectedBranch = 'all';

  // Key metrics
  placementRate = 87.5;
  placementRateChange = 5.2;
  avgPackage = 12.8;
  packageIncrease = 1.5;
  totalCompanies = 145;
  newCompanies = 23;
  totalStudents = 850;
  placedStudents = 744;

  // Table data
  companyColumns = ['companyName', 'studentsHired', 'avgPackage', 'maxPackage', 'status'];
  companyData: any[] = [];

  private charts: Chart[] = [];
  reportData: ReportData | null = null;

  ngOnInit(): void {
    this.loadReportData();
  }

  private loadReportData(): void {
    this.reportsService.getReportData(this.selectedYear, this.selectedBranch).subscribe(data => {
      this.reportData = data;
      this.updateMetrics(data);
      
      // Initialize charts after data is loaded
      setTimeout(() => {
        this.initializeCharts();
      }, 100);
    });
  }

  ngOnDestroy(): void {
    // Destroy all charts to prevent memory leaks
    this.charts.forEach(chart => chart.destroy());
  }

  onFilterChange(): void {
    console.log(`Filter changed: Year=${this.selectedYear}, Branch=${this.selectedBranch}`);
    // Reload data with new filters
    this.loadReportData();
  }

  private updateMetrics(data: ReportData): void {
    this.totalStudents = data.placement.overallMetrics.totalStudents;
    this.placedStudents = data.placement.overallMetrics.placedStudents;
    this.placementRate = data.placement.overallMetrics.placementRate;
    this.avgPackage = data.placement.overallMetrics.avgPackage;
    
    // Update table data
    this.companyData = data.company.companyMetrics;
    
    // Calculate dynamic metrics
    this.placementRateChange = 5.2; // This would be calculated from historical data
    this.packageIncrease = 1.5;
    this.totalCompanies = data.company.companyMetrics.length;
    this.newCompanies = 23; // This would come from the service
  }

  exportReports(): void {
    this.reportsService.exportReports('pdf').subscribe(blob => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `placement-reports-${this.selectedYear}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  private initializeCharts(): void {
    this.createPlacementChart();
    this.createTrendChart();
    this.createPackageChart();
    this.createBranchPackageChart();
    this.createCompanyChart();
    this.createCGPAChart();
    this.createSkillChart();
    this.createLocationChart();
    this.createIndustryChart();
    this.createTimeSeriesChart();
    this.createSuccessRateChart();
    this.createComparativeChart();
    this.createPredictiveChart();
  }

  private createPlacementChart(): void {
    const ctx = this.placementChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.reportData) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.reportData.placement.branchWiseRate.labels,
        datasets: [{
          label: 'Placement Rate (%)',
          data: this.reportData.placement.branchWiseRate.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Branch-wise Placement Statistics'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value: any) => value + '%'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createTrendChart(): void {
    const ctx = this.trendChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.reportData) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.reportData.placement.monthlyTrend.labels,
        datasets: [{
          label: 'Students Placed',
          data: this.reportData.placement.monthlyTrend.data,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Placement Progression'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createPackageChart(): void {
    const ctx = this.packageChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.reportData) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.reportData.company.packageDistribution.labels,
        datasets: [{
          data: this.reportData.company.packageDistribution.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Package Distribution'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createBranchPackageChart(): void {
    const ctx = this.branchPackageChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.reportData) return;

    const chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.reportData.student.branchWisePackage.labels,
        datasets: [{
          label: 'Average Package (LPA)',
          data: this.reportData.student.branchWisePackage.data,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          pointBackgroundColor: '#FF6384',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FF6384'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Branch-wise Package Analysis'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 20
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createCompanyChart(): void {
    const ctx = this.companyChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.reportData) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.reportData.company.topRecruiters.labels,
        datasets: [{
          label: 'Students Hired',
          data: this.reportData.company.topRecruiters.data,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Top Recruiting Companies'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createCGPAChart(): void {
    const ctx = this.cgpaChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.reportData) return;

    const chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'CGPA vs Package',
          data: this.reportData.student.cgpaVsPackage,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 8,
          pointHoverRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'CGPA vs Package Correlation'
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'CGPA'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Package (LPA)'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createSkillChart(): void {
    const ctx = this.skillChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Full Stack Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI/ML', 'Cybersecurity'],
        datasets: [{
          data: [156, 89, 67, 45, 78, 34],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Skill-wise Placement Distribution'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createLocationChart(): void {
    const ctx = this.locationChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai', 'Delhi NCR', 'Others'],
        datasets: [{
          data: [189, 145, 123, 98, 76, 67, 45],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#C9CBCF'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Location-wise Job Distribution'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createIndustryChart(): void {
    const ctx = this.industryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['IT Services', 'Product Companies', 'Banking & Finance', 'E-commerce', 'Healthcare', 'Manufacturing'],
        datasets: [{
          label: 'Number of Placements',
          data: [245, 189, 123, 98, 67, 45],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Industry-wise Placement Distribution'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createTimeSeriesChart(): void {
    const ctx = this.timeSeriesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25'],
        datasets: [
          {
            label: 'Placement Rate (%)',
            data: [72, 78, 82, 85, 88],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            yAxisID: 'y'
          },
          {
            label: 'Average Package (LPA)',
            data: [8.5, 9.2, 10.8, 11.3, 12.8],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Multi-Year Placement Trends'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Placement Rate (%)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Average Package (LPA)'
            },
            grid: {
              drawOnChartArea: false,
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createSuccessRateChart(): void {
    const ctx = this.successRateChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Applied', 'Shortlisted', 'Written Test', 'Technical Interview', 'HR Interview', 'Final Selection'],
        datasets: [{
          label: 'Success Rate (%)',
          data: [100, 65, 45, 35, 28, 22],
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(255, 152, 0, 0.8)',
            'rgba(255, 87, 34, 0.8)',
            'rgba(244, 67, 54, 0.8)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Interview Success Rate by Stage'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value: any) => value + '%'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createComparativeChart(): void {
    const ctx = this.comparativeChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CSE', 'ECE', 'ME', 'EEE', 'Civil', 'IT'],
        datasets: [
          {
            label: '2023-24',
            data: [89, 82, 75, 78, 68, 86],
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
          },
          {
            label: '2024-25',
            data: [92, 85, 78, 82, 70, 89],
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Year-over-Year Placement Comparison'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value: any) => value + '%'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createPredictiveChart(): void {
    const ctx = this.predictiveChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Current', '+1 Month', '+2 Months', '+3 Months', '+4 Months', '+5 Months'],
        datasets: [
          {
            label: 'Predicted Placements',
            data: [744, 780, 815, 845, 870, 890],
            borderColor: '#9C27B0',
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
            borderDash: [5, 5],
            fill: true
          },
          {
            label: 'Historical Trend',
            data: [744, null, null, null, null, null],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            pointRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Placement Probability Prediction'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 700,
            title: {
              display: true,
              text: 'Number of Students Placed'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private updateChartsWithFilteredData(): void {
    // Implement data filtering logic based on selectedYear and selectedBranch
    // This would typically involve API calls to get filtered data
    console.log('Updating charts with filtered data...');
  }
}