import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { FhirService } from '../../services/fhir.service';
import { ObservationService } from '../../services/observation.service';
import { MapService } from '../../services/map.service';
import { DoctorService } from '../../services/doctor.service';
import { HistoricalTrendsService } from '../../services/historicalTrends.service';
import { ScratchPadService } from '../../services/scratchPad.service';

import { Observation } from '../../models/observation.model';
import { ColumnType } from '../../utils/columnType.enum';
import { Patient } from '../../models/patient.model';
import { BaseColumn } from '../baseColumn';

@Component({
  selector: 'observations',
  templateUrl: './observations.html'
})
export class ObservationsComponent extends BaseColumn{
  selected: Observation;
  test: Observation;
  observations: Array<Observation> = [];

  @Input() patient: Patient;

  mappings: { [key: string]: Array<string> } = {};

  /** For column switching */
  subscription: Subscription;

  constructor(
    private fhirService: FhirService,
    private observationService: ObservationService,
    private mapService: MapService,
    private doctorService: DoctorService,
    private trendsService: HistoricalTrendsService,
    private scratchPadService: ScratchPadService
  ) {
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
      this.observationService.loadObservationsPage(url);    
    }
  }
}
