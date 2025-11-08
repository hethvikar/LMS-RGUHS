import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ReportData {
  placement: PlacementReportData;
  company: CompanyReportData;
  student: StudentReportData;
  geographic: GeographicReportData;
  industry: IndustryReportData;
  trends: TrendReportData;
}

export interface PlacementReportData {
  branchWiseRate: {
    labels: string[];
    data: number[];
  };
  monthlyTrend: {
    labels: string[];
    data: number[];
  };
  overallMetrics: {
    totalStudents: number;
    placedStudents: number;
    placementRate: number;
    avgPackage: number;
    maxPackage: number;
    minPackage: number;
  };
}

export interface CompanyReportData {
  topRecruiters: {
    labels: string[];
    data: number[];
  };
  companyMetrics: {
    companyName: string;
    studentsHired: number;
    avgPackage: number;
    maxPackage: number;
    industry: string;
    status: 'verified' | 'pending' | 'rejected';
  }[];
  packageDistribution: {
    labels: string[];
    data: number[];
  };
}

export interface StudentReportData {
  cgpaVsPackage: {
    x: number;
    y: number;
  }[];
  skillDistribution: {
    labels: string[];
    data: number[];
  };
  branchWisePackage: {
    labels: string[];
    data: number[];
  };
}

export interface GeographicReportData {
  locationDistribution: {
    labels: string[];
    data: number[];
  };
  stateWisePlacement: {
    labels: string[];
    data: number[];
  };
}

export interface IndustryReportData {
  industryDistribution: {
    labels: string[];
    data: number[];
  };
  industryGrowth: {
    labels: string[];
    current: number[];
    previous: number[];
  };
}

export interface TrendReportData {
  yearOverYear: {
    labels: string[];
    placementRate: number[];
    avgPackage: number[];
  };
  monthlyProgress: {
    labels: string[];
    target: number[];
    actual: number[];
  };
  successRateByStage: {
    labels: string[];
    data: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }

  getReportData(year: string = '2024-25', branch: string = 'all'): Observable<ReportData> {
    // This would typically make HTTP calls to your backend API
    // For now, returning comprehensive mock data
    
    const mockData: ReportData = {
      placement: {
        branchWiseRate: {
          labels: ['Computer Science', 'Electronics', 'Mechanical', 'Electrical', 'Civil', 'Information Technology'],
          data: [92, 85, 78, 82, 70, 89]
        },
        monthlyTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [45, 67, 89, 123, 156, 189, 234, 278, 312, 345, 378, 402]
        },
        overallMetrics: {
          totalStudents: 850,
          placedStudents: 744,
          placementRate: 87.5,
          avgPackage: 12.8,
          maxPackage: 55.0,
          minPackage: 3.5
        }
      },
      company: {
        topRecruiters: {
          labels: ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Microsoft', 'Google', 'Accenture', 'IBM'],
          data: [42, 35, 28, 12, 6, 4, 25, 18]
        },
        companyMetrics: [
          {
            companyName: 'Tata Consultancy Services',
            studentsHired: 42,
            avgPackage: 8.5,
            maxPackage: 12.0,
            industry: 'IT Services',
            status: 'verified'
          },
          {
            companyName: 'Infosys Limited',
            studentsHired: 35,
            avgPackage: 9.2,
            maxPackage: 15.0,
            industry: 'IT Services',
            status: 'verified'
          },
          {
            companyName: 'Amazon India',
            studentsHired: 12,
            avgPackage: 28.5,
            maxPackage: 45.0,
            industry: 'E-commerce',
            status: 'verified'
          },
          {
            companyName: 'Microsoft India',
            studentsHired: 6,
            avgPackage: 35.2,
            maxPackage: 55.0,
            industry: 'Technology',
            status: 'verified'
          },
          {
            companyName: 'Wipro Technologies',
            studentsHired: 28,
            avgPackage: 7.8,
            maxPackage: 11.5,
            industry: 'IT Services',
            status: 'pending'
          }
        ],
        packageDistribution: {
          labels: ['3-6 LPA', '6-10 LPA', '10-15 LPA', '15-25 LPA', '25+ LPA'],
          data: [145, 234, 178, 89, 34]
        }
      },
      student: {
        cgpaVsPackage: [
          { x: 6.5, y: 4.5 },
          { x: 7.2, y: 6.8 },
          { x: 7.8, y: 8.2 },
          { x: 8.1, y: 12.5 },
          { x: 8.5, y: 15.2 },
          { x: 8.9, y: 18.7 },
          { x: 9.2, y: 25.3 },
          { x: 9.5, y: 32.1 },
          { x: 9.7, y: 45.0 }
        ],
        skillDistribution: {
          labels: ['Full Stack Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI/ML', 'Cybersecurity'],
          data: [156, 89, 67, 45, 78, 34]
        },
        branchWisePackage: {
          labels: ['CSE', 'ECE', 'ME', 'EEE', 'Civil', 'IT'],
          data: [16.5, 12.8, 8.9, 10.2, 7.5, 14.2]
        }
      },
      geographic: {
        locationDistribution: {
          labels: ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai', 'Delhi NCR', 'Others'],
          data: [189, 145, 123, 98, 76, 67, 45]
        },
        stateWisePlacement: {
          labels: ['Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Gujarat'],
          data: [245, 189, 156, 134, 89, 67]
        }
      },
      industry: {
        industryDistribution: {
          labels: ['IT Services', 'Product Companies', 'Banking & Finance', 'E-commerce', 'Healthcare', 'Manufacturing'],
          data: [245, 189, 123, 98, 67, 45]
        },
        industryGrowth: {
          labels: ['IT Services', 'Product Companies', 'Banking', 'E-commerce', 'Healthcare'],
          current: [245, 189, 123, 98, 67],
          previous: [198, 145, 105, 78, 52]
        }
      },
      trends: {
        yearOverYear: {
          labels: ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25'],
          placementRate: [72, 78, 82, 85, 88],
          avgPackage: [8.5, 9.2, 10.8, 11.3, 12.8]
        },
        monthlyProgress: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          target: [400, 450, 500, 550, 600, 650],
          actual: [378, 420, 485, 520, 578, 620]
        },
        successRateByStage: {
          labels: ['Applied', 'Shortlisted', 'Written Test', 'Technical Interview', 'HR Interview', 'Final Selection'],
          data: [100, 65, 45, 35, 28, 22]
        }
      }
    };

    // Apply filters based on year and branch
    if (branch !== 'all') {
      // Filter data for specific branch
      // This would involve more complex filtering logic in a real application
      console.log(`Filtering data for branch: ${branch}`);
    }

    return of(mockData);
  }

  exportReports(format: 'pdf' | 'excel' | 'csv'): Observable<Blob> {
    // This would generate and return report files
    console.log(`Exporting reports in ${format} format`);
    
    // Mock implementation - in real scenario, you'd generate actual files
    const mockBlob = new Blob(['Mock report data'], { type: 'text/plain' });
    return of(mockBlob);
  }

  getPredictiveAnalytics(): Observable<any> {
    // Mock predictive analytics data
    const predictiveData = {
      placementPrediction: {
        labels: ['Current', '+1 Month', '+2 Months', '+3 Months', '+4 Months', '+5 Months'],
        predicted: [744, 780, 815, 845, 870, 890],
        confidence: [100, 85, 78, 72, 68, 62]
      },
      trendAnalysis: {
        upwardTrend: ['CSE', 'IT', 'Data Science roles'],
        downwardTrend: ['Mechanical', 'Civil'],
        stableTrend: ['ECE', 'EEE']
      },
      recommendations: [
        'Focus on skill development programs for Mechanical and Civil branches',
        'Increase outreach to product-based companies',
        'Implement specialized training for emerging technologies',
        'Strengthen alumni network for referrals'
      ]
    };

    return of(predictiveData);
  }

  getCompanyEngagementMetrics(): Observable<any> {
    // Company engagement and satisfaction metrics
    const engagementData = {
      companyRetention: {
        labels: ['TCS', 'Infosys', 'Amazon', 'Microsoft', 'Wipro'],
        retentionRate: [95, 92, 88, 94, 90],
        yearsAssociated: [8, 6, 4, 3, 7]
      },
      satisfactionScore: {
        overall: 4.2,
        categories: {
          'Student Quality': 4.5,
          'Communication': 4.0,
          'Process Efficiency': 4.1,
          'Support Services': 3.9
        }
      },
      newCompanyAcquisition: {
        monthly: [2, 4, 6, 3, 5, 7],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      }
    };

    return of(engagementData);
  }

  getRealTimeMetrics(): Observable<any> {
    // Real-time dashboard metrics
    const realTimeData = {
      activeInterviews: 23,
      pendingApplications: 156,
      todaysPlacements: 8,
      upcomingDrives: 12,
      recentActivity: [
        { type: 'placement', message: 'John Doe placed at Amazon', time: '2 minutes ago' },
        { type: 'interview', message: 'Technical interview scheduled with Microsoft', time: '15 minutes ago' },
        { type: 'company', message: 'New company registration: TechCorp', time: '1 hour ago' }
      ]
    };

    return of(realTimeData);
  }
}