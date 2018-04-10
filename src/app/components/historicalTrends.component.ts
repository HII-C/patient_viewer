import { Component } from '@angular/core';
import * as moment from 'moment';

import { ObservationService } from '../services/observation.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';

@Component({
  selector: 'historicalTrends',
  templateUrl: '/historicalTrends.html'
})
export class HistoricalTrendsComponent {
  // Width and height of displayed charts.
  private chartSize: number[] = [600, 300];

  // The minimum and maximum dates for the x-axis of the displayed charts.
  private minDate: Date = null;
  private maxDate: Date = null;

  constructor(private trendsService: HistoricalTrendsService,
              private observationService: ObservationService) { }

  // Set specific (user selected) min and max dates for the x-axis of displayed charts.
  setDateRange(form) {
    // Do nothing if one of the dates is invalid.
    if (!moment(form.minDate).isValid() || !moment(form.maxDate).isValid()) {
      return;
    }

    this.minDate = new Date(form.minDate);
    this.maxDate = new Date(form.maxDate);
  }

  // Reset the min and max dates for the x-axis of displayed charts (so all data is shown).
  resetMinDate() {
    this.minDate = null;
    this.maxDate = null;
  }
  // Subtracts the given number of years from today's date, and sets the result
  // as the minimum date on the x-axis of displayed charts.
  setMinYearsAgo(years) {
    this.minDate = moment().subtract(years, 'years').toDate();
  }

  // Subtracts the given number of months from today's date, and sets the result
  // as the minimum date on the x-axis of displayed charts.
  setMinMonthsAgo(months) {
    this.minDate = moment().subtract(months, 'months').toDate();
  }
}
