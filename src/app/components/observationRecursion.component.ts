import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ObservationService } from '../services/observation.service';
import { ChartTimelineService } from '../services/chartTimeline.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { Observation } from '../models/observation.model';

@Component({
  selector: 'observationRecursion',
  templateUrl: '/observationRecursion.html'
})
export class ObservationRecursive {
  @Input() obs: any;
  @Input() level: number;
  graphData: Array<any> = [];
  lastIndex: number;

  constructor(private observationService: ObservationService, private chartService: ChartTimelineService, private scratchpadService: ScratchPadService) { }

  // ========================================= EVENT HANDLERS ==============================

  // handles whenever a checkbox is clicked
  checked(obs: any, event, position, data) {
    obs.isSelected = !obs.isSelected;

    // shift click functionality [not tested]
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

    // unselected to selected
    if (obs.isSelected) {
      this.scratchpadService.addObservation(obs);
    }
    else { // selected to unselected
      this.scratchpadService.removeObservation(obs);
    }

    console.log("checked", obs.isSelected, obs.code);
  }

    // ======================================== GETTER METHODS =========================

    getData() {
      return this.obs;
    }
  
    getLevel() {
      return this.level;
    }
}
