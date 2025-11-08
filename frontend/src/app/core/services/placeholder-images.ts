/**
 * Placeholder Image Service
 * Generates data URI images to prevent loading issues and blinking
 */

export class PlaceholderImages {
  /**
   * Generate a colored placeholder image with text
   */
  static generateSVG(width: number, height: number, bgColor: string, text: string, textColor: string = 'white'): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}"/>
        <text 
          x="50%" 
          y="50%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="${textColor}" 
          font-size="24" 
          font-family="Arial, sans-serif" 
          font-weight="bold">
          ${text}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Gallery placeholder images with realistic placement themes
   */
  static getGalleryImages(): string[] {
    const images = [
      this.generatePlacementSVG(800, 600, '#667eea', '#764ba2', 'Campus Drive', 'GRAD'),
      this.generatePlacementSVG(800, 600, '#f093fb', '#4facfe', 'Interview Round', 'WORK'),
      this.generatePlacementSVG(800, 600, '#43e97b', '#38f9d7', 'Offer Letter', 'OFFER'),
      this.generatePlacementSVG(800, 600, '#fa709a', '#fee140', 'Skill Workshop', 'SKILL'),
      this.generatePlacementSVG(800, 600, '#4facfe', '#00f2fe', 'Group Discussion', 'TEAM'),
      this.generatePlacementSVG(800, 600, '#667eea', '#f093fb', 'Success Story', 'STAR'),
      this.generatePlacementSVG(800, 600, '#ff6b6b', '#feca57', 'Tech Talk', 'TECH'),
      this.generatePlacementSVG(800, 600, '#00d2ff', '#3a7bd5', 'Mock Interview', 'PREP')
    ];
    return images;
  }

  /**
   * Generate a professional placement-themed SVG image
   */
  static generatePlacementSVG(width: number, height: number, color1: string, color2: string, title: string, iconText: string): string {
    const gradId = `grad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dotsId = `dots_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
          <pattern id="${dotsId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/>
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#${gradId})"/>
        <rect width="${width}" height="${height}" fill="url(#${dotsId})"/>
        <circle cx="${width/2}" cy="${height*0.4}" r="80" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="3"/>
        <text 
          x="50%" 
          y="42%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="white" 
          font-size="32" 
          font-family="Arial, sans-serif" 
          font-weight="bold"
          letter-spacing="2">
          ${iconText}
        </text>
        <text 
          x="50%" 
          y="68%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="white" 
          font-size="36" 
          font-family="Arial, sans-serif" 
          font-weight="bold">
          ${title}
        </text>
      </svg>`;
    
    // Use encodeURIComponent for proper encoding
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  /**
   * Student avatar placeholders
   */
  static getStudentAvatars(): string[] {
    const colors = ['#1976d2', '#00bcd4', '#4caf50', '#ff9800'];
    const names = ['Rajesh K', 'Priya S', 'Arun P', 'Sneha R'];
    return Array.from({ length: 4 }, (_, i) =>
      this.generateCircularAvatar(200, colors[i], names[i])
    );
  }

  /**
   * Company logo placeholders
   */
  static getCompanyLogos(): { [key: string]: string } {
    const companies = {
      google: '#4285f4',
      microsoft: '#00a4ef',
      amazon: '#ff9900',
      infosys: '#007cc3',
      tcs: '#0066b2',
      wipro: '#673ab7',
      accenture: '#a100ff',
      cognizant: '#0033a1'
    };

    const logos: { [key: string]: string } = {};
    Object.entries(companies).forEach(([name, color]) => {
      logos[name] = this.generateSVG(300, 150, '#ffffff', name.toUpperCase(), color);
    });
    return logos;
  }

  /**
   * Testimonial avatar placeholders
   */
  static getTestimonialAvatars(): string[] {
    const colors = ['#00bcd4', '#4caf50', '#ff9800'];
    const names = ['VK', 'AD', 'KI'];
    return Array.from({ length: 3 }, (_, i) =>
      this.generateCircularAvatar(100, colors[i], names[i])
    );
  }

  /**
   * Certificate placeholders
   */
  static getCertificates(): string[] {
    const titles = ['NAAC A+', 'NBA', 'Award 2024'];
    const colors = ['#4caf50', '#2196f3', '#ff9800'];
    return Array.from({ length: 3 }, (_, i) =>
      this.generateCertificate(800, 600, colors[i], titles[i])
    );
  }

  /**
   * Generate circular avatar
   */
  private static generateCircularAvatar(size: number, bgColor: string, initials: string): string {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bgColor}"/>
        <text 
          x="50%" 
          y="50%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="white" 
          font-size="${size / 3}" 
          font-family="Arial, sans-serif" 
          font-weight="bold">
          ${initials}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate certificate placeholder
   */
  private static generateCertificate(width: number, height: number, color: string, title: string): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f5f5f5"/>
        <rect x="50" y="50" width="${width - 100}" height="${height - 100}" 
              fill="white" stroke="${color}" stroke-width="8" rx="10"/>
        <text 
          x="50%" 
          y="35%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="${color}" 
          font-size="48" 
          font-family="Arial, sans-serif" 
          font-weight="bold">
          CERTIFICATE
        </text>
        <text 
          x="50%" 
          y="55%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="#333" 
          font-size="32" 
          font-family="Arial, sans-serif">
          ${title}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate main logo
   */
  static getMainLogo(): string {
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="#1976d2"/>
        <text 
          x="50%" 
          y="45%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="white" 
          font-size="70" 
          font-family="Arial, sans-serif" 
          font-weight="bold">
          R
        </text>
        <text 
          x="50%" 
          y="70%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          fill="white" 
          font-size="28" 
          font-family="Arial, sans-serif">
          RGUHS
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate default placeholder
   */
  static getDefaultPlaceholder(): string {
    return this.generateSVG(400, 300, '#cccccc', 'Image', '#666666');
  }

  /**
   * Get real company logo URLs from public CDN (Clearbit Logo API)
   * These are actual company logos, but may fail if offline or blocked
   */
  static getRealCompanyLogoUrls(): string[] {
    return [
      'https://logo.clearbit.com/google.com',
      'https://logo.clearbit.com/microsoft.com',
      'https://logo.clearbit.com/amazon.com',
      'https://logo.clearbit.com/infosys.com',
      'https://logo.clearbit.com/tcs.com',
      'https://logo.clearbit.com/wipro.com',
      'https://logo.clearbit.com/accenture.com',
      'https://logo.clearbit.com/cognizant.com'
    ];
  }

  /**
   * Get company logos with fallback support
   * Returns objects with both real logo URL and SVG fallback
   */
  static getCompanyLogosWithFallback(): Array<{ primary: string; fallback: string }> {
    const realLogos = this.getRealCompanyLogoUrls();
    const placeholders = this.getCompanyLogos();
    
    return realLogos.map((url, index) => ({
      primary: url,
      fallback: placeholders[index]
    }));
  }
}

