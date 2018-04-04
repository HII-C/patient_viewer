import { Component } from '@angular/core';

import { ObservationService } from '../services/observation.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';

@Component({
  selector: 'historicalTrends',
  templateUrl: '/historicalTrends.html'
})
export class HistoricalTrendsComponent {
  private chartData : any[];

  constructor(private trendsService: HistoricalTrendsService,
              private observationService: ObservationService) { }

  private updateCharts() {
    this.drawCharts();
  }

  private drawCharts() {
    let data = this.trendsService.dataDef;
    this.chartData = [];

    for (let point of data.dataPoints[0].data) {
      this.chartData.push({
        name: point.x,
        value: point.y
      });
    }
  }
}
