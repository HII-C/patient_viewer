import { Component, OnInit } from '@angular/core';

import { GoogleChartService } from '../../services/googleChart.service';

declare var google: any;

@Component({
  selector: 'timelineChart',
  templateUrl: './timelineChart.html'
})
export class TimelineChartComponent implements OnInit {
    elementId: string = 'timelineChart';

    constructor(private googleChartService: GoogleChartService) { }

    ngOnInit(): void {
        this.googleChartService.buildLineChart(this.elementId, null); 
    }

    public updateChart(): void {
      console.log("working");
      // this.googleChartService.buildTimelineModel(this.elementId, null);
    }
}