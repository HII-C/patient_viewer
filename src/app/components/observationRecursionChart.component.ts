import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ObservationService } from '../services/observation.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';
import { Observation } from '../models/observation.model';


@Component({
  selector: 'observationRecursionChart',
  templateUrl: '/observationsChart.html'
})
export class ObservationRecursiveChart {
  @Input() obs: Array<Observation>;
  @Input() level: number;
  lastIndex: number;

  constructor(private observationService: ObservationService,
    private trendsService: HistoricalTrendsService) { }

  getData() {
    return this.obs;
  }

  getLevel() {
    return this.level;
  }

  // Called when an observation is either checked or unchecked.
  checked(obs: any, event, position, data) {
    obs.isSelected = !obs.isSelected;

    if (event.shiftKey) {
      let upper, lower;
      if (position < this.lastIndex) {
        upper = this.lastIndex;
        lower = position;
      }
      else {
        upper = position;
        lower = this.lastIndex;
      }
      for (let i = lower; i <= upper; i++) {
        if (data[i].isSelected != true) {
          this.observationService.selected.push(data[i]);
        }
        data[i].isSelected = true;
      }
    }

    this.lastIndex = position;

    if (obs.isSelected) {
      // Data points to be added to the chart for this observation in the trends tool.
      let dataPoints = [];

      for (let o of this.observationService.observations) {
        if (o['code']['coding'][0]['code'] == obs.code) {
          console.log(o);
          /* Load all data points associated with the selected
             observation to the trends tool. 'o' represents one
             of these data points.
          */
          dataPoints.push(o);
        }
      }

      this.observationService.selected.push(obs);

      // Create a new chart in the trends tool for the selected observation.
      this.trendsService.addChart(obs.code, dataPoints);
    } else {
      // If the observation is deselected, delete its chart from the trends tool.
      this.trendsService.removeChart(obs.code);

      // Indicate that the observation has been unselected
      // by deleting it from the 'selected' array.
      let index = this.observationService.selected.indexOf(obs);
      this.observationService.selected.splice(index, 1);
    }
  }
}
