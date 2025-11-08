import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior';
  experienceRequired: string;
  salaryRange?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  skills: string[];
  postedDate: Date;
  applicationDeadline?: Date;
  openings: number;
  applicationsCount: number;
  status: 'active' | 'closed' | 'filled';
  remoteWork: boolean;
  education?: string;
  isBookmarked?: boolean;
  hasApplied?: boolean;
  matchScore?: number; // 0-100 percentage match with student profile
}

export interface JobFilters {
  search?: string;
  department?: string;
  location?: string;
  type?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  remoteWork?: boolean;
  postedWithin?: number; // days
}

export interface JobApplication {
  jobId: number;
  resume: File;
  coverLetter?: string;
  additionalInfo?: string;
  expectedSalary?: number;
  availability?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private mockJobs: Job[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      companyLogo: 'assets/images/companies/microsoft.png',
      department: 'Engineering',
      location: 'Bangalore, Karnataka',
      type: 'full-time',
      experienceLevel: 'senior',
      experienceRequired: '5+ years',
      salaryRange: '₹15,00,000 - ₹25,00,000',
      salaryMin: 1500000,
      salaryMax: 2500000,
      description: 'We are seeking an experienced Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of professional software development experience',
        'Strong proficiency in JavaScript, TypeScript, and modern frameworks (Angular, React)',
        'Experience with Node.js and backend development',
        'Solid understanding of RESTful APIs and microservices architecture',
        'Experience with SQL and NoSQL databases',
        'Excellent problem-solving and communication skills'
      ],
      responsibilities: [
        'Design and develop high-quality, scalable software solutions',
        'Collaborate with cross-functional teams to define and implement new features',
        'Write clean, maintainable, and well-documented code',
        'Perform code reviews and mentor junior developers',
        'Troubleshoot and debug complex issues',
        'Stay up-to-date with emerging technologies and best practices'
      ],
      benefits: [
        'Competitive salary and performance bonuses',
        'Health insurance for you and your family',
        'Flexible working hours and remote work options',
        'Professional development budget',
        'Stock options',
        'Annual company retreats'
      ],
      skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'MongoDB', 'AWS'],
      postedDate: new Date('2024-11-01'),
      applicationDeadline: new Date('2024-11-30'),
      openings: 3,
      applicationsCount: 45,
      status: 'active',
      remoteWork: true,
      education: 'Bachelor\'s or Master\'s in Computer Science',
      matchScore: 92
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Digital Innovations',
      companyLogo: 'assets/images/companies/google.png',
      department: 'Web Development',
      location: 'Mumbai, Maharashtra',
      type: 'full-time',
      experienceLevel: 'mid',
      experienceRequired: '2-4 years',
      salaryRange: '₹8,00,000 - ₹12,00,000',
      salaryMin: 800000,
      salaryMax: 1200000,
      description: 'Join our dynamic team as a Frontend Developer and create stunning user interfaces for our web applications. You will work with the latest technologies and collaborate with designers and backend developers.',
      requirements: [
        'Bachelor\'s degree in Computer Science or equivalent',
        '2-4 years of frontend development experience',
        'Expert knowledge of HTML5, CSS3, and JavaScript',
        'Strong experience with Angular or React',
        'Understanding of responsive design and mobile-first approach',
        'Familiarity with version control systems (Git)',
        'Good communication and teamwork skills'
      ],
      responsibilities: [
        'Develop responsive and interactive user interfaces',
        'Implement designs provided by the UI/UX team',
        'Optimize applications for maximum speed and scalability',
        'Collaborate with backend developers for API integration',
        'Write unit tests and ensure code quality',
        'Participate in agile development processes'
      ],
      benefits: [
        'Competitive compensation',
        'Health and wellness benefits',
        'Learning and development opportunities',
        'Work-from-home flexibility',
        'Team outings and events'
      ],
      skills: ['HTML', 'CSS', 'JavaScript', 'Angular', 'React', 'Responsive Design'],
      postedDate: new Date('2024-11-05'),
      applicationDeadline: new Date('2024-12-05'),
      openings: 2,
      applicationsCount: 28,
      status: 'active',
      remoteWork: true,
      education: 'Bachelor\'s in Computer Science or related field',
      matchScore: 85
    },
    {
      id: 3,
      title: 'Full Stack Developer Intern',
      company: 'StartUp Hub',
      companyLogo: 'assets/images/companies/amazon.png',
      department: 'Technology',
      location: 'Hyderabad, Telangana',
      type: 'internship',
      experienceLevel: 'entry',
      experienceRequired: 'Fresher',
      salaryRange: '₹15,000 - ₹25,000 per month',
      salaryMin: 15000,
      salaryMax: 25000,
      description: 'Exciting opportunity for fresh graduates to kickstart their career in full stack development. You will work on real-world projects and learn from experienced developers.',
      requirements: [
        'Recent graduate or final year student in Computer Science/IT',
        'Basic knowledge of frontend and backend technologies',
        'Familiarity with JavaScript frameworks',
        'Understanding of databases and APIs',
        'Eager to learn and adapt to new technologies',
        'Good problem-solving skills'
      ],
      responsibilities: [
        'Assist in developing web applications',
        'Write clean and maintainable code',
        'Participate in code reviews and team meetings',
        'Learn and implement best practices',
        'Contribute to documentation',
        'Work on assigned tasks and meet deadlines'
      ],
      benefits: [
        'Hands-on experience with real projects',
        'Mentorship from senior developers',
        'Certificate of completion',
        'Potential for full-time conversion',
        'Flexible working hours'
      ],
      skills: ['JavaScript', 'HTML', 'CSS', 'Node.js', 'MongoDB', 'Git'],
      postedDate: new Date('2024-11-07'),
      applicationDeadline: new Date('2024-11-25'),
      openings: 5,
      applicationsCount: 67,
      status: 'active',
      remoteWork: false,
      education: 'Bachelor\'s in Computer Science/IT (Final year or Graduate)',
      matchScore: 78
    },
    {
      id: 4,
      title: 'Data Analyst',
      company: 'Analytics Pro',
      companyLogo: 'assets/images/companies/infosys.png',
      department: 'Data Science',
      location: 'Pune, Maharashtra',
      type: 'full-time',
      experienceLevel: 'mid',
      experienceRequired: '2-3 years',
      salaryRange: '₹7,00,000 - ₹11,00,000',
      salaryMin: 700000,
      salaryMax: 1100000,
      description: 'We are looking for a skilled Data Analyst to join our team and help transform data into actionable insights. You will work with large datasets and create reports and visualizations.',
      requirements: [
        'Bachelor\'s degree in Statistics, Mathematics, or Computer Science',
        '2-3 years of experience in data analysis',
        'Proficiency in SQL and data visualization tools',
        'Experience with Python or R for data analysis',
        'Strong analytical and problem-solving skills',
        'Excellent communication skills'
      ],
      responsibilities: [
        'Collect, clean, and analyze large datasets',
        'Create dashboards and reports using visualization tools',
        'Identify trends and patterns in data',
        'Collaborate with stakeholders to understand requirements',
        'Present findings and recommendations',
        'Maintain data quality and integrity'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Professional training and certifications',
        'Work-life balance',
        'Performance bonuses'
      ],
      skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Statistics'],
      postedDate: new Date('2024-11-03'),
      applicationDeadline: new Date('2024-11-28'),
      openings: 2,
      applicationsCount: 34,
      status: 'active',
      remoteWork: true,
      education: 'Bachelor\'s in Statistics, Mathematics, or CS',
      matchScore: 88
    },
    {
      id: 5,
      title: 'UI/UX Designer',
      company: 'Creative Designs Ltd.',
      companyLogo: 'assets/images/companies/accenture.png',
      department: 'Design',
      location: 'Bangalore, Karnataka',
      type: 'full-time',
      experienceLevel: 'mid',
      experienceRequired: '3-5 years',
      salaryRange: '₹9,00,000 - ₹14,00,000',
      salaryMin: 900000,
      salaryMax: 1400000,
      description: 'Join our design team to create beautiful and intuitive user experiences. You will work on various projects and collaborate with product managers and developers.',
      requirements: [
        'Bachelor\'s degree in Design or related field',
        '3-5 years of UI/UX design experience',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Strong portfolio showcasing design projects',
        'Understanding of user-centered design principles',
        'Experience with prototyping and user testing'
      ],
      responsibilities: [
        'Design user interfaces for web and mobile applications',
        'Create wireframes, prototypes, and mockups',
        'Conduct user research and usability testing',
        'Collaborate with developers to implement designs',
        'Maintain design systems and style guides',
        'Stay updated with design trends and best practices'
      ],
      benefits: [
        'Competitive salary package',
        'Health and wellness benefits',
        'Creative work environment',
        'Latest design tools and software',
        'Flexible working hours'
      ],
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
      postedDate: new Date('2024-11-02'),
      applicationDeadline: new Date('2024-12-02'),
      openings: 2,
      applicationsCount: 41,
      status: 'active',
      remoteWork: true,
      education: 'Bachelor\'s in Design or related field',
      matchScore: 75
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Systems Inc.',
      companyLogo: 'assets/images/companies/tcs.png',
      department: 'Infrastructure',
      location: 'Chennai, Tamil Nadu',
      type: 'full-time',
      experienceLevel: 'senior',
      experienceRequired: '4+ years',
      salaryRange: '₹12,00,000 - ₹18,00,000',
      salaryMin: 1200000,
      salaryMax: 1800000,
      description: 'We need an experienced DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will work with cutting-edge technologies and ensure smooth deployment processes.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '4+ years of DevOps experience',
        'Strong knowledge of AWS, Azure, or GCP',
        'Experience with Docker and Kubernetes',
        'Proficiency in scripting languages (Python, Bash)',
        'Experience with CI/CD tools (Jenkins, GitLab CI)',
        'Understanding of infrastructure as code'
      ],
      responsibilities: [
        'Design and maintain cloud infrastructure',
        'Implement and manage CI/CD pipelines',
        'Monitor system performance and troubleshoot issues',
        'Automate deployment processes',
        'Ensure security and compliance',
        'Collaborate with development teams'
      ],
      benefits: [
        'Excellent compensation',
        'Health and life insurance',
        'Learning budget for certifications',
        'Remote work options',
        'Stock options'
      ],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Python', 'Linux'],
      postedDate: new Date('2024-10-30'),
      applicationDeadline: new Date('2024-11-27'),
      openings: 1,
      applicationsCount: 52,
      status: 'active',
      remoteWork: true,
      education: 'Bachelor\'s in Computer Science',
      matchScore: 81
    }
  ];

  constructor() {}

  // Get all jobs with optional filters
  getJobs(filters?: JobFilters): Observable<Job[]> {
    let filteredJobs = [...this.mockJobs];

    if (filters) {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );
      }

      // Department filter
      if (filters.department) {
        filteredJobs = filteredJobs.filter(job => job.department === filters.department);
      }

      // Location filter
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => job.location.includes(filters.location!));
      }

      // Type filter
      if (filters.type && filters.type.length > 0) {
        filteredJobs = filteredJobs.filter(job => filters.type!.includes(job.type));
      }

      // Experience level filter
      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        filteredJobs = filteredJobs.filter(job => filters.experienceLevel!.includes(job.experienceLevel));
      }

      // Salary filter
      if (filters.salaryMin !== undefined) {
        filteredJobs = filteredJobs.filter(job => 
          job.salaryMax ? job.salaryMax >= filters.salaryMin! : true
        );
      }

      if (filters.salaryMax !== undefined) {
        filteredJobs = filteredJobs.filter(job => 
          job.salaryMin ? job.salaryMin <= filters.salaryMax! : true
        );
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job =>
          filters.skills!.some(skill => 
            job.skills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
          )
        );
      }

      // Remote work filter
      if (filters.remoteWork !== undefined) {
        filteredJobs = filteredJobs.filter(job => job.remoteWork === filters.remoteWork);
      }

      // Posted within filter (days)
      if (filters.postedWithin) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - filters.postedWithin);
        filteredJobs = filteredJobs.filter(job => new Date(job.postedDate) >= cutoffDate);
      }
    }

    // Simulate API delay
    return of(filteredJobs).pipe(delay(500));
  }

  // Get job by ID
  getJobById(id: number): Observable<Job | undefined> {
    const job = this.mockJobs.find(j => j.id === id);
    return of(job).pipe(delay(300));
  }

  // Apply to a job
  applyToJob(application: JobApplication): Observable<{ success: boolean; message: string }> {
    // Simulate API call
    return of({
      success: true,
      message: 'Application submitted successfully!'
    }).pipe(delay(1000));
  }

  // Bookmark a job
  toggleBookmark(jobId: number): Observable<boolean> {
    const job = this.mockJobs.find(j => j.id === jobId);
    if (job) {
      job.isBookmarked = !job.isBookmarked;
      return of(job.isBookmarked).pipe(delay(200));
    }
    return of(false);
  }

  // Get bookmarked jobs
  getBookmarkedJobs(): Observable<Job[]> {
    const bookmarked = this.mockJobs.filter(job => job.isBookmarked);
    return of(bookmarked).pipe(delay(300));
  }

  // Get recommended jobs (based on match score)
  getRecommendedJobs(limit: number = 5): Observable<Job[]> {
    const recommended = [...this.mockJobs]
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, limit);
    return of(recommended).pipe(delay(400));
  }

  // Get unique departments
  getDepartments(): Observable<string[]> {
    const departments = [...new Set(this.mockJobs.map(job => job.department))];
    return of(departments);
  }

  // Get unique locations
  getLocations(): Observable<string[]> {
    const locations = [...new Set(this.mockJobs.map(job => job.location))];
    return of(locations);
  }

  // Get unique skills
  getSkills(): Observable<string[]> {
    const skills = [...new Set(this.mockJobs.flatMap(job => job.skills))];
    return of(skills);
  }
}
