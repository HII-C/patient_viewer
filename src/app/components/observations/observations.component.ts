import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { BaseColumn } from 'app/components/baseColumn';

import { FhirService } from 'app/services/fhir.service';
import { ObservationService } from 'app/services/observation.service';
import { MapService } from 'app/services/map.service';
import { DoctorService } from 'app/services/doctor.service';
import { HistoricalTrendsService } from 'app/services/historicalTrends.service';
import { ScratchPadService } from 'app/services/scratchPad.service';

import { Observation } from 'app/models/observation.model';
import { Patient } from 'app/models/patient.model';

@Component({
  selector: 'observations',
  templateUrl: './observations.html'
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
    if (this.patient) { //If the patient is loaded
      let url = this.fhirService.getUrl() + "/Observation?patient=" + this.patient.id;
      this.observationService.loadDataPage(url);    
    }
  }
}
