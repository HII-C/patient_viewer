import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';

import { FhirService } from './fhir.service';
import { Patient } from '../models/patient.model';
import { Condition } from '../models/condition.model';
import { AllergyIntolerance } from '../models/allergyIntolerance.model';

@Injectable()
@Component({})
export class ConditionService {
  private path = '/Condition';
  conditions: Array<Condition> = [];
  conditionsCache = {};
  columnState: String;

  constructor(private fhirService: FhirService, private http: Http) { }

  // https://stackoverflow.com/questions/45594609/which-operator-to-chain-observables-conditionally
  // Because the conditions are paginated in the API, we must continually
  // load the next page until no pages remain. This is achieved through
  // concatMap and Observable.concat, as discussed above.
  loadConditionsPage(url: string): Observable<Array<Condition>> {
    return this.http.get(url, this.fhirService.options(true))
      .map(res => res.json())
      .concatMap(data => {
        let conditions = [];

        if (data['entry']) {
          conditions = <Array<Condition>>data.entry.map(r => r['resource']);
        }

        let nextUrl = null;

        for (let l of data.link) {
          // Check if there is another page to load.
          if (l.relation == "next") {
            nextUrl = l.url;
          }
        }

        if (nextUrl) {
          // If there is another page, we need to trigger another request.
          return Observable.of(conditions).concat(this.loadConditionsPage(nextUrl));
        } else {
          // If no page is left, we are done.
          return Observable.of(conditions);
        }
      });
  }

  // Retrieve conditions for a given patient
  loadConditions(patient: Patient): Observable<Array<Condition>> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.loadConditionsPage(url);
  }

  // Retrieve allergies for a given patient
  loadAllergies(patient: Patient): Observable<Array<AllergyIntolerance>> {
    var url = this.fhirService.getUrl() + "/AllergyIntolerance" + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.options(true)).map(res => {
      let json = res.json();

      if (json.entry) {
        return <Array<AllergyIntolerance>> json.entry.map(r => r['resource']);
      } else {
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
