import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="payment-dialog">
      <h2 mat-dialog-title>
        <mat-icon>payment</mat-icon>
        Complete Your Enrollment
      </h2>

      <mat-dialog-content>
        <mat-stepper linear #stepper>
          <!-- Step 1: Order Summary -->
          <mat-step label="Order Summary">
            <div class="order-summary">
              <h3>Courses to Enroll</h3>
              <div class="courses-list">
                <div *ngFor="let course of data.courses" class="course-item">
                  <div class="course-info">
                    <strong>{{ course.name }}</strong>
                    <span class="course-code">{{ course.code }}</span>
                  </div>
                  <span class="course-fee">₹{{ course.fee }}</span>
                </div>
              </div>

              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ data.totalAmount }}</span>
              </div>
              <div class="summary-row">
                <span>Processing Fee</span>
                <span>₹{{ getProcessingFee() }}</span>
              </div>
              <div class="summary-row">
                <span>GST (18%)</span>
                <span>₹{{ getGST() }}</span>
              </div>
              <div class="summary-row total">
                <strong>Total Amount</strong>
                <strong>₹{{ getFinalAmount() }}</strong>
              </div>

              <div class="benefits-info">
                <mat-icon>info</mat-icon>
                <div>
                  <strong>What you get:</strong>
                  <ul>
                    <li>Lifetime access to course materials</li>
                    <li>Certificate of completion</li>
                    <li>Doubt clearing sessions</li>
                    <li>Placement assistance</li>
                  </ul>
                </div>
              </div>

              <button mat-raised-button color="primary" matStepperNext>
                Proceed to Payment <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-step>

          <!-- Step 2: Payment Method -->
          <mat-step [stepControl]="paymentForm" label="Payment Method">
            <form [formGroup]="paymentForm">
              <div class="payment-methods">
                <h3>Select Payment Method</h3>
                
                <mat-radio-group formControlName="paymentMethod" class="method-group">
                  <mat-radio-button value="card">
                    <div class="method-option">
                      <mat-icon>credit_card</mat-icon>
                      <div>
                        <strong>Credit / Debit Card</strong>
                        <span>Visa, Mastercard, Rupay accepted</span>
                      </div>
                    </div>
                  </mat-radio-button>

                  <mat-radio-button value="upi">
                    <div class="method-option">
                      <mat-icon>qr_code_2</mat-icon>
                      <div>
                        <strong>UPI Payment</strong>
                        <span>Google Pay, PhonePe, Paytm, etc.</span>
                      </div>
                    </div>
                  </mat-radio-button>

                  <mat-radio-button value="netbanking">
                    <div class="method-option">
                      <mat-icon>account_balance</mat-icon>
                      <div>
                        <strong>Net Banking</strong>
                        <span>All major banks supported</span>
                      </div>
                    </div>
                  </mat-radio-button>

                  <mat-radio-button value="wallet">
                    <div class="method-option">
                      <mat-icon>account_balance_wallet</mat-icon>
                      <div>
                        <strong>Wallets</strong>
                        <span>Paytm, Amazon Pay, etc.</span>
                      </div>
                    </div>
                  </mat-radio-button>
                </mat-radio-group>

                <!-- Card Payment Details -->
                <div *ngIf="paymentForm.get('paymentMethod')?.value === 'card'" class="payment-details">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Card Number</mat-label>
                    <input matInput formControlName="cardNumber" 
                           placeholder="1234 5678 9012 3456" 
                           maxlength="19"
                           (input)="formatCardNumber($event)">
                    <mat-icon matPrefix>credit_card</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Cardholder Name</mat-label>
                    <input matInput formControlName="cardName" placeholder="JOHN DOE">
                    <mat-icon matPrefix>person</mat-icon>
                  </mat-form-field>

                  <div class="card-details-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Expiry (MM/YY)</mat-label>
                      <input matInput formControlName="cardExpiry" 
                             placeholder="12/25" 
                             maxlength="5"
                             (input)="formatExpiry($event)">
                      <mat-icon matPrefix>event</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>CVV</mat-label>
                      <input matInput formControlName="cardCVV" 
                             type="password" 
                             placeholder="123" 
                             maxlength="3">
                      <mat-icon matPrefix>lock</mat-icon>
                    </mat-form-field>
                  </div>
                </div>

                <!-- UPI Payment Details -->
                <div *ngIf="paymentForm.get('paymentMethod')?.value === 'upi'" class="payment-details">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>UPI ID</mat-label>
                    <input matInput formControlName="upiId" placeholder="yourname@paytm">
                    <mat-icon matPrefix>alternate_email</mat-icon>
                  </mat-form-field>
                </div>

                <!-- Net Banking Details -->
                <div *ngIf="paymentForm.get('paymentMethod')?.value === 'netbanking'" class="payment-details">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Select Bank</mat-label>
                    <select matNativeControl formControlName="bankName">
                      <option value="">Choose your bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="PNB">Punjab National Bank</option>
                      <option value="BOB">Bank of Baroda</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </mat-form-field>
                </div>

                <!-- Wallet Details -->
                <div *ngIf="paymentForm.get('paymentMethod')?.value === 'wallet'" class="payment-details">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Select Wallet</mat-label>
                    <select matNativeControl formControlName="walletType">
                      <option value="">Choose wallet</option>
                      <option value="paytm">Paytm</option>
                      <option value="amazonpay">Amazon Pay</option>
                      <option value="mobikwik">Mobikwik</option>
                      <option value="freecharge">Freecharge</option>
                    </select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Mobile Number</mat-label>
                    <input matInput formControlName="walletPhone" 
                           placeholder="9876543210" 
                           maxlength="10">
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>
                </div>

                <div class="security-info">
                  <mat-icon>security</mat-icon>
                  <p>Your payment information is encrypted and secure. We never store your card details.</p>
                </div>

                <mat-checkbox formControlName="agreeTerms" class="terms-checkbox">
                  I agree to the <a href="#" target="_blank">Terms & Conditions</a> and 
                  <a href="#" target="_blank">Privacy Policy</a>
                </mat-checkbox>
              </div>

              <div class="stepper-actions">
                <button mat-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button mat-raised-button color="accent" 
                        (click)="processPayment()"
                        [disabled]="paymentForm.invalid || processing">
                  <mat-spinner *ngIf="processing" diameter="20"></mat-spinner>
                  <mat-icon *ngIf="!processing">payment</mat-icon>
                  {{ processing ? 'Processing...' : 'Pay ₹' + getFinalAmount() }}
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Payment Success -->
          <mat-step label="Confirmation">
            <div class="success-message" *ngIf="paymentSuccess">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h2>Payment Successful!</h2>
              <p>Your enrollment has been confirmed</p>

              <div class="transaction-details">
                <h3>Transaction Details</h3>
                <div class="detail-row">
                  <span>Transaction ID:</span>
                  <strong>{{ transactionId }}</strong>
                </div>
                <div class="detail-row">
                  <span>Amount Paid:</span>
                  <strong>₹{{ getFinalAmount() }}</strong>
                </div>
                <div class="detail-row">
                  <span>Payment Method:</span>
                  <strong>{{ getPaymentMethodLabel() }}</strong>
                </div>
                <div class="detail-row">
                  <span>Date & Time:</span>
                  <strong>{{ paymentDate | date:'medium' }}</strong>
                </div>
              </div>

              <div class="next-steps">
                <h3>Next Steps</h3>
                <ul>
                  <li>You will receive a confirmation email with course details</li>
                  <li>Access to course materials will be available within 24 hours</li>
                  <li>You will be assigned to a training batch</li>
                  <li>Check "My Courses" section to start learning</li>
                </ul>
              </div>

              <button mat-raised-button color="primary" (click)="closeDialog()">
                <mat-icon>arrow_forward</mat-icon>
                Go to My Courses
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .payment-dialog {
      min-width: 650px;
      max-width: 700px;

      @media (max-width: 768px) {
        min-width: 100%;
      }

      h2[mat-dialog-title] {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #667eea;
        margin-bottom: 0;
      }

      ::ng-deep .mat-stepper-horizontal {
        .mat-step-header {
          .mat-step-icon {
            background: #667eea !important;
          }
        }
      }
    }

    .order-summary {
      padding: 20px 0;

      h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #333;
      }

      .courses-list {
        margin-bottom: 24px;

        .course-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 12px;

          .course-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            strong {
              font-size: 16px;
              color: #333;
            }

            .course-code {
              font-size: 13px;
              color: #667eea;
              font-weight: 600;
            }
          }

          .course-fee {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
          }
        }
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 16px;
        font-size: 15px;
        color: #666;

        &.total {
          background: #f8f9fa;
          border-radius: 8px;
          margin-top: 8px;
          padding: 16px;
          font-size: 18px;

          strong {
            color: #667eea;
            font-size: 24px;
          }
        }
      }

      .benefits-info {
        display: flex;
        gap: 16px;
        padding: 20px;
        background: #e8f5e9;
        border-radius: 8px;
        margin: 24px 0;
        border-left: 4px solid #4caf50;

        mat-icon {
          color: #4caf50;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        strong {
          font-size: 16px;
          color: #2e7d32;
          display: block;
          margin-bottom: 8px;
        }

        ul {
          margin: 0;
          padding-left: 20px;

          li {
            font-size: 14px;
            color: #1b5e20;
            margin-bottom: 6px;
          }
        }
      }

      button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 20px;
      }
    }

    .payment-methods {
      padding: 20px 0;

      h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #333;
      }

      .method-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;

        mat-radio-button {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;

          &:hover {
            border-color: #667eea;
            background: #f8f9fa;
          }

          .method-option {
            display: flex;
            align-items: center;
            gap: 16px;

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;
              color: #667eea;
            }

            strong {
              display: block;
              font-size: 16px;
              color: #333;
              margin-bottom: 4px;
            }

            span {
              display: block;
              font-size: 13px;
              color: #666;
            }
          }
        }
      }

      .payment-details {
        background: #f8f9fa;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 20px;

        .full-width {
          width: 100%;
          margin-bottom: 16px;
        }

        .card-details-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
        }
      }

      .security-info {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #e3f2fd;
        border-radius: 8px;
        border-left: 4px solid #2196f3;
        margin-bottom: 20px;

        mat-icon {
          color: #2196f3;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #1976d2;
        }
      }

      .terms-checkbox {
        margin-bottom: 20px;

        a {
          color: #667eea;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .stepper-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding-top: 20px;

      button {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-spinner {
          margin-right: 8px;
        }
      }
    }

    .success-message {
      text-align: center;
      padding: 40px 20px;

      .success-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #4caf50;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
      }

      > p {
        font-size: 16px;
        color: #666;
        margin-bottom: 32px;
      }

      .transaction-details {
        background: #f8f9fa;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: left;

        h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;

          &:last-child {
            border-bottom: none;
          }

          span {
            font-size: 14px;
            color: #666;
          }

          strong {
            font-size: 14px;
            color: #333;
          }
        }
      }

      .next-steps {
        background: #e8f5e9;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: left;

        h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #2e7d32;
        }

        ul {
          margin: 0;
          padding-left: 24px;

          li {
            font-size: 14px;
            color: #1b5e20;
            margin-bottom: 8px;
            line-height: 1.6;
          }
        }
      }

      button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
    }
  `]
})
export class PaymentDialogComponent implements OnInit {
  paymentForm!: FormGroup;
  processing = false;
  paymentSuccess = false;
  transactionId = '';
  paymentDate = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCVV: [''],
      upiId: [''],
      bankName: [''],
      walletType: [''],
      walletPhone: [''],
      agreeTerms: [false, Validators.requiredTrue]
    });

    // Add validators based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.updateValidators(method);
    });
  }

  updateValidators(method: string) {
    // Reset all validators
    Object.keys(this.paymentForm.controls).forEach(key => {
      if (key !== 'paymentMethod' && key !== 'agreeTerms') {
        this.paymentForm.get(key)?.clearValidators();
        this.paymentForm.get(key)?.updateValueAndValidity();
      }
    });

    // Add validators based on selected method
    if (method === 'card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]);
      this.paymentForm.get('cardName')?.setValidators([Validators.required]);
      this.paymentForm.get('cardExpiry')?.setValidators([Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]);
      this.paymentForm.get('cardCVV')?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
    } else if (method === 'upi') {
      this.paymentForm.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]);
    } else if (method === 'netbanking') {
      this.paymentForm.get('bankName')?.setValidators([Validators.required]);
    } else if (method === 'wallet') {
      this.paymentForm.get('walletType')?.setValidators([Validators.required]);
      this.paymentForm.get('walletPhone')?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
    }

    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentForm.patchValue({ cardNumber: formattedValue }, { emitEvent: false });
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\//g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.patchValue({ cardExpiry: value }, { emitEvent: false });
  }

  getProcessingFee(): number {
    return Math.round(this.data.totalAmount * 0.02); // 2% processing fee
  }

  getGST(): number {
    return Math.round((this.data.totalAmount + this.getProcessingFee()) * 0.18); // 18% GST
  }

  getFinalAmount(): number {
    return this.data.totalAmount + this.getProcessingFee() + this.getGST();
  }

  getPaymentMethodLabel(): string {
    const labels: { [key: string]: string } = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI',
      'netbanking': 'Net Banking',
      'wallet': 'Wallet'
    };
    return labels[this.paymentForm.get('paymentMethod')?.value] || '';
  }

  processPayment() {
    if (this.paymentForm.invalid) {
      return;
    }

    this.processing = true;

    // Simulate payment processing
    setTimeout(() => {
      this.processing = false;
      this.paymentSuccess = true;
      this.transactionId = 'TXN' + Date.now();
      this.paymentDate = new Date();
      
      // In production, this would call actual payment gateway API
      console.log('Payment processed:', {
        courses: this.data.courses,
        amount: this.getFinalAmount(),
        method: this.paymentForm.value.paymentMethod,
        transactionId: this.transactionId
      });
    }, 2000);
  }

  closeDialog() {
    this.dialogRef.close({ success: true, transactionId: this.transactionId });
  }
}
