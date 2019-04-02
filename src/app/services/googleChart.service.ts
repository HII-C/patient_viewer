import { Injectable } from '@angular/core';
import { TimelineChartConfig } from '../models/timelineChartConfig.model';
import { Medication } from "../models/medication.model";
import { strict } from 'assert';

declare var google: any;

@Injectable()
export class GoogleChartService {
  constructor() {
    google.charts.load('current', {'packages':['corechart']});
  }

  public buildLineChart(elementId: string, medication: Array<Medication>) {
    google.charts.setOnLoadCallback(() => {
      var dt = new google.visualization.DataTable();

      dt.addColumn({ type: 'date', id: 'time' });
      dt.addColumn({ type: 'number', id: 'dosage' })
      
      var medicationTest = Array<Medication>();
      var medication1 = new Medication('Name', new Date(2000, 3, 30), new Date(2019, 3, 2), 43);
      var medication2 = new Medication('Name2', new Date(2004, 7, 1), new Date(2017, 8, 5), 693);
      
      medicationTest.push(medication1);
      medicationTest.push(medication2);
      var rows = [];

      rows.push([new Date(1998, 3, 18), 420]);
      rows.push([new Date(1999, 3, 18), 420]);
      rows.push([new Date(1999, 3, 18), 500]);
      rows.push([new Date(2000, 3, 18), 500]);
      
      dt.addRows(rows);
      
      let lineChart = new google.visualization.LineChart(document.getElementById(elementId));
      lineChart.draw(dt);
    });
  }
}