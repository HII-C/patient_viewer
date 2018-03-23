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

  // gets the observation patient data from the fhir service
  index(patient: Patient): Observable<any> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.options(true)).map(res => res.json());
  }

  indexNext(url: string): Observable<any> {
    return this.http.get(url, this.fhirService.options(true)).map(res => res.json());
  }

  // ================================ DATA CLEANING ===============================

  // gets the category number from the id lookup table
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

  filterCategory(observations: Array<Observation>) {
    for (let obs of observations) {
      if (!this.containsObject(obs)) {
        obs.grouping = this.getKey(obs['code']['coding'][0]['code']);
        this.condensedObservations.push(obs);
      }
    }
  }

  containsObject(obj) {
    for (let obs of this.condensedObservations) {
      if (obs['code']['coding'][0]['code'] == obj['code']['coding'][0]['code']) {
        return true;
      }
    }

    return false;
  }

  populateCategories(obsToFilter) {
    console.log(obsToFilter);

    let totalcount = 0;
    let count = 0;
    for (let i = 0; i < obsToFilter.length; i++) {
      if (obsToFilter[i].data) {
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
