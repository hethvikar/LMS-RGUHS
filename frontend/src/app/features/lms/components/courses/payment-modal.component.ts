import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price?: number;
  currency?: string;
  category: string;
}

declare var Razorpay: any;

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="payment-modal">
      <div class="modal-header">
        <h2 mat-dialog-title>
          <mat-icon>payment</mat-icon>
          Complete Payment
        </h2>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="modal-content">
        <!-- Course Details Section -->
        <mat-card class="course-summary">
          <mat-card-header>
            <mat-card-title>Course Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p class="instructor">by {{ course.instructor }}</p>
              <div class="course-details">
                <div class="detail-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ course.duration }}</span>
                </div>
                <div class="detail-item">
                  <mat-icon>category</mat-icon>
                  <span>{{ course.category }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-divider></mat-divider>

        <!-- Payment Details Section -->
        <mat-card class="payment-details">
          <mat-card-header>
            <mat-card-title>Payment Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="price-breakdown">
              <div class="price-item">
                <span>Course Fee</span>
                <span class="amount">₹{{ course.price || 0 }}</span>
              </div>
              <div class="price-item">
                <span>Platform Fee</span>
                <span class="amount">₹{{ platformFee }}</span>
              </div>
              <div class="price-item">
                <span>GST (18%)</span>
                <span class="amount">₹{{ gstAmount }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="price-item total">
                <span><strong>Total Amount</strong></span>
                <span class="amount"><strong>₹{{ totalAmount }}</strong></span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Payment Method Section -->
        <mat-card class="payment-method">
          <mat-card-header>
            <mat-card-title>Payment Method</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="payment-options">
              <div class="payment-option selected">
                <mat-icon>credit_card</mat-icon>
                <div class="option-info">
                  <h4>Razorpay Secure Payment</h4>
                  <p>Pay using Credit Card, Debit Card, Net Banking, UPI, or Wallet</p>
                </div>
                <mat-icon class="check-icon">check_circle</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Security Info -->
        <div class="security-info">
          <mat-icon>security</mat-icon>
          <span>Your payment information is encrypted and secure</span>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="modal-actions">
        <button mat-button mat-dialog-close>Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="proceedToPayment()"
          [disabled]="isProcessing"
          class="pay-button">
          <mat-spinner diameter="20" *ngIf="isProcessing"></mat-spinner>
          <mat-icon *ngIf="!isProcessing">payment</mat-icon>
          {{ isProcessing ? 'Processing...' : 'Pay ₹' + totalAmount }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .payment-modal {
      max-width: 600px;
      width: 100%;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        color: #1976d2;
        font-size: 1.5rem;
      }

      .close-btn {
        color: #666;
      }
    }

    .modal-content {
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .course-summary {
      margin-bottom: 16px;

      .course-info {
        h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.2rem;
        }

        .instructor {
          margin: 0 0 16px 0;
          color: #666;
          font-style: italic;
        }

        .course-details {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;

          .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #555;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #1976d2;
            }
          }
        }
      }
    }

    .payment-details {
      margin: 16px 0;

      .price-breakdown {
        .price-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;

          &.total {
            padding-top: 12px;
            font-size: 1.1rem;
          }

          .amount {
            color: #1976d2;
            font-weight: 500;
          }
        }
      }
    }

    .payment-method {
      margin: 16px 0;

      .payment-options {
        .payment-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;

          &.selected {
            border-color: #1976d2;
            background-color: #f3f9ff;
          }

          .option-info {
            flex: 1;

            h4 {
              margin: 0 0 4px 0;
              color: #333;
            }

            p {
              margin: 0;
              color: #666;
              font-size: 0.9rem;
            }
          }

          .check-icon {
            color: #4caf50;
          }
        }
      }
    }

    .security-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-top: 16px;

      mat-icon {
        color: #4caf50;
        font-size: 20px;
      }

      span {
        color: #555;
        font-size: 0.9rem;
      }
    }

    .modal-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;

      .pay-button {
        min-width: 120px;

        mat-spinner {
          margin-right: 8px;
        }

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    @media (max-width: 600px) {
      .payment-modal {
        max-width: 95vw;
      }

      .course-details {
        flex-direction: column;
        gap: 12px !important;
      }
    }
  `]
})
export class PaymentModalComponent implements OnInit {
  course: Course;
  platformFee = 50;
  gstRate = 0.18;
  isProcessing = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Course }
  ) {
    this.course = data.course;
  }

  ngOnInit(): void {
    // Initialize Razorpay script if not already loaded
    this.loadRazorpayScript();
  }

  get gstAmount(): number {
    const baseAmount = (this.course.price || 0) + this.platformFee;
    return Math.round(baseAmount * this.gstRate);
  }

  get totalAmount(): number {
    return (this.course.price || 0) + this.platformFee + this.gstAmount;
  }

  private loadRazorpayScript(): void {
    if (typeof Razorpay !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
  }

  proceedToPayment(): void {
    this.isProcessing = true;

    // Simulate loading time
    setTimeout(() => {
      this.initiateRazorpayPayment();
    }, 1000);
  }

  private initiateRazorpayPayment(): void {
    const options = {
      key: 'rzp_test_1234567890', // Replace with your Razorpay key
      amount: this.totalAmount * 100, // Amount in paisa
      currency: 'INR',
      name: 'RGUHS Learning Platform',
      description: `Enrollment for ${this.course.title}`,
      image: '/assets/images/logo.png', // Your logo
      order_id: '', // You can generate order_id from backend
      handler: (response: any) => {
        this.handlePaymentSuccess(response);
      },
      prefill: {
        name: 'Student Name',
        email: 'student@example.com',
        contact: '9999999999'
      },
      notes: {
        course_id: this.course.id.toString(),
        course_title: this.course.title
      },
      theme: {
        color: '#1976d2'
      },
      modal: {
        ondismiss: () => {
          this.isProcessing = false;
        }
      }
    };

    if (typeof Razorpay !== 'undefined') {
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      // Fallback: simulate payment success for demo
      console.log('Razorpay not loaded, simulating payment success');
      setTimeout(() => {
        this.handlePaymentSuccess({
          razorpay_payment_id: 'demo_payment_' + Date.now(),
          razorpay_order_id: 'demo_order_' + Date.now(),
          razorpay_signature: 'demo_signature'
        });
      }, 2000);
    }
  }

  private handlePaymentSuccess(response: any): void {
    console.log('Payment Success:', response);
    
    // You can verify payment on backend here
    this.isProcessing = false;
    
    // Close modal with success result
    this.dialogRef.close({
      success: true,
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      course: this.course,
      amount: this.totalAmount
    });
  }
}