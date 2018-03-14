import { Component, Input } from '@angular/core';

import { ScratchPadService } from '../services/scratchPad.service';
import { Observation } from '../models/observation.model';

@Component({
    selector: 'observationScratchPad',
    templateUrl: '/observationScratchPad.html'
  })
  export class ObservationScratchPad {
    // store for data from the scratchPadService:
    observations: Array<Observation> = [];

    // constructor: initialize the services
    constructor(private scratchPadService: ScratchPadService) {
        this.observations = this.getScratchPadServiceData();
        console.log(this.observations);
    } 

    // gets the data from the service
    getScratchPadServiceData() {
        return this.scratchPadService.getObservations();
    }
  }