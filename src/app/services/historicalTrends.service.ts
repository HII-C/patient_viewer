import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Chart } from '../models/chart.model';
import { Observation } from '../models/observation.model';
import { Subject } from 'rxjs/Subject';
import { CarePlan } from '../models/carePlan.model';
import { Medication } from '../models/medication.model';

@Injectable()
@Component({})
export class HistoricalTrendsService {
  // Maps the name of a chart to the chart object itself.
  chartsMap: Map<string, Chart> = new Map<string, Chart>();
  
  // Store all the charts currently being displayed.
  charts: Array<Chart> = [];

  dataDef: Chart;
  test: Chart;
  canvasHeight: number;
  private activateGraphSource = new Subject<boolean>();
  activateGraph$ = this.activateGraphSource.asObservable();

  constructor() { }

  buttonClicked(clicked: boolean) {
    this.activateGraphSource.next(clicked);
  }

  // Add a new chart displaying a specific observation in the trends tool.
  public addObservationChart(chartName, data) {
    // A chart already exists with the given name.
    if (this.chartsMap.has(chartName)) {
      return;
    }

    if (data == null || data.length == 0) {
      // Avoid creating an empty chart.
      return;
    }

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

    // Sort data points in order of date of occurrence.
    chart.data = chart.data.sort((p1, p2) => p1.name - p2.name);

    // Store the data points in the format expected by NGX-Charts for line charts.
    chart.lineChartData = [{
      name: chart.title,
      series: chart.data
    }];

    // Set the min and max y-axis values for the chart, providing a small buffer
    // of extra space.
    let [max, min] = this.getValueRange(chart);
    let buffer = (max - min) * 0.2;

    chart.yScaleMin = min - buffer;
    chart.yScaleMax = max + buffer;

    // Add the normal range values for the chart (displayed as horizontal "reference" lines).
    chart.normalValues = [
      {
        name: "Low",
        value: min // TODO: These shouldn't be hardcoded.
      },
      {
        name: "High",
        value: max // TODO: These shouldn't be hardcoded.
      }
    ];

    // Add the newly created chart to the list of charts.
    this.chartsMap.set(chartName, chart);
    this.charts = Array.from(this.chartsMap.values());
  }

  public addMedicationChart(medication: Medication) {
    // A chart already exists for the given medication.
    if (this.chartsMap.has(medication.name)) {
      return;
    }

    let chart = new Chart();
    chart.title = medication.name + ' (' + medication.dosageUnits + ')';

    // Add every period the medication was taken to the chart.
    for (let i = 0; i < medication.periods.length; i++) {
      let curr = medication.periods[i];
      // Get the previous and next periods (if they exist).
      let prior = i > 0 ? medication.periods[i - 1] : null;
      let next = i < medication.periods.length - 1 ? medication.periods[i + 1] : null;
      
      // Add 0 dosages for periods when the medication is not being taken.
      if (prior != null && prior.end.getTime() != curr.start.getTime()) {
        chart.data.push({
          name: curr.start,
          value: 0
        });
      }

      // Add the start and end points for every period.
      chart.data.push({
        name: curr.start,
        value: curr.dosage
      });

      chart.data.push({
        name: curr.end,
        value: curr.dosage
      });

      // Add 0 dosages for periods when the medication is not being taken.
      if (next != null && next.start.getTime() != curr.end.getTime()) {
        chart.data.push({
          name: curr.end,
          value: 0
        });
      }
    }
    
    // Sort data points in order of date of occurrence.
    chart.data = chart.data.sort((p1, p2) => p1.name - p2.name);

    // Store the data points in the format expected by NGX-Charts for line charts.
    chart.lineChartData = [{
      name: chart.title,
      series: chart.data
    }];

    this.chartsMap.set(medication.name, chart);
    this.charts = Array.from(this.chartsMap.values());
  }

  // Remove the chart with the given name from the trends tool.
  public removeChart(chartName) {
    // First check if a chart exists with the given name.
    if (this.chartsMap.has(chartName)) {
      this.chartsMap.delete(chartName);
      this.charts = Array.from(this.chartsMap.values());
    }
  }

  // Get the smallest and largest values from a given chart.
  private getValueRange(chart: Chart) {
    // If the data provided is empty, return [0, 0].
    if (!chart.data || chart.data.length == 0) {
      return [0, 0];
    }

    let min = chart.data[0].value;
    let max = chart.data[0].value;

    for (let point of chart.data) {
      min = Math.min(min, point.value);
      max = Math.max(max, point.value);
    }

    return [min, max];
  }

  // Get the earliest and latest dates associated with any point in a chart.
  public getDateRange(chart: Chart) {
    // If the data provided is empty, return today's date.
    if (!chart.data || chart.data.length == 0) {
      return [new Date(), new Date()];
    }
    
    let minDate: Date = chart.data[0].name;
    let maxDate: Date = chart.data[0].name;

    for (let point of chart.data) {
      if (point.name.getTime() < minDate.getTime()) {
        minDate = point.name;
      }
      if (point.name.getTime() > maxDate.getTime()) {
        maxDate = point.name;
      }
    }

    return [minDate, maxDate];
  }
}
