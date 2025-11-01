import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="certificate-template">
      <div class="certificate-header">
        <div class="certificate-decoration certificate-decoration-left">
          <div class="decoration-line"></div>
          <div class="decoration-circle"></div>
          <div class="decoration-line"></div>
        </div>
        <div class="certificate-title-section">
          <h1 class="certificate-main-title">Certificate of Achievement</h1>
          <div class="certificate-subtitle">This certifies that</div>
        </div>
        <div class="certificate-decoration certificate-decoration-right">
          <div class="decoration-line"></div>
          <div class="decoration-circle"></div>
          <div class="decoration-line"></div>
        </div>
      </div>

      <div class="certificate-body">
        <div class="recipient-name">{{ data.title }}</div>
        <div class="certificate-description">
          has successfully completed the requirements for
        </div>
        <div class="certificate-course">{{ data.description }}</div>
      </div>

      <div class="certificate-footer">
        <div class="certificate-details">
          <div class="detail-item">
            <span class="detail-label">Certificate ID:</span>
            <span class="detail-value">{{ data.credentialId }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Provider:</span>
            <span class="detail-value">{{ data.provider }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Date Earned:</span>
            <span class="detail-value">{{ data.earnedDate | date:'longDate' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">{{ data.type }}</span>
          </div>
        </div>

        <div class="certificate-signatures">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-title">Authorized Signature</div>
          </div>
          <div class="certificate-seal">

            <div class="seal-text">Verified</div>
          </div>
        </div>
      </div>

      <div class="certificate-actions">
        <button mat-button (click)="printCertificate()">
          Print Certificate
        </button>
        <button mat-button (click)="downloadCertificate()">
          Download PDF
        </button>
        <button mat-raised-button color="primary" (click)="closeDialog()">
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .certificate-template {
      font-family: 'Times New Roman', serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px;
      border-radius: 15px;
      position: relative;
      overflow: hidden;
    }

    .certificate-template::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="%23ffffff" opacity="0.1"/></svg>');
      pointer-events: none;
    }

    .certificate-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      position: relative;
    }

    .certificate-decoration {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .certificate-decoration-left {
      justify-content: flex-end;
    }

    .certificate-decoration-right {
      justify-content: flex-start;
    }

    .decoration-line {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    .decoration-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .certificate-title-section {
      text-align: center;
      flex: 2;
    }

    .certificate-main-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .certificate-subtitle {
      font-size: 1.2rem;
      color: #7f8c8d;
      font-style: italic;
    }

    .certificate-body {
      text-align: center;
      margin: 40px 0;
    }

    .recipient-name {
      font-size: 2rem;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .certificate-description {
      font-size: 1.1rem;
      color: #34495e;
      margin-bottom: 15px;
      font-style: italic;
    }

    .certificate-course {
      font-size: 1.3rem;
      color: #2c3e50;
      font-weight: 500;
      line-height: 1.4;
      max-width: 600px;
      margin: 0 auto;
    }

    .certificate-footer {
      margin-top: 50px;
      border-top: 2px solid #bdc3c7;
      padding-top: 30px;
    }

    .certificate-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .detail-label {
      font-size: 0.9rem;
      color: #7f8c8d;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 1rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .certificate-signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
    }

    .signature-block {
      flex: 1;
      text-align: center;
    }

    .signature-line {
      width: 200px;
      height: 2px;
      background: #2c3e50;
      margin: 0 auto 10px auto;
    }

    .signature-title {
      font-size: 0.9rem;
      color: #7f8c8d;
      font-weight: 500;
    }

    .certificate-seal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .seal-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #27ae60;
    }

    .seal-text {
      font-size: 0.8rem;
      color: #27ae60;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .certificate-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
    }

    .certificate-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .certificate-template {
        padding: 20px;
      }

      .certificate-main-title {
        font-size: 1.8rem;
      }

      .recipient-name {
        font-size: 1.5rem;
      }

      .certificate-details {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .certificate-signatures {
        flex-direction: column;
        gap: 30px;
      }

      .certificate-actions {
        flex-direction: column;
        align-items: center;
      }

      .certificate-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CertificateDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CertificateDialogComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  printCertificate() {
    window.print();
  }

  downloadCertificate() {
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  }
}