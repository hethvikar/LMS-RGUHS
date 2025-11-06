import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResumeService, UploadResponse, ExtractionResponse, ExtractedProfileData } from '@core/services/resume.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  profileForm: FormGroup;
  skillsList: string[] = ['JavaScript', 'TypeScript', 'Angular', 'Node.js'];
  newSkill = '';


  
  // Resume upload properties
  resumeFile: File | null = null;
  resumeFileName: string = '';
  uploadProgress: number = 0;
  isUploading: boolean = false;
  uploadMessage: string = '';
  uploadSuccess: boolean = false;

  // Data extraction properties
  isExtracting: boolean = false;
  extractionMessage: string = '';
  extractionSuccess: boolean = false;
  extractedData: ExtractedProfileData | null = null;

  // Additional document upload properties
  portfolioFile: File | null = null;
  portfolioFileName: string = '';
  additionalCertFile: File | null = null;
  additionalCertFileName: string = '';
  recommendationFile: File | null = null;
  recommendationFileName: string = '';
  
  // Allowed file types
  allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  allowedExtensions = ['.pdf', '.doc', '.docx'];

  constructor(private fb: FormBuilder, private resumeService: ResumeService) {
    this.profileForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      alternatePhone: [''],
      location: ['', [Validators.required]],
      openForRelocation: [false],
      comments: [''],
      linkedInProfile: [''],
      skills: [''],

      // Academic Information (keeping existing fields)
      enrollmentNumber: [''],
      course: [''],
      branch: [''],
      yearOfStudy: [''],
      cgpa: [''],

      // Employment History
      employmentHistory: this.fb.array([]),

      // Education
      education: this.fb.array([]),

      // Certifications
      certifications: this.fb.array([])
    });
  }

  ngOnInit() {
    // Load profile data
    this.loadProfile();

    // Add default forms for Employment History, Education, and Certifications
    this.addEmploymentHistory();
    this.addEducation();
    this.addCertification();
  }

  // Getters for FormArrays
  get employmentHistory(): FormArray {
    return this.profileForm.get('employmentHistory') as FormArray;
  }

  get education(): FormArray {
    return this.profileForm.get('education') as FormArray;
  }

  get certifications(): FormArray {
    return this.profileForm.get('certifications') as FormArray;
  }

  // Employment History methods
  addEmploymentHistory() {
    const employmentGroup = this.fb.group({
      currentCompany: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      experienceYears: ['', [Validators.required, Validators.min(0)]],
      experienceMonths: ['', [Validators.required, Validators.min(0), Validators.max(11)]],
      currentCTC: ['', [Validators.required]],
      noticePeriod: ['', [Validators.required]]
    });
    this.employmentHistory.push(employmentGroup);
  }

  removeEmploymentHistory(index: number) {
    this.employmentHistory.removeAt(index);
  }

  // Education methods
  addEducation() {
    const educationGroup = this.fb.group({
      university: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      specialization: [''],
      completedYear: ['', [Validators.required]],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      location: ['', [Validators.required]]
    });
    this.education.push(educationGroup);
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  // Certifications methods
  addCertification() {
    const certificationGroup = this.fb.group({
      certificateName: ['', [Validators.required]],
      certificateValidTill: ['', [Validators.required]],
      providerName: ['', [Validators.required]],
      certificateFile: [null]
    });
    this.certifications.push(certificationGroup);
  }

  removeCertification(index: number) {
    this.certifications.removeAt(index);
  }

  onCertificationFileSelected(event: any, index: number) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      this.certifications.at(index).patchValue({
        certificateFile: file
      });
    }
  }

  loadProfile() {
    // Load profile data from API - currently empty for new users
    // In real app, this would fetch data from API
    // this.studentService.getProfile().subscribe(data => {
    //   this.profileForm.patchValue(data);
    //   // Load arrays if they exist
    // });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;

      // Process the form data for API submission
      const profileData = {
        ...formData,
        skills: this.skillsList,
        employmentHistory: formData.employmentHistory.filter((emp: any) =>
          emp.currentCompany || emp.jobTitle || emp.experienceYears || emp.currentCTC
        ),
        education: formData.education.filter((edu: any) =>
          edu.university || edu.degree || edu.completedYear
        ),
        certifications: formData.certifications.filter((cert: any) =>
          cert.certificateName || cert.providerName
        )
      };

      console.log('Updating profile:', profileData);
      // Here you would call the API to update the profile
      // this.studentService.updateProfile(profileData).subscribe(...)
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormArray) {
          control.controls.forEach(ctrl => ctrl.markAsTouched());
        }
      }
    });
  }

  addSkill() {
    if (this.newSkill.trim() && !this.skillsList.includes(this.newSkill.trim())) {
      this.skillsList.push(this.newSkill.trim());
      this.newSkill = '';
      this.updateSkillsInForm();
    }
  }

  removeSkill(skill: string) {
    this.skillsList = this.skillsList.filter(s => s !== skill);
    this.updateSkillsInForm();
  }

  private updateSkillsInForm() {
    this.profileForm.patchValue({
      skills: this.skillsList.join(', ')
    });
  }

  // Resume upload methods
  onResumeFileSelected(event: any) {
    debugger;

    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!this.isValidFileType(file)) {
        this.uploadMessage = 'Invalid file type. Please upload only PDF or Word documents (.pdf, .doc, .docx)';
        this.uploadSuccess = false;
        this.resumeFile = null;
        this.resumeFileName = '';
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.uploadMessage = 'File size exceeds 5MB limit. Please upload a smaller file.';
        this.uploadSuccess = false;
        this.resumeFile = null;
        this.resumeFileName = '';
        return;
      }
      
      this.resumeFile = file;
      this.resumeFileName = file.name;
      this.uploadMessage = `File selected: ${file.name}`;
      this.uploadSuccess = true;

      this.extractDataFromResume(file)
    }
  }

  private isValidFileType(file: File): boolean {
    // Check MIME type
    if (this.allowedFileTypes.includes(file.type)) {
      return true;
    }
    
    // Check file extension as fallback
    const fileName = file.name.toLowerCase();
    return this.allowedExtensions.some(ext => fileName.endsWith(ext));
  }

  uploadResume() {
    if (!this.resumeFile) {
      this.uploadMessage = 'Please select a file first';
      this.uploadSuccess = false;
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // Use the resume service to upload the file
    this.resumeService.uploadResume(this.resumeFile).subscribe({
      next: (response: UploadResponse) => {
        this.uploadMessage = `Resume uploaded successfully: ${this.resumeFileName}`;
        this.uploadSuccess = true;
        this.isUploading = false;
        this.uploadProgress = 100;

        // Trigger data extraction after successful upload
        if (this.resumeFile) {
          this.extractDataFromResume(this.resumeFile);
        }

        this.resumeFile = null;

        // Clear message after 5 seconds
        setTimeout(() => {
          this.uploadMessage = '';
        }, 5000);
      },
      error: (error: Error) => {
        this.uploadMessage = error.message || 'Upload failed. Please try again.';
        this.uploadSuccess = false;
        this.isUploading = false;
        this.uploadProgress = 0;
        this.resumeFile = null;
      }
    });
  }

  clearResumeUpload() {
    this.resumeFile = null;
    this.resumeFileName = '';
    this.uploadProgress = 0;
    this.uploadMessage = '';
    this.uploadSuccess = false;
    this.isUploading = false;
    // Also clear extraction state
    this.clearExtractionState();
  }

  private clearExtractionState() {
    this.isExtracting = false;
    this.extractionMessage = '';
    this.extractionSuccess = false;
    this.extractedData = null;
  }

  private async extractDataFromResume(file: File) {
    debugger;
    this.isExtracting = true;
    this.extractionMessage = 'Extracting text from resume...';
    this.extractionSuccess = false;

    try {
      // Step 1: Extract text from the file
      const resumeText = await this.resumeService.extractTextFromResume(file);
      this.extractionMessage = 'Analyzing extracted text with AI...';

      // Step 2: Send text to AI for analysis
      this.resumeService.extractProfileDataFromText(resumeText).then((response: ExtractionResponse) => {
        this.isExtracting = false;
        if (response.success && response.extractedData) {
          this.extractedData = response.extractedData;
          this.extractionSuccess = true;
          this.extractionMessage = `Data extracted successfully! Confidence: ${response.confidence || 0}%`;

          // Auto-fill the form with extracted data
          this.autoFillFormWithExtractedData(response.extractedData);

          // Clear message after 10 seconds
          setTimeout(() => {
            this.extractionMessage = '';
          }, 10000);
        } else {
          this.extractionMessage = response.message || 'Data extraction completed but no data was found.';
          this.extractionSuccess = false;
        }
      }).catch((error: Error) => {
        this.isExtracting = false;
        this.extractionMessage = error.message || 'AI analysis failed. Please fill the form manually.';
        this.extractionSuccess = false;
      });
    } catch (error) {
      this.isExtracting = false;
      this.extractionMessage = error instanceof Error ? error.message : 'Text extraction failed. Please fill the form manually.';
      this.extractionSuccess = false;
    }
  }

  private autoFillFormWithExtractedData(rawData: any) {
    // Convert raw AI output to ExtractedProfileData model
    const data: ExtractedProfileData = this.convertRawDataToExtractedProfileData(rawData);

    console.log('Converted data:', data);

    // Personal Information
    if (data.firstName) this.profileForm.patchValue({ firstName: data.firstName });
    if (data.middleName) this.profileForm.patchValue({ middleName: data.middleName });
    if (data.lastName) this.profileForm.patchValue({ lastName: data.lastName });
    if (data.email) this.profileForm.patchValue({ email: data.email });
    if (data.phone) this.profileForm.patchValue({ phone: data.phone });
    if (data.alternatePhone) this.profileForm.patchValue({ alternatePhone: data.alternatePhone });
    if (data.location) this.profileForm.patchValue({ location: data.location });
    if (data.linkedInProfile) this.profileForm.patchValue({ linkedInProfile: data.linkedInProfile });

    // Academic Information
    if (data.enrollmentNumber) this.profileForm.patchValue({ enrollmentNumber: data.enrollmentNumber });
    if (data.course) this.profileForm.patchValue({ course: data.course });
    if (data.branch) this.profileForm.patchValue({ branch: data.branch });
    if (data.yearOfStudy) this.profileForm.patchValue({ yearOfStudy: data.yearOfStudy });
    if (data.cgpa) this.profileForm.patchValue({ cgpa: data.cgpa });

    // Employment History
    if (data.employmentHistory && data.employmentHistory.length > 0) {
      // Clear existing employment history
      while (this.employmentHistory.length > 0) {
        this.employmentHistory.removeAt(0);
      }

      // Add extracted employment history
      data.employmentHistory.forEach(emp => {
        const employmentGroup = this.fb.group({
          currentCompany: [emp.currentCompany || '', [Validators.required]],
          jobTitle: [emp.jobTitle || '', [Validators.required]],
          experienceYears: [emp.experienceYears || '', [Validators.required, Validators.min(0)]],
          experienceMonths: [emp.experienceMonths || '', [Validators.required, Validators.min(0), Validators.max(11)]],
          currentCTC: [emp.currentCTC || '', [Validators.required]],
          noticePeriod: [emp.noticePeriod || '', [Validators.required]]
        });
        this.employmentHistory.push(employmentGroup);
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      // Clear existing education
      while (this.education.length > 0) {
        this.education.removeAt(0);
      }

      // Add extracted education
      data.education.forEach(edu => {
        const educationGroup = this.fb.group({
          university: [edu.university || '', [Validators.required]],
          degree: [edu.degree || '', [Validators.required]],
          specialization: [edu.specialization || ''],
          completedYear: [edu.completedYear || '', [Validators.required]],
          percentage: [edu.percentage || '', [Validators.required, Validators.min(0), Validators.max(100)]],
          location: [edu.location || '', [Validators.required]]
        });
        this.education.push(educationGroup);
      });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      // Clear existing certifications
      while (this.certifications.length > 0) {
        this.certifications.removeAt(0);
      }

      // Add extracted certifications
      data.certifications.forEach(cert => {
        const certificationGroup = this.fb.group({
          certificateName: [cert.certificateName || '', [Validators.required]],
          certificateValidTill: [cert.certificateValidTill || '', [Validators.required]],
          providerName: [cert.providerName || '', [Validators.required]],
          certificateFile: [null]
        });
        this.certifications.push(certificationGroup);
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      this.skillsList = data.skills;
      this.updateSkillsInForm();
    }
  }

  private convertRawDataToExtractedProfileData(rawData: any): ExtractedProfileData {
    const data: ExtractedProfileData = {};

    // Parse name into firstName, middleName, lastName
    if (rawData.name) {
      const nameParts = rawData.name.trim().split(' ');
      if (nameParts.length >= 1) data.firstName = nameParts[0];
      if (nameParts.length >= 2) data.middleName = nameParts.slice(1, -1).join(' ');
      if (nameParts.length >= 2) data.lastName = nameParts[nameParts.length - 1];
    }

    // Contact information
    if (rawData.contact) {
      data.email = rawData.contact.email;
      data.phone = rawData.contact.phone;
      data.linkedInProfile = rawData.contact.linkedin;
    }

    // Location
    data.location = rawData.location;

    // Skills - flatten technical_skills into a single array
    if (rawData.technical_skills) {
      const skills: string[] = [];
      if (rawData.technical_skills.programming_languages) {
        skills.push(...rawData.technical_skills.programming_languages);
      }
      if (rawData.technical_skills.web_technologies) {
        skills.push(...rawData.technical_skills.web_technologies);
      }
      if (rawData.technical_skills.databases) {
        skills.push(...rawData.technical_skills.databases);
      }
      if (rawData.technical_skills.tools_and_platforms) {
        skills.push(...rawData.technical_skills.tools_and_platforms);
      }
      if (rawData.technical_skills.methodologies) {
        skills.push(...rawData.technical_skills.methodologies);
      }
      data.skills = skills;
    }

    // Employment History - map professional_experience
    if (rawData.professional_experience && Array.isArray(rawData.professional_experience)) {
      data.employmentHistory = rawData.professional_experience.map((exp: any) => ({
        currentCompany: exp.company,
        jobTitle: exp.job_title,
        // Note: experienceYears and experienceMonths would need duration parsing
        // For now, we'll leave them undefined and let user fill manually
        experienceYears: undefined,
        experienceMonths: undefined,
        currentCTC: undefined, // Not available in raw data
        noticePeriod: undefined // Not available in raw data
      }));
    }

    // Education - convert single education object to array
    if (rawData.education) {
      data.education = [{
        university: rawData.education.institution,
        degree: rawData.education.degree,
        specialization: undefined, // Not available in raw data
        completedYear: rawData.education.year?.toString(),
        percentage: undefined, // Not available in raw data
        location: undefined // Not available in raw data
      }];
    }

    // Certifications - map certifications array
    if (rawData.certifications && Array.isArray(rawData.certifications)) {
      data.certifications = rawData.certifications.map((cert: string) => ({
        certificateName: cert,
        certificateValidTill: undefined, // Not available in raw data
        providerName: undefined // Not available in raw data
      }));
    }

    return data;
  }

  // Additional document upload methods
  onPortfolioFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      // Validate file size (max 10MB for portfolio)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Portfolio file size exceeds 10MB limit. Please upload a smaller file.');
        return;
      }
      this.portfolioFile = file;
      this.portfolioFileName = file.name;
    }
  }

  onAdditionalCertFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      // Validate file size (max 5MB for certificates)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Certificate file size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }
      this.additionalCertFile = file;
      this.additionalCertFileName = file.name;
    }
  }

  onRecommendationFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      // Validate file size (max 5MB for recommendations)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Recommendation file size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }
      this.recommendationFile = file;
      this.recommendationFileName = file.name;
    }
  }

  clearPortfolioUpload() {
    this.portfolioFile = null;
    this.portfolioFileName = '';
  }

  clearAdditionalCertUpload() {
    this.additionalCertFile = null;
    this.additionalCertFileName = '';
  }

  clearRecommendationUpload() {
    this.recommendationFile = null;
    this.recommendationFileName = '';
  }


}