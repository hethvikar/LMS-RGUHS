import { CalendarEvent } from 'angular-calendar';

export const colors: any = {
  enrolled: {
    primary: '#4caf50',
    secondary: '#c8e6c9'
  },
  completed: {
    primary: '#2196f3',
    secondary: '#bbdefb'
  },
  upcoming: {
    primary: '#ff9800',
    secondary: '#ffcc02'
  },
  cancelled: {
    primary: '#f44336',
    secondary: '#ffcdd2'
  },
  assessment: {
    primary: '#9c27b0',
    secondary: '#e1bee7'
  },
  interview: {
    primary: '#607d8b',
    secondary: '#b0bec5'
  },
  deadline: {
    primary: '#ff5722',
    secondary: '#ff8a65'
  }
};

export function createCalendarEvent(
  id: number,
  title: string,
  start: Date,
  end: Date,
  color: any,
  meta?: any
): CalendarEvent {
  return {
    id,
    title,
    start,
    end,
    color,
    meta
  };
}

export function formatEventTitle(event: any): string {
  if (event.type === 'course') {
    return `${event.courseName} - ${event.studentName}`;
  } else if (event.type === 'assessment') {
    return `Assessment: ${event.title}`;
  } else if (event.type === 'interview') {
    return `Interview: ${event.title}`;
  } else {
    return event.title;
  }
}

export function getEventStatusColor(status: string): any {
  switch (status) {
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

export function getEventTypeColor(type: string): any {
  switch (type) {
    case 'assessment':
      return colors.assessment;
    case 'interview':
      return colors.interview;
    case 'deadline':
      return colors.deadline;
    default:
      return colors.enrolled;
  }
}