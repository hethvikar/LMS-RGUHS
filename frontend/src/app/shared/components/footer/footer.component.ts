import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface FooterLink {
  label: string;
  route: string;
  external?: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  platformLinks: FooterLink[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Courses', route: '/lms/courses' },
    { label: 'Assessments', route: '/lms/assignments' },
    { label: 'Resources', route: '/lms/resources' },
    { label: 'Progress', route: '/lms/progress' }
  ];

  supportLinks: FooterLink[] = [
    { label: 'Help Center', route: '/help' },
    { label: 'Contact Support', route: '/support' },
    { label: 'FAQ', route: '/faq' },
    { label: 'System Status', route: '/status' },
    { label: 'Report Issue', route: '/report' }
  ];

  companyLinks: FooterLink[] = [
    { label: 'About Us', route: '/about' },
    { label: 'Careers', route: '/careers' },
    { label: 'Press', route: '/press' },
    { label: 'Blog', route: '/blog' },
    { label: 'Partners', route: '/partners' }
  ];

  socialLinks: SocialLink[] = [
    { platform: 'Facebook', url: 'https://facebook.com/eduplatform', icon: 'public' },
    { platform: 'Twitter', url: 'https://twitter.com/eduplatform', icon: 'alternate_email' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/eduplatform', icon: 'work' },
    { platform: 'YouTube', url: 'https://youtube.com/eduplatform', icon: 'play_circle_filled' },
    { platform: 'Instagram', url: 'https://instagram.com/eduplatform', icon: 'photo_camera' }
  ];
}
