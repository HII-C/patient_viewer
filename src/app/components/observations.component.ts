import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BaseColumn } from './baseColumn';

import { FhirService } from '../services/fhir.service';
import { ObservationService } from '../services/observation.service';
import { MapService } from '../services/map.service';
import { DoctorService } from '../services/doctor.service';
import { HistoricalTrendsService } from '../services/historicalTrends.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { Observation } from '../models/observation.model';
import { Patient } from '../models/patient.model';
import { Condition } from '../models/condition.model';
import { Observable } from 'rxjs/Observable';
import { ObservationRecursive } from './observationRecursion.component';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import * as moment from 'moment';

@Component({
  selector: 'observations',
  templateUrl: '/observations.html'
})
export class ObservationsComponent extends BaseColumn{
  selected: Observation;
  test: Observation;
  observations: Array<Observation> = [];

  @Input() patient: Patient;
  //@Output() observationReturned: EventEmitter<Array<any>> = new EventEmitter();

  mappings: { [key: string]: Array<string> } = {};

  

  // for column switching
  subscription: Subscription;

  constructor(private fhirService: FhirService,
    private observationService: ObservationService,
    private mapService: MapService,
    private doctorService: DoctorService,
    private trendsService: HistoricalTrendsService,
    private http: Http,
    private scratchPadService: ScratchPadService) {
      super();
      this.mappings = MapService.STATIC_MAPPINGS;

      // subscribe to scratch pad service for column switching
      this.subscription = scratchPadService.stateChange$.subscribe(
        sPad => {
          if (sPad)
            this.columnState = "scratchpad";
          else
            this.columnState = "default";
        }
      );
  }

  // ===================== FOR DATA RETRIEVAL FROM OBSERVATIONS SERVICE ============

  
  



  /**
   * Description: This method is called whenever the patient data is passed as input to the application. Handles
   * the initial subscription to the observation service and continual loading of the data links.
   **/
  ngOnChanges() {
    // If the patient is loaded:
    if (this.patient) {
      /**
       * Then retrieve the data from the server and subscribe to the data so that we know
       * whenever that data is finished from being retrieved
       * **/
      this.observationService.index(this.patient).subscribe(data => {
        if (data.entry) {
          this.observationService.observations = <Array<Observation>> data.entry.map(r => r['resource']);
          this.observationService.filterCategory(this.observationService.observations);

          let nextLink = null;
          // get the first link for the first iteration of loaddata
          for (let i of data.link) {
            if (i.relation == "next") {
              nextLink = i.url;
            }
          }

          // keep on loading data depending on the link; if the link is empty, then we stop
          if (nextLink) { this.observationService.loadData(nextLink); }
          else {
            this.observationService.loadFinished();
            this.scratchPadService.initObservations(this.observationService.condensedObservations);
          }

        } else {
          /**
           * If on that first subscription, the data is empty, then there are no observations for the patient
           */
          this.observationService.observations = new Array<Observation>();
          console.log("No observations for patient.");
        }
      });

    }
  }

  // ====================== SCRATCH PAD FUNCTIONALITY =============================

  getScratchPadObservations() {
    return this.scratchPadService.getObservations();
  }

  // OVERRIDDEN FROM BASECOLUMN:
  showDefault() {

  }

  showScratchPad(){
    console.log(this.getScratchPadObservations());
  }
}
