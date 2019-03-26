import { Component, Input, OnInit } from '@angular/core';

import { GoogleChartService } from '../services/googleChart.service';
import { TimelineChartConfig } from '../models/timelineChartConfig.model';

declare var google: any;

@Component({
  selector: 'timelineChart',
  templateUrl: '/timelineChart.html'
})
export class TimelineChartComponent implements OnInit {
    elementId: string = 'timelineChart';

    constructor(private googleChartService: GoogleChartService) { }

    ngOnInit(): void {
        this.googleChartService.buildTimeline(this.elementId); 
    }

    public updateChart(): void {
      console.log("working");
      this.googleChartService.buildTimelineModel(this.elementId, null);
    }
}