import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { FhirService } from './fhir.service';
import { Patient } from '../models/patient.model';
import { Observation } from '../models/observation.model';

@Injectable()
@Component({})
export class ObservationService {
  condensedObservations: Array<Observation> = [];
  temp: any;
  categorizedObservations: any;
  groupList: any;
  count: number = 0;
  observations: Array<Observation> = [];
  selected: Array<Observation> = [];
  private path = '/Observation';

  constructor(private fhirService: FhirService, private http: Http) {
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
    this.temp = {
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
              ],
              "count": 0,
              "id": "2-2"
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

    this.categorizedObservations = this.temp;
  }

  // ================================== DATA RETRIEVAL ========================

  // Gets the initial data for the patient upon ngOnChanges call
  index(patient: Patient): Observable<any> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.options(true)).map(res => res.json());
  }

  // Gets the data for the nested data link calls
  indexNext(url: string): Observable<any> {
    return this.http.get(url, this.fhirService.options(true)).map(res => res.json());
  }

  // ================================ DATA CLEANING ===============================

  /**
   * Description: given a certain observation ID, returns the position mapping of that
   * ID contained within the groupList
   */
  getKey(value) {
    for (let x in this.groupList) {
      for (let y of this.groupList[x]) {
        if (value == y) {
          return x;
        }
      }
    }

    return "3";
  }

  /**
   * Description: The observations received from the server contains many duplicates. This (inefficient) method
   * ensures that there are no duplicates in the condensed observations list of the data.
   * 
   * ** NOTE: THIS SHOULD BE MOVED TO THE BACKEND! LEADS TO A LARGE SLOWDOWN OF THE LOADING FOR THE FRONT END APPLICATION!
   */
  filterCategory(observations: Array<Observation>) {
    for (let obs of observations) {
      if (!this.containsObject(obs)) {
        // Adds the grouping of the data (where it should be localized in the observations)
        obs.grouping = this.getKey(obs['code']['coding'][0]['code']);
        this.condensedObservations.push(obs);
      }
    }
  }

  /**
   * Description: Just a O(n) searching method to check if a certain observation already exists in the condensedObservations. 
   * Somebody didn't learn about hashmaps in CSE 310!
   */
  containsObject(obj) {
    for (let obs of this.condensedObservations) {
      if (obs['code']['coding'][0]['code'] == obj['code']['coding'][0]['code']) {
        return true;
      }
    }

    return false;
  }


  populateCategories(obsToFilter) {
    let totalcount = 0;
    let count = 0;

    // Another n^2 fucking algorithm!
    for (let i = 0; i < obsToFilter.length; i++) {
      if (obsToFilter[i].data) {

        /**
         * Depending on what grouping was assigned to a observation, add it to the relevant category
         */
        for (let obs of this.condensedObservations) {
          if (obs.grouping == obsToFilter[i].id) {
            count++;
            // This is a crappy solution, want sometime more robust in the future - Austin Michne
            if (obs.valueQuantity) {
              obsToFilter[i].data.push({ "name": obs['code']['coding'][0]['display'], "date": obs.effectiveDateTime, "code": obs['code']['coding'][0]['code'], "value": obs.valueQuantity['value'] });
            }
            else {
              obsToFilter[i].data.push({ "name": obs['code']['coding'][0]['display'], "date": obs.effectiveDateTime, "code": obs['code']['coding'][0]['code'] });
            }

            // obsToFilter[i].data.push(obs);
          }
        }
      }
      if (obsToFilter[i].data == "") {
        obsToFilter.splice(i, 1);
      }
      else if (obsToFilter[i].data) {
        obsToFilter[i].count += count;
        totalcount += count;
        count = 0;
        continue;
      }

      else if (typeof obsToFilter[i] === 'object') {
        totalcount += count;

        let newcount = this.populateCategories(obsToFilter[i].child);
        obsToFilter[i].count += newcount;

        if (obsToFilter[i].child == "") {
          obsToFilter.splice(i, 1);
        }
      }
    }
    //console.log("returning("+JSON.stringify(obj)+") "+totalcount);
    return totalcount;
  }
}
