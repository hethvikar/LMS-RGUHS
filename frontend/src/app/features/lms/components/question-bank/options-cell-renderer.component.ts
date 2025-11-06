import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-options-cell-renderer',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="options-container" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      <span class="options-text" [class.has-options]="hasOptions">
        {{ hasOptions ? 'View Options' : 'No Options' }}
        <mat-icon *ngIf="hasOptions" class="options-icon">visibility</mat-icon>
      </span>

      <div class="options-popup" [class.visible]="showPopup && hasOptions">
        <div class="popup-header">
          <mat-icon>list</mat-icon>
          <span>Question Options</span>
        </div>
        <div class="popup-content">
          <div *ngFor="let option of options; let i = index" class="option-item">
            <span class="option-number">{{ i + 1 }}.</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .options-container {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .options-text {
      color: #666;
      display: flex;
      align-items: center;
      gap: 4px;

      &.has-options {
        color: #2196f3;
        text-decoration: underline;

        &:hover {
          color: #1976d2;
        }
      }
    }

    .options-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
    }

    .options-popup {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      min-width: 250px;
      max-width: 350px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-5px);
      transition: all 0.2s ease;
      margin-top: 4px;
      pointer-events: none;

      &.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    .popup-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      border-radius: 6px 6px 0 0;
      font-weight: 600;
      font-size: 0.85rem;
      color: #495057;

      mat-icon {
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
        color: #6c757d;
      }
    }

    .popup-content {
      padding: 8px 0;
      max-height: 200px;
      overflow-y: auto;
    }

    .option-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 16px;
      border-bottom: 1px solid #f8f9fa;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f8f9fa;
      }
    }

    .option-number {
      font-weight: 600;
      color: #495057;
      min-width: 20px;
      font-size: 0.8rem;
    }

    .option-text {
      flex: 1;
      font-size: 0.8rem;
      line-height: 1.4;
      color: #212529;
      word-wrap: break-word;
    }
  `]
})
export class OptionsCellRendererComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams;
  showPopup = false;
  options: string[] = [];
  hasOptions = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.options = params.value || [];
    this.hasOptions = this.options.length > 0;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.options = params.value || [];
    this.hasOptions = this.options.length > 0;
    return true;
  }

  onMouseEnter() {
    this.showPopup = true;
  }

  onMouseLeave() {
    this.showPopup = false;
  }
}