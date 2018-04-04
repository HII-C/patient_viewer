import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Chart } from '../models/chart.model';
import { Observation } from '../models/observation.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
@Component({})
export class HistoricalTrendsService {
  charts: Map<string, Chart> = new Map<string, Chart>();

  dataDef: Chart;
  test: Chart;
  canvasHeight: number;
  private activateGraphSource = new Subject<boolean>();
  activateGraph$ = this.activateGraphSource.asObservable();

  constructor() { }

  buttonClicked(clicked: boolean) {
    this.activateGraphSource.next(clicked);
  }

  // Add a new chart displaying the contents of 'data' to the trends tool.
  public addChart(chartName, data) {
    // A chart already exists with the given name.
    if (this.charts.has(chartName)) {
      return;
    }

    if (data == null || data.length == 0) {
      // Avoid creating an empty chart.
      return;
    }

    console.log("Creating a chart for " + chartName);

    let chart = new Chart();

    // Get the title associated with the data point.
    chart.title = data[0].code['text'];

    for (let point of data) {
      // Skip data points without a numeric value.
      if (!point.valueQuantity || !point.valueQuantity['value']) {
        continue;
      }

      // Add the data point to the chart.
      chart.data.push({
        name: new Date(point.relativeDateTime),
        value: point.valueQuantity['value']
      });
    }

    // Add the newly created chart to the list of charts.
    this.charts.set(chartName, chart);
  }

  // Remove the chart with the given name from the trends tool.
  public removeChart(chartName) {
    // First check if a chart exists with the given name.
    if (this.charts.has(chartName)) {
      this.charts.delete(chartName);
    }
  }
}
