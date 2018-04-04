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
  graphData: Array<any> = [];
  lastIndex: number;

  constructor(private observationService: ObservationService,
              private trendsService: HistoricalTrendsService) { }

  getData() {
    return this.obs;
  }

  getLevel() {
    return this.level;
  }

  //
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
      for (let o of this.observationService.observations) {
        if (o['code']['coding'][0]['code'] == obs.code) {
          this.graphData.push(o);
        }
      }
      this.observationService.selected.push(obs);

    }
    else {
      for (let o of this.observationService.observations) {
        if (o['code']['coding'][0]['code'] == obs.code) {
          let index = this.graphData.indexOf(o);
          this.graphData.splice(index, 1);
        }
      }
      let index = this.observationService.selected.indexOf(obs);

      this.observationService.selected.splice(index, 1);
    }

    console.log("checked", obs.isSelected, obs.code);
    this.trendsService.setData(this.graphData);
  }
}
