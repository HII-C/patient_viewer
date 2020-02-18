import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';

import { FhirService } from './fhir.service';
import { ScratchPadService } from '../services/scratchPad.service';

import { Patient } from '../models/patient.model';
import { Condition } from '../models/condition.model';
import { AllergyIntolerance } from '../models/allergyIntolerance.model';

@Injectable()
@Component({})
export class ConditionService {
  private path = '/Condition';

  conditions: Array<Condition> = [];
  // The currently selected (highlighted) condition 
  selectedCondition: Condition = null;

  conditionsCache = {};
  columnState: String;

  constructor(
    private fhirService: FhirService,
    private scratchPadService: ScratchPadService,
    private http: Http
  ) { }

  // https://stackoverflow.com/questions/45594609/which-operator-to-chain-observables-conditionally
  // Because the conditions are paginated in the API, we must continually
  // load the next page until no pages remain. This is achieved through
  // concatMap and Observable.concat, as discussed above.
  loadConditionsPage(url: string): Observable<Array<Condition>> {
    return this.http.get(url, this.fhirService.options(true))
      .map(res => res.json())
      .concatMap(data => {
        let conditions = [];

        if (data.hasOwnProperty('entry')) {
          conditions = <Array<Condition>>data.entry.map((r: { [x: string]: any; }) => r['resource']);
        }

        for (let link of data.link) {
          // Check if there is another page to load.
          if (link.relation == "next") {
            let nextUrl = link.url;
            return Observable.of(conditions).concat(this.loadConditionsPage(nextUrl));
          }
        }
        return Observable.of(conditions);
      });
  }

  // Retrieve conditions for a given patient
  loadConditions(patient: Patient): Observable<Array<Condition>> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.loadConditionsPage(url);
  }

  getCheckedConditions() {
    return this.conditions.filter(c => {
      return this.scratchPadService.checkedMapConditions.get(c);
    });
  }

  // Retrieve allergies for a given patient
  loadAllergies(patient: Patient): Observable<Array<AllergyIntolerance>> {
    let url = this.fhirService.getUrl() + "/AllergyIntolerance" + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.options(true)).map(res => {
      let json = res.json();
      if (json.hasOwnProperty('entry')) {
        return json['entry'].map(r => r['resource']);
      }
      else {
        return new Array<AllergyIntolerance>();
      }
    });
  }

  // Gets the state of the conditions column (default or scratch pad)
  getColumnState(): String {
    return this.columnState;
  }

  // Let the service know that the column state has changed
  setColumnState(newColumnState: String): void {
    this.columnState = newColumnState;
  }

  // TODO: Cache API calls into data structures that last for the duration of a session 
}
