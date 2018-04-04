import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() observationReturned: EventEmitter<Array<any>> = new EventEmitter();
  mappings: { [key: string]: Array<string> } = {};

  constructor(private fhirService: FhirService,
    private observationService: ObservationService,
    private mapService: MapService, private doctorService: DoctorService,
    private trendsService: HistoricalTrendsService, 
    private http: Http,
    private scratchPadService: ScratchPadService) {
      super();
      this.mappings = MapService.STATIC_MAPPINGS;
  }

  // ===================== FOR DATA RETRIEVAL FROM OBSERVATIONS SERVICE ============

  /**
   * Description: Now all the observations (should) be finished loading and are stored in the observationsservice!
   */
  loadFinished() {
    this.observationService.observations = this.observationService.observations.reverse();
    console.log("Loaded " + this.observationService.observations.length + " observations.");

    /*
    * Data cleaning - initially sorts by the code then sorts by the effective time
    */
    this.observationService.observations.sort((n1, n2) => {
      if (n1['code']['coding'][0]['code'] < n2['code']['coding'][0]['code']) {
        return 1;
      }
      if (n1['code']['coding'][0]['code'] > n2['code']['coding'][0]['code']) {
        return -1;
      }
    })

    this.observationService.observations.sort((n1, n2) => {
      if (n1.effectiveDateTime < n2.effectiveDateTime) {
        return 1;
      }
      if (n1.effectiveDateTime > n2.effectiveDateTime) {
        return -1;
      }
    })

    /**
     * Then, with this sorted data, converts the date into a relative time format (e.g. 4 months ago rather than a set date December 4, 2017)
     */
    var diff = new Date().getTime() - new Date(this.observationService.observations[0].effectiveDateTime).getTime();
    for (let ob of this.observationService.observations) {
      var newDate = new Date(ob.effectiveDateTime).getTime() + diff;
      ob.relativeDateTime = new Date(newDate).toDateString();
      ob.relativeDateTime = moment(newDate).toISOString();
    }

    this.observationService.populateCategories(this.observationService.temp.categories);
    this.observationService.categorizedObservations = this.observationService.temp;

    console.log(this.observationService.categorizedObservations);

    this.observationReturned.emit(this.observationService.observations);
  }

  /**
   * Description: loads the data for the current data link that the program is currently at. Essentially
   */
  loadData(url) {
    let isLast = false;

    /**
     * Make the request for the url, and handle the data in the subsequent callback
     */
    this.observationService.indexNext(url).subscribe(data => {
      // Check if the data is valid
      if (data.entry) {

        // Map the data onto a json array of observations and append that data to the running total of observations in the observations service
        let nextObs = <Array<Observation>>data.entry.map(r => r['resource']);
        this.observationService.observations = this.observationService.observations.concat(nextObs);
        this.observationService.filterCategory(nextObs);

        /**
           * The data comes in parts, so we must keep on loading the data from the next link until that link is empty,
           * at which point we know that all the data has been loaded at that point.
        */
        isLast = true;
        for (let item of data.link) {
          if (item.relation == "next") {
            isLast = false;
            this.loadData(item.url);
          }
        }

        // Base Case - if there are no more links, then stop the recursion!
        if (isLast) {
          this.loadFinished();
        }
      }
    });
  }

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
          this.observationService.observations = <Array<Observation>>data.entry.map(r => r['resource']);
          this.observationService.filterCategory(this.observationService.observations);

          let nextLink = null;

          // get the first link for the first iteration of loaddata
          for (let i of data.link) {
            if (i.relation == "next") {
              nextLink = i.url;
            }
          }

          // keep on loading data depending on the link; if the link is empty, then we stop
          if (nextLink) { this.loadData(nextLink); }
          else { this.loadFinished(); }

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

  updateHighlighted(condition: Condition) {

    let response = this.mapService.load("XYZ");
    for (let obs of this.observationService.observations) {
      obs['highlighted'] = false;
    }
    let key = condition.code.coding[0].code;
    if (this.mappings[key] != null) {
      for (let obs of this.observationService.observations) {
        if (this.mappings[key].indexOf(obs.code['coding'][0]['code']) > -1) {
          obs['highlighted'] = true;
        }
      }
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
