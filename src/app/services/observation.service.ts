import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { FhirService } from './fhir.service';
import { Patient } from '../models/patient.model';
import { Observation } from '../models/observation.model';
import { ScratchPadService } from '../services/scratchPad.service';
import * as moment from 'moment';

@Injectable()
@Component({})
export class ObservationService {
  uniqueObservations: Array<Observation> = [];
  categorizedObservations: any;
  groupMap: {[x: string]: Array<String>};
  count = 0;
  observations: Array<Observation> = [];
  selected: Array<Observation> = [];
  private path = '/Observation';
  uniqueObservationsLoadFinished = false;

  filterSet = new Set<string>();

  constructor(private fhirService: FhirService, private http: Http, private scratchPadService: ScratchPadService) {
    // these are the codes of the observations; 
    // groupList is used to categorize where in categorizedObservations this is stored
    this.groupMap = {
      "1-1": ["8302-2", "3141-9", "2710-2"],
      "1-2": [],
      "1-3": [],
      "1-4": ["39156-5", "8310-5"],
      "1-5": [],
      "2-1": ["2571-8"],
      "2-2-1": ["789-8", "3094-0", "72166-2"],
      "2-2-2": [],
      "2-2-3": ["2823-3"]
    };

    // categories of the observations; found using groupList
    this.categorizedObservations = {
      "categories": [
        {
          "display": "Vitals",
          "id": "1",
          "count": 0,
          "child": [
            {
              "display": "Weight",
              "data": [],
              "count": 0,
              "id": "1-1"
            },
            {
              "display": "Blood Pressure",
              "data": [],
              "count": 0,
              "id": "1-2"
            },
            {
              "display": "Heart Rate",
              "data": [],
              "count": 0,
              "id": "1-3"
            },
            {
              "display": "Respiration Rate",
              "data": [],
              "count": 0,
              "id": "1-4"
            },
            {
              "display": "Temperature",
              "data": [],
              "count": 0,
              "id": "1-5"
            }
          ]
        },

        {
          "display": "Patient History / Review of Systems",
          "id": "2",
          "count": 0,
          "child": [
            {
              "display": "Constitutional Symptoms",
              "data": [],
              "count": 0,
              "id": "2-1"
            },
            {
              "display": "Body Systems",
              "count": 0,
              "id": "2-2",
              "child": [
                {
                  "display": "Eyes",
                  "data": [],
                  "count": 0,
                  "id": "2-2-1"
                },
                {
                  "display": "Ears, Nose, Mouth and Throat (ENT)",
                  "data": [],
                  "count": 0,
                  "id": "2-2-2"
                },
                {
                  "display": "Cardiovascular",
                  "data": [],
                  "count": 0,
                  "id": "2-2-3"
                }
              ]
            }
          ]
        },
        {
          "display": "Other",
          "id": "3",
          "count": 0,
          "data": []
        }
      ]
    };
  }

  // ================================== DATA RETRIEVAL ========================

  retrieveObservations(url: string): Observable<any> {
    return this.http.get(url, this.fhirService.options(true)).map(res => <Observation>res.json());
  }

  /**
   * Loads observation data, which is paginated, by recursively loading data pages.
   */
  loadData(url: string): void {
    /**
     * Make the request for the url, and handle the data in the subsequent callback
     */
    this.retrieveObservations(url).subscribe((data: { [x: string]: any }) => {
      if (data.hasOwnProperty('entry')) {
        let nextObservations: Array<Observation> = data['entry'].map((r: { [x: string]: any }) => r['resource']);
        this.observations = this.observations.concat(nextObservations);
        this.extractNewObservations(nextObservations);

        let nextLinks: Array<{[x: string]: string}> = data['link'].filter((link: {[x: string]: string}) => link['relation'] == 'next');
        if (nextLinks.length > 0) {
          let nextUrl = nextLinks[0]['url'];
          this.loadData(nextUrl);
        }
        else {
          this.onLoadComplete();
        }
      }
      else {
        console.log("No observations for patient.");
        this.observations = new Array<Observation>();
      }
    });
  }

  onLoadComplete() {
    this.observations = this.observations.reverse();
    console.log("Loaded " + this.uniqueObservations.length + " observations.");
    this.uniqueObservationsLoadFinished = true;

    this.observations.sort((n1, n2) => {
      return n1.effectiveDateTime < n2.effectiveDateTime ? 1 : -1;
    })

    this.scaleDates();

    this.populateCategories(this.categorizedObservations.categories);
    // The condensed observations should be the final set of data -- add it to the scratchpadservice
    this.scratchPadService.initObservations(this.uniqueObservations);

    //this.observationReturned.emit(this.observationService.categorizedObservations);
  }

  scaleDates(): void {
    let RECENCY_MULTIPLIER = 0.80;
    let timeSinceObservation = new Date().getTime() - new Date(this.observations[0].effectiveDateTime).getTime();
    let scaledTimeSinceObservation = Math.floor(RECENCY_MULTIPLIER * timeSinceObservation);

    for (let ob of this.observations) {
      let relativeDateTime = new Date(ob.effectiveDateTime).getTime() + scaledTimeSinceObservation;
      ob.relativeDateTime = moment(relativeDateTime).toISOString();
    }
  }
  // ================================ DATA CLEANING ===============================

  /**
   * Description: given a certain observation ID, returns the position mapping of that
   * ID contained within the groupMap
   */
  getKey(value: string): string {
    for (let x in this.groupMap) {
      if (this.groupMap[x].indexOf(value) !== -1) {
        return x;
      }
    }

    let OTHER_GROUPING = '3';
    return OTHER_GROUPING;
  }

  extractNewObservations(observations: Array<Observation>): void {
    for (let observation of observations) {
      let code: string = observation['code']['coding'][0]['code'];
      if (!this.filterSet.has(code)) {
        observation.grouping = this.getKey(code);
        this.uniqueObservations.push(observation);
        
        this.filterSet.add(code);
      }
    }
  }

  populateCategories(categories: Array<{[x: string]: any}>): number {
    let totalCount = 0;
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      //console.log(category);
      if (category.hasOwnProperty('data')) {
        //Depending on what grouping was assigned to a observation, add it to the relevant category
        for (let obs of this.uniqueObservations) {
          if (obs.grouping == category['id']) {
            // This is a crappy solution, want sometime more robust in the future - Austin Michne
            let measurement = { "name": obs['code']['coding'][0]['display'], "code": obs['code']['coding'][0]['code'], "date": obs.effectiveDateTime };
            if (obs.hasOwnProperty("valueQuantity")) {
              measurement["value"] = obs["valueQuantity"]["value"];
            }

            category['data'].push(measurement);
          }
        }
        category['count'] = category['data'].length;
        totalCount += category['count'];
        if (category['count'] == 0) {
          categories.splice(i--, 1);          
        }
      }
      else if (category.hasOwnProperty('child')) {
        if (category['child'].length == 0) {
          categories.splice(i--, 1);
        }
        else {
          category['count'] = this.populateCategories(category['child']);
          totalCount += category['count'];
        }
      }
    }
    return totalCount;
  }


  // Sort the Observations list (arrData) into categories, which are returned inside
  // a single object that conforms to accordion data format
  addCategoriesObservations(observations: Array<Observation>): Array<{[x: string]: any}> {
    let observationsByCategory: {[x: string]: Array<Observation>} = {};

    for (let observation of observations) {
      if (observation.hasOwnProperty('valueQuantity') && observation.hasOwnProperty('category')) {
        let observationCategory = observation.category[0].text;

        if (!observationsByCategory.hasOwnProperty(observationCategory)) {
          observationsByCategory[observationCategory] = [];
        }
        observationsByCategory[observationCategory].push(observation);
      }
    }
    let reconstructedObject: Array<{[x: string]: any}> = [];

    for (let ctgry of Object.keys(observationsByCategory)) {
      reconstructedObject.push({
        category: ctgry,
        subheadings: false,
        subs: null,
        data: observationsByCategory[ctgry]
      });
    }

    return reconstructedObject;
  }

  // ====================== SCRATCH PAD FUNCTIONALITY =============================

  getScratchPadObservations() {
    return this.scratchPadService.getObservations();
  }

  // OVERRIDDEN FROM BASECOLUMN:
  showDefault() {

  }

  showScratchPad() {
    console.log(this.getScratchPadObservations());
  }
}