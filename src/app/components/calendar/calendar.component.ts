import { Component } from '@angular/core';
import { startOfDay } from 'date-fns';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html'
})
export class CalendarComponent {
  viewDate: Date = new Date();
  events = [];
}