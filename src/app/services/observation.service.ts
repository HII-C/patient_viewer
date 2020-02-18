import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { FhirService } from './fhir.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { Observation, ObservationBundle } from '../models/observation.model';

@Injectable()
@Component({})
export class ObservationService {
  uniqueObservations: Array<Observation> = [];
  categorizedObservations: any;
  groupMap: { [x: string]: Array<String> };
  count = 0;
  observations: Array<Observation> = [];
  selected: Array<Observation> = [];
  uniqueObservationsLoadFinished = false;

  filterSet = new Set<string>();

  constructor(
    private fhirService: FhirService,
    private http: HttpClient,
    private scratchPadService: ScratchPadService
  ) {
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

  loadObservationsPage(url: string): void {
    this.http.get<ObservationBundle>(url, this.fhirService.getRequestOptions())
      .subscribe((bundle) => {
        this.handleObservationBundle(bundle);
      });
  }

  handleObservationBundle(bundle: ObservationBundle): void {
    if (bundle) {
      let nextObservations = bundle.entry.map(e => e.resource);
      this.observations = this.observations.concat(nextObservations);
      this.extractNewObservations(nextObservations);

      let nextLink = bundle.link.find(link => link.relation == 'next');
      if (nextLink) {
        this.loadObservationsPage(nextLink.url);
      } else {
        this.onLoadComplete();
      }
    } else {
      console.log("No observations for patient.");
      this.observations = new Array<Observation>();
    }
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

  getCheckedObservations() {
    return this.observations.filter(o => this.scratchPadService.checkedMapObservations.get(o));
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

  extractNewObservations(observations: Array<Observation>): void {
    for (let observation of observations) {
      let code: string = observation['code']['coding'][0]['code'];
      if (!this.filterSet.has(code)) {
        observation.grouping = this.getGrouping(code);
        this.uniqueObservations.push(observation);

        this.filterSet.add(code);
      }
    }
  }

  /**
  * Given a certain observation ID, returns the position mapping of that
   * ID contained within the groupMap
   */
  getGrouping(code: string): string {
    for (let x in this.groupMap) {
      if (this.groupMap[x].indexOf(code) !== -1) {
        return x;
      }
    }

    let OTHER_GROUPING = '3';
    return OTHER_GROUPING;
  }

  populateCategories(categories: Array<{ [x: string]: any }>): number {
    let totalCount = 0;
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      if (category.hasOwnProperty('data')) {
        //Depending on what grouping was assigned to a observation, add it to the relevant category
        for (let obs of this.uniqueObservations) {
          if (obs.grouping == category['id']) {
            // This is a crappy solution, want sometime more robust in the future - Austin Michne
            let measurement = { "name": Observation.getText(obs), "code": obs['code']['coding'][0]['code'], "date": obs.effectiveDateTime };
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
  addCategoriesObservations(observations: Array<Observation>): Array<{ [x: string]: any }> {
    let observationsByCategory: { [x: string]: Array<Observation> } = {};

    for (let observation of observations) {
      if (observation.hasOwnProperty('valueQuantity') && observation.hasOwnProperty('category')) {
        let observationCategory = observation.category[0].text;

        if (!observationsByCategory.hasOwnProperty(observationCategory)) {
          observationsByCategory[observationCategory] = [];
        }
        observationsByCategory[observationCategory].push(observation);
      }
    }

    let reconstructedObject: Array<{ [x: string]: any }> = [];
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