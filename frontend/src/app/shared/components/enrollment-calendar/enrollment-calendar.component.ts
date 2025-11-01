import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarModule } from 'angular-calendar';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { colors } from './calendar-utils';

export interface EnrollmentEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  courseId: number;
  courseName: string;
  studentId: number;
  studentName: string;
  status: 'enrolled' | 'completed' | 'upcoming' | 'cancelled';
  type: 'course' | 'assessment' | 'interview' | 'deadline';
}

@Component({
  selector: 'app-enrollment-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './enrollment-calendar.component.html',
  styleUrls: ['./enrollment-calendar.component.scss']
})
export class EnrollmentCalendarComponent implements OnInit, OnChanges {
  @Input() enrollmentEvents: EnrollmentEvent[] = [];
  @Input() viewDate: Date = new Date();
  @Input() view: CalendarView = CalendarView.Month;

  @Output() eventClicked = new EventEmitter<EnrollmentEvent>();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() enrollmentAdded = new EventEmitter<void>();
  @Output() eventUpdated = new EventEmitter<EnrollmentEvent>();

  calendarEvents: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen = false;
  statusFilter = 'all';

  CalendarView = CalendarView;

  ngOnInit() {
    this.convertToCalendarEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enrollmentEvents']) {
      this.convertToCalendarEvents();
    }
  }

  convertToCalendarEvents() {
    this.calendarEvents = this.enrollmentEvents
      .filter(event => this.statusFilter === 'all' || event.status === this.statusFilter)
      .map(event => ({
        id: event.id,
        title: `${event.title} - ${event.studentName}`,
        start: new Date(event.start),
        end: new Date(event.end),
        color: this.getEventColor(event),
        meta: event
      }));
    this.refresh.next();
  }

  getEventColor(event: EnrollmentEvent) {
    switch (event.type) {
      case 'assessment':
        return colors.assessment;
      case 'interview':
        return colors.interview;
      case 'deadline':
        return colors.deadline;
      default:
        switch (event.status) {
          case 'completed':
            return colors.completed;
          case 'upcoming':
            return colors.upcoming;
          case 'cancelled':
            return colors.cancelled;
          default:
            return colors.enrolled;
        }
    }
  }

  handleEvent(event: CalendarEvent) {
    this.eventClicked.emit(event.meta);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    this.dateSelected.emit(date);
  }

  eventTimesChanged(event: any) {
    const enrollmentEvent = event.event.meta as EnrollmentEvent;
    enrollmentEvent.start = event.newStart;
    enrollmentEvent.end = event.newEnd;
    this.eventUpdated.emit(enrollmentEvent);
  }

  viewChange(event: any) {
    this.view = event.value;
  }

  filterEvents() {
    this.convertToCalendarEvents();
  }

  addEnrollment() {
    this.enrollmentAdded.emit();
  }

  navigateToDate(date: Date) {
    this.viewDate = date;
  }

  next() {
    if (this.view === CalendarView.Month) {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = new Date(this.viewDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      this.viewDate = new Date(this.viewDate.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  previous() {
    if (this.view === CalendarView.Month) {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    } else if (this.view === CalendarView.Week) {
      this.viewDate = new Date(this.viewDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      this.viewDate = new Date(this.viewDate.getTime() - 24 * 60 * 60 * 1000);
    }
  }
}