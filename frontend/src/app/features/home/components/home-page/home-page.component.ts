import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { SecurityService } from '../../../../core/services/security/security.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { LoginModalComponent } from '../../../../shared/components/modals/login-modal/login-modal.component';
import { SignupModalComponent } from '../../../../shared/components/modals/signup-modal/signup-modal.component';
import { PlaceholderImages } from '../../../../core/services/placeholder-images';

interface PlacementPhoto {
  id: number;
  url: string;
  alt: string;
  caption: string;
}

interface StudentProfile {
  id: number;
  name: string;
  photo: string;
  company: string;
  package: string;
  course: string;
  year: number;
  testimonial: string;
}

interface Company {
  id: number;
  name: string;
  logo: string;
  industry: string;
  website: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  photo: string;
  rating: number;
  text: string;
  date: Date;
}

interface Certificate {
  id: number;
  title: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, LoginModalComponent, SignupModalComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('800ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ opacity: 0, transform: 'translateX(-30px)' })),
      transition(':enter', [
        animate('700ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('carouselAnimation', [
      transition('* => *', [
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class HomePageComponent implements OnInit, OnDestroy {
  // Gallery data - using data URIs to prevent loading issues
  placementPhotos: PlacementPhoto[] = (() => {
    const images = PlaceholderImages.getGalleryImages();
    const captions = [
      { alt: 'Campus Placement Drive 2024', caption: 'Annual Campus Placement Drive' },
      { alt: 'Company Interaction Session', caption: 'Industry Expert Interaction' },
      { alt: 'Student Interview Process', caption: 'Technical Interview Round' },
      { alt: 'Offer Letter Distribution', caption: 'Celebrating Success Stories' },
      { alt: 'Skill Development Workshop', caption: 'Pre-placement Training' },
      { alt: 'Group Discussion Round', caption: 'GD and Team Activities' },
      { alt: 'Technical Workshop', caption: 'Industry Expert Tech Talk' },
      { alt: 'Mock Interview Session', caption: 'Professional Interview Preparation' }
    ];
    return images.map((url, index) => ({
      id: index + 1,
      url,
      alt: captions[index].alt,
      caption: captions[index].caption
    }));
  })();

  // Gallery carousel state
  galleryCurrentIndex = 0;
  galleryAutoScrollInterval: any;
  
  // Active navigation section
  activeSection: string = 'home';
  
  // Scroll listener
  private scrollListener: (() => void) | null = null;

  // Selected students carousel - using data URIs for avatars
  selectedStudents: StudentProfile[] = (() => {
    const avatars = PlaceholderImages.getStudentAvatars();
    const profiles = [
      { name: 'Rajesh Kumar', company: 'Google India', package: '₹42 LPA', course: 'B.Tech CSE', testimonial: 'The placement cell provided excellent guidance throughout the process.' },
      { name: 'Priya Sharma', company: 'Microsoft', package: '₹38 LPA', course: 'B.Tech IT', testimonial: 'Outstanding support from mentors and industry experts.' },
      { name: 'Arun Patel', company: 'Amazon', package: '₹35 LPA', course: 'MCA', testimonial: 'The training programs were instrumental in my success.' },
      { name: 'Sneha Reddy', company: 'Infosys', package: '₹18 LPA', course: 'B.Tech ECE', testimonial: 'Grateful for the comprehensive placement support.' }
    ];
    return profiles.map((profile, index) => ({
      id: index + 1,
      ...profile,
      photo: avatars[index],
      year: 2024
    }));
  })();

  // Registered companies - using real logo URLs from Clearbit API
  companies: Company[] = (() => {
    // Use real company logos from public CDN (Clearbit)
    const realLogos = PlaceholderImages.getRealCompanyLogoUrls();
    const companyData = [
      { name: 'Google', industry: 'Technology', website: 'https://google.com' },
      { name: 'Microsoft', industry: 'Technology', website: 'https://microsoft.com' },
      { name: 'Amazon', industry: 'E-commerce', website: 'https://amazon.com' },
      { name: 'Infosys', industry: 'IT Services', website: 'https://infosys.com' },
      { name: 'TCS', industry: 'IT Services', website: 'https://tcs.com' },
      { name: 'Wipro', industry: 'IT Services', website: 'https://wipro.com' },
      { name: 'Accenture', industry: 'Consulting', website: 'https://accenture.com' },
      { name: 'Cognizant', industry: 'IT Services', website: 'https://cognizant.com' }
    ];
    return companyData.map((company, index) => ({
      id: index + 1,
      ...company,
      logo: realLogos[index] // Real company logos from Clearbit CDN
    }));
  })();

  // Testimonials - using data URIs for avatars
  testimonials: Testimonial[] = (() => {
    const avatars = PlaceholderImages.getTestimonialAvatars();
    const testimonialData = [
      {
        name: 'Vikram Singh',
        role: 'Software Engineer at Google',
        text: 'The placement cell at RGUHS transformed my career. Their professional approach and industry connections made all the difference.',
        date: new Date('2024-01-15')
      },
      {
        name: 'Anita Desai',
        role: 'Data Analyst at Microsoft',
        text: 'Exceptional guidance and support. The mock interviews and resume workshops were extremely helpful.',
        date: new Date('2024-02-20')
      },
      {
        name: 'Karthik Iyer',
        role: 'Cloud Engineer at Amazon',
        text: 'Best placement cell experience. They prepare you not just for interviews but for your entire career.',
        date: new Date('2024-03-10')
      }
    ];
    return testimonialData.map((testimonial, index) => ({
      id: index + 1,
      ...testimonial,
      photo: avatars[index],
      rating: 5
    }));
  })();

  // Certificates - using data URIs
  certificates: Certificate[] = (() => {
    const images = PlaceholderImages.getCertificates();
    const certData = [
      { title: 'NAAC A+ Accreditation', description: 'National Assessment and Accreditation Council Grade A+' },
      { title: 'NBA Accreditation', description: 'National Board of Accreditation for Engineering Programs' },
      { title: 'Best Placement Award 2024', description: 'Excellence in Campus Placements' }
    ];
    return certData.map((cert, index) => ({
      id: index + 1,
      ...cert,
      image: images[index]
    }));
  })();

  // Carousel state
  currentStudentIndex = 0;
  currentTestimonialIndex = 0;
  private carouselInterval: any;
  private isBrowser: boolean;

  // Modal states
  showLoginModal = false;
  showSignupModal = false;
  selectedLoginRole?: string;

  // Statistics
  stats = {
    totalStudentsPlaced: 850,
    averagePackage: '12.5 LPA',
    highestPackage: '42 LPA',
    companiesVisited: 120
  };

  constructor(
    private securityService: SecurityService,
    private authService: AuthService,
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.setupSEO();
    this.startCarousel();
    this.startGalleryAutoScroll();
    this.setupSecurityHeaders();
    this.setupScrollSpy();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    if (this.galleryAutoScrollInterval) {
      clearInterval(this.galleryAutoScrollInterval);
    }
    if (this.scrollListener && this.isBrowser) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Setup scroll spy to track active section
   */
  private setupScrollSpy(): void {
    if (!this.isBrowser) return;
    
    this.scrollListener = () => {
      const sections = ['home', 'gallery', 'placements', 'companies', 'testimonials'];
      const scrollPosition = window.scrollY + 100; // Offset for header
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          this.activeSection = sections[i];
          break;
        }
      }
    };
    
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  /**
   * Setup SEO meta tags for better search engine optimization
   */
  private setupSEO(): void {
    // Title
    this.title.setTitle('RGUHS Placement Cell - Premier Campus Placement Portal | Login & Registration');

    // Meta tags
    this.meta.addTags([
      { name: 'description', content: 'RGUHS Placement Cell - Official campus placement portal for students and companies. Register, login, view placement statistics, student profiles, and success stories. Join 850+ successfully placed students.' },
      { name: 'keywords', content: 'RGUHS placement, campus placement, student login, company registration, placement cell, job opportunities, career services, RGUHS careers, student placement, recruitment' },
      { name: 'author', content: 'RGUHS Placement Cell' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { charset: 'UTF-8' },
      
      // Open Graph tags
      { property: 'og:title', content: 'RGUHS Placement Cell - Premier Campus Placement Portal' },
      { property: 'og:description', content: 'Join 850+ successfully placed students. Access student login, company registration, and explore placement opportunities.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://placements.rguhs.edu.in' },
      { property: 'og:image', content: 'https://placements.rguhs.edu.in/assets/images/og-image.jpg' },
      { property: 'og:site_name', content: 'RGUHS Placement Cell' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'RGUHS Placement Cell' },
      { name: 'twitter:description', content: 'Premier campus placement portal with 850+ successful placements' },
      { name: 'twitter:image', content: 'https://placements.rguhs.edu.in/assets/images/twitter-card.jpg' },
      
      // Additional SEO tags
      { name: 'theme-color', content: '#1976d2' },
      { name: 'msapplication-TileColor', content: '#1976d2' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ]);

    // Structured data for rich snippets
    if (this.isBrowser) {
      this.addStructuredData();
    }
  }

  /**
   * Add JSON-LD structured data for search engines
   */
  private addStructuredData(): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      'name': 'RGUHS Placement Cell',
      'description': 'Official campus placement portal for RGUHS students and recruiting companies',
      'url': 'https://placements.rguhs.edu.in',
      'logo': 'https://placements.rguhs.edu.in/assets/images/logo.png',
      'sameAs': [
        'https://facebook.com/rguhs',
        'https://twitter.com/rguhs',
        'https://linkedin.com/school/rguhs'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91-80-XXXX-XXXX',
        'contactType': 'Placement Office',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi', 'Kannada']
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'RGUHS Campus',
        'addressLocality': 'Bangalore',
        'addressRegion': 'Karnataka',
        'postalCode': '560001',
        'addressCountry': 'IN'
      }
    });
    document.head.appendChild(script);
  }

  /**
   * Setup security headers
   */
  private setupSecurityHeaders(): void {
    const headers = this.securityService.getSecureHeaders();
    // Note: These headers should ideally be set on the server side
    console.log('Security Headers Configuration:', headers);
  }

  /**
   * Start automatic carousel rotation with optimized timing
   */
  private startCarousel(): void {
    if (this.isBrowser) {
      // Increased interval to 6 seconds for smoother user experience
      this.carouselInterval = setInterval(() => {
        this.nextStudent();
        this.nextTestimonial();
      }, 6000);
    }
  }

  /**
   * Navigate to next student
   */
  nextStudent(): void {
    this.currentStudentIndex = (this.currentStudentIndex + 1) % this.selectedStudents.length;
  }

  /**
   * Navigate to previous student
   */
  previousStudent(): void {
    this.currentStudentIndex = this.currentStudentIndex === 0 
      ? this.selectedStudents.length - 1 
      : this.currentStudentIndex - 1;
  }

  /**
   * Navigate to specific student
   */
  goToStudent(index: number): void {
    this.currentStudentIndex = index;
  }

  /**
   * Navigate to next testimonial
   */
  nextTestimonial(): void {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  /**
   * Get visible gallery items (4 at a time)
   */
  get visibleGalleryPhotos(): PlacementPhoto[] {
    const itemsPerSlide = 4;
    const startIndex = this.galleryCurrentIndex;
    return this.placementPhotos.slice(startIndex, startIndex + itemsPerSlide);
  }

  /**
   * Navigate to next gallery slide
   */
  nextGallerySlide(): void {
    const itemsPerSlide = 4;
    const maxIndex = Math.max(0, this.placementPhotos.length - itemsPerSlide);
    this.galleryCurrentIndex = this.galleryCurrentIndex >= maxIndex ? 0 : this.galleryCurrentIndex + 1;
  }

  /**
   * Navigate to previous gallery slide
   */
  previousGallerySlide(): void {
    const itemsPerSlide = 4;
    const maxIndex = Math.max(0, this.placementPhotos.length - itemsPerSlide);
    this.galleryCurrentIndex = this.galleryCurrentIndex <= 0 ? maxIndex : this.galleryCurrentIndex - 1;
  }

  /**
   * Start auto-scroll for gallery
   */
  startGalleryAutoScroll(): void {
    if (this.isBrowser) {
      this.galleryAutoScrollInterval = setInterval(() => {
        this.nextGallerySlide();
      }, 4000); // 4 seconds per slide
    }
  }

  /**
   * Stop auto-scroll for gallery
   */
  stopGalleryAutoScroll(): void {
    if (this.galleryAutoScrollInterval) {
      clearInterval(this.galleryAutoScrollInterval);
    }
  }

  /**
   * Navigate to previous testimonial
   */
  previousTestimonial(): void {
    this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonialIndex - 1;
  }

  /**
   * Get visible students for carousel
   */
  getVisibleStudents(): StudentProfile[] {
    const visible: StudentProfile[] = [];
    for (let i = 0; i < 3; i++) {
      const index = (this.currentStudentIndex + i) % this.selectedStudents.length;
      visible.push(this.selectedStudents[index]);
    }
    return visible;
  }

  /**
   * Get star array for rating
   */
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  /**
   * Handle image loading error - use SVG placeholder fallback
   */
  onImageError(event: any): void {
    // Use default SVG placeholder instead of file-based image
    event.target.src = PlaceholderImages.getDefaultPlaceholder();
    // Prevent infinite error loop
    event.target.onerror = null;
  }

  /**
   * Sanitize external URLs
   */
  sanitizeUrl(url: string): any {
    return this.securityService.sanitizeUrl(url);
  }

  /**
   * Track by function for performance
   */
  trackById(index: number, item: any): number {
    return item.id;
  }

  /**
   * Scroll to section and update active state
   */
  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        // Temporarily disable scroll listener to prevent conflicts
        if (this.scrollListener) {
          window.removeEventListener('scroll', this.scrollListener);
        }
        
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Re-enable scroll listener after scrolling is complete
        setTimeout(() => {
          if (this.scrollListener && this.isBrowser) {
            window.addEventListener('scroll', this.scrollListener, { passive: true });
          }
        }, 1000);
      }
    }
  }

  /**
   * Get gradient class for company logo wrapper
   */
  getCompanyGradientClass(companyId: number): string {
    const gradientClasses = ['', 'gradient-ocean', 'gradient-sunset', 'gradient-emerald', 'glass-enhanced'];
    return gradientClasses[companyId % gradientClasses.length];
  }

  /**
   * Open login modal - but first check if user is already authenticated
   */
  openLoginModal(role?: string): void {
    // Check if user is already authenticated
    if (this.checkAndRedirectIfAuthenticated()) {
      return;
    }

    this.selectedLoginRole = role;
    this.showLoginModal = true;
    this.showSignupModal = false;
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Check if user is authenticated and redirect if so
   * @returns true if user was redirected, false otherwise
   */
  private checkAndRedirectIfAuthenticated(): boolean {
    const authCheck = this.authService.isAuthenticatedWithValidRole();
    
    if (authCheck.isValid && authCheck.user && authCheck.shouldRedirect) {
      // User is already authenticated with valid role, redirect to appropriate dashboard
      this.redirectBasedOnRole(authCheck.user.role);
      return true;
    }
    return false;
  }

  /**
   * Redirect user based on their role
   */
  private redirectBasedOnRole(role: string): void {
    const r = String(role || '').toLowerCase();
    switch (r) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'instructor':
        this.router.navigate(['/lms']);
        break;
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'company':
        this.router.navigate(['/company']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Open login modal with Student role preselected
   */
  openStudentLoginModal(): void {
    this.openLoginModal('student');
  }

  /**
   * Open login modal with Company role preselected
   */
  openCompanyLoginModal(): void {
    this.openLoginModal('company');
  }

  /**
   * Open login modal with Admin role preselected
   */
  openAdminLoginModal(): void {
    this.openLoginModal('admin');
  }

  /**
   * Close login modal
   */
  closeLoginModal(): void {
    this.showLoginModal = false;
    this.selectedLoginRole = undefined;
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Open signup modal
   */
  openSignupModal(): void {
    this.showSignupModal = true;
    this.showLoginModal = false;
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Close signup modal
   */
  closeSignupModal(): void {
    this.showSignupModal = false;
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Switch from signup to login modal
   */
  switchToLogin(): void {
    this.openLoginModal();
  }

  /**
   * Switch from login to signup modal
   */
  switchToSignup(): void {
    this.openSignupModal();
  }
}
