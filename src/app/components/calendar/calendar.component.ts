import { Component } from '@angular/core';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.html'
})
export class CalendarComponent {
  viewDate: Date = new Date();
  events = [];
}