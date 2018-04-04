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

  /*setData(data) {
    let chart = new Chart();
    chart.data = [];
    let chartTitle = '';
    let numCharts = -1;

    for (let point of data) {
      if (!point.valueQuantity || !point.valueQuantity['value']) {
        continue;
      }

      if (point.code['text'] != chartTitle) {
        //if(numCharts>5) {break;} //temporary fix to prevent graph data overload
        numCharts++;
        chartTitle = point.code['text'];

        chart.data.push({
          x: new Date(point.relativeDateTime).getTime(),
          y: point.valueQuantity['value']
        });

        chart.dataPoints[numCharts].title = o.code['text'];
        chart.dataPoints[numCharts].code = '3';
        chart.dataPoints[numCharts].dashedLines = true;
        chart.dataPoints[numCharts].normalValues = { low: 100, high: 200 };
      }

      chart.dataPoints[numCharts].data.push({ y: 0, x: 0 });
      chart.dataPoints[numCharts].data[count].y = point.valueQuantity['value'];
      let newDate = new Date(o.relativeDateTime).getTime();
      chart.dataPoints[numCharts].data[count].x = newDate;
      count++;
    }

    this.dataDef = chart;
    // this.canvasHeight = 101 * this.dataDef.dataPoints.length + 60;
  } */
}
