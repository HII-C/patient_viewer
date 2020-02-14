import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ObservationService } from '../services/observation.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';
import { Observation } from '../models/observation.model';


@Component({
  selector: 'observationRecursionChart',
  templateUrl: './observationsChart.html'
})
export class ObservationRecursiveChart {
  @Input() obs: Array<Observation>;
  @Input() level: number;
  lastIndex: number;

  constructor(private observationService: ObservationService,
    private trendsService: HistoricalTrendsService) { }

  getData(): Array<Observation> {
    return this.obs;
  }

  getLevel(): number {
    return this.level;
  }

  // Called when an observation is either checked or unchecked.
  checked(changedObs: any, event, position: number, data) {
    changedObs.isSelected = !changedObs.isSelected;

    if (event.shiftKey) {
      let upper: number, lower: number;
      if (position < this.lastIndex) {
        upper = this.lastIndex;
        lower = position;
      }
      else {
        upper = position;
        lower = this.lastIndex;
      }
      for (let i = lower; i <= upper; i++) {
        if (!data[i].isSelected) {
          this.observationService.selected.push(data[i]);
        }
        data[i].isSelected = true;
      }
    }

    this.lastIndex = position;

    if (changedObs.isSelected) {
      // Data points to be added to the chart for this observation in the trends tool.
      let dataPoints = [];

      for (let o of this.observationService.observations) {
        if (o['code']['coding'][0]['code'] == changedObs.code) {
          /* Load all data points associated with the selected
             observation to the trends tool. 'o' represents one
             of these data points.
          */
          dataPoints.push(o);
        }
      }

      this.observationService.selected.push(changedObs);

      // Create a new chart in the trends tool for the selected observation.
      this.trendsService.addObservationChart(changedObs.code, dataPoints);
    } else {
      // If the observation is deselected, delete its chart from the trends tool.
      this.trendsService.removeChart(changedObs.code);

      // Indicate that the observation has been unselected
      // by deleting it from the 'selected' array.
      let index = this.observationService.selected.indexOf(changedObs);
      this.observationService.selected.splice(index, 1);
    }
  }
}
