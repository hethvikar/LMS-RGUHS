import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbService, Breadcrumb } from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <nav class="breadcrumb-container" aria-label="Breadcrumb" *ngIf="breadcrumbs$ | async as breadcrumbs">
      <ol class="breadcrumb-list">
        <li 
          class="breadcrumb-item" 
          *ngFor="let crumb of breadcrumbs; let last = last; trackBy: trackByFn"
          [class.active]="last"
        >
          <!-- Clickable breadcrumb -->
          <a 
            *ngIf="crumb.url && !last" 
            [routerLink]="crumb.url"
            class="breadcrumb-link"
            [matTooltip]="'Navigate to ' + crumb.label"
            matTooltipPosition="above"
          >
            <mat-icon 
              *ngIf="crumb.icon" 
              class="breadcrumb-icon"
              [attr.aria-label]="crumb.label"
            >
              {{ crumb.icon }}
            </mat-icon>
            <span class="breadcrumb-label">{{ crumb.label }}</span>
          </a>
          
          <!-- Current page (non-clickable) -->
          <span *ngIf="!crumb.url || last" class="breadcrumb-current">
            <mat-icon 
              *ngIf="crumb.icon" 
              class="breadcrumb-icon current"
              [attr.aria-label]="crumb.label"
            >
              {{ crumb.icon }}
            </mat-icon>
            <span class="breadcrumb-label">{{ crumb.label }}</span>
          </span>
          
          <!-- Separator -->
          <mat-icon 
            *ngIf="!last" 
            class="breadcrumb-separator"
            aria-hidden="true"
          >
            chevron_right
          </mat-icon>
        </li>
      </ol>
    </nav>
  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs$: Observable<Breadcrumb[]>;
  private destroy$ = new Subject<void>();

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, item: Breadcrumb): string {
    return `${item.label}-${item.url}`;
  }
}