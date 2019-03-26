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
  condensedObservations: Array<Observation> = [];
  categorizedObservations: any;
  groupList: any;
  count: number = 0;
  observations: Array<Observation> = [];
  selected: Array<Observation> = [];
  private path = '/Observation';
  condensedObservationsLoadFinished: boolean = false;

  filterHash: any = {};

  constructor(private fhirService: FhirService, private http: Http, private scratchPadService: ScratchPadService) {
    // these are the codes of the observations; 
    // groupList is used to categorize where in temp this is stored
    this.groupList = {
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

  /** Gets the data for the recursive data link calls   */
  getObservations(url: string): Observable<any> {
    return this.http.get(url, this.fhirService.options(true)).map(res => <Observation>res.json());
  }

  /**
   * Loads observation data, which is paginated, by recursively loading data pages.
   */
  loadData(url): void {
    /**
     * Make the request for the url, and handle the data in the subsequent callback
     */
    this.getObservations(url).subscribe(data => {
      if (data.entry) { // Check if the data is valid
        // Map the data onto a json array of observations and append that data to the running total of observations
        let nextObs = <Array<Observation>>data.entry.map(r => r['resource']);
        this.observations = this.observations.concat(nextObs);
        this.filterCategory(nextObs);

        /**
           * The data comes in parts, so we must keep on loading the data from the next link until that link is empty,
           * at which point we know that all the data has been loaded at that point.
        */
        let nextLink: Array<any> = data.link.filter(link => link.relation == "next");
        if (nextLink.length > 0) { //recursive case - there is still more data to load from link with relation "next"
          this.loadData(nextLink[0].url);
        }
        else {
          this.onLoadComplete(); //base case - no link with relation "next" found, thus no more data to load
        }
      }
      else {
        console.log("No observations for patient.");
        this.observations = new Array<Observation>();
      }
    });
  }

  /**
   * Description: Clean observations now that they should be finished loading and are stored in the observationService!
   */
  onLoadComplete() {
    this.observations = this.observations.reverse();
    console.log("Loaded " + this.condensedObservations.length + " observations.");
    this.condensedObservationsLoadFinished = true;

    /*
    * Data cleaning - sorts by the effective time
    */
    this.observations.sort((n1, n2) => {
      return n1.effectiveDateTime < n2.effectiveDateTime ? 1 : -1;
    })

    // Scale dates to make them appear more recent for demos.
    // 0.8 is an arbitrary value that produces realistic dates.
    var diff = Math.floor(0.80 *
      (new Date().getTime() - new Date(this.observations[0].effectiveDateTime).getTime()));

    for (let ob of this.observations) {
      let newDate = new Date(ob.effectiveDateTime).getTime() + diff;
      ob.relativeDateTime = moment(newDate).toISOString();
    }

    this.populateCategories(this.categorizedObservations.categories);
    // The condensed observations should be the final set of data -- add it to the scratchpadservice
    this.scratchPadService.initObservations(this.condensedObservations);
    
    //this.observationReturned.emit(this.observationService.categorizedObservations);
  }

  // ================================ DATA CLEANING ===============================

  /**
   * Description: given a certain observation ID, returns the position mapping of that
   * ID contained within the groupList
   */
  getKey(value) {
    for (let x in this.groupList) {
      if (this.groupList[x].includes(value)) {
        return x;
      }
    }

    return "3"; //"Other"
  }

  /**
   * Description: The observations received from the server contains many duplicates. This (inefficient) method
   * ensures that there are no duplicates in the condensed observations list of the data.
   */
  filterCategory(observations: Array<Observation>) {

    // do a pass and keep first instance
    for (let obs of observations) {
      let code = obs['code']['coding'][0]['code'];

      // if new entry, then add to filtered set
      if (!this.filterHash[code]) {
        this.filterHash[code] = true;
        obs.grouping = this.getKey(code);
        this.condensedObservations.push(obs);
      }
    }
  }

  populateCategories(categories): number {
    let totalCount: number = 0;
    let count: number = 0;

    for (let i: number = 0; i < categories.length; i++) {
      let category = categories[i];
      if (category.hasOwnProperty('data')) {
        /**
         * Depending on what grouping was assigned to a observation, add it to the relevant category
         */
        for (let obs of this.condensedObservations) {
          if (obs.grouping == category.id) {
            count++;
            // This is a crappy solution, want sometime more robust in the future - Austin Michne
            let measurement = { "name": obs['code']['coding'][0]['display'], "code": obs['code']['coding'][0]['code'], "date": obs.effectiveDateTime };

            if (obs.hasOwnProperty("valueQuantity")) {
              measurement["value"] = obs["valueQuantity"]["value"];
            }
            category.data.push(measurement);
            // x.data.push(obs);
          }
        }
      }

      if (category.hasOwnProperty('data')) {
        if (category.data.length > 0) {
          category.count += count;
          totalCount += count;
          count = 0;
        }
        else {
          categories.splice(i, 1);
        }
      }
      else if (category.hasOwnProperty('child')) {
        let childCount: number = this.populateCategories(category.child);
        category.count += childCount;
        totalCount += childCount;

        if (category.child.length == 0) {
          categories.splice(i, 1);
        }
      }
    }
    //console.log("returning("+JSON.stringify(obj)+") "+totalcount);
    return totalCount;
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