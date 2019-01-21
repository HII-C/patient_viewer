import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { FhirService } from './fhir.service';
import { Patient } from '../models/patient.model';
import { CarePlan } from '../models/carePlan.model';

@Injectable()
@Component({})
export class CarePlanService {
  private path = '/CarePlan';

  constructor(private fhirService: FhirService, private http: Http) { }

  // Retrieve care plans for a given patient
  getCarePlans(patient: Patient): Observable<any> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;

    return this.http.get(url, this.fhirService.options(true)).map(res => {
      let json = res.json();

      if (json.entry) {
        return <Array<CarePlan>>json.entry.map(r => r['resource']);
      } else {
        // The patient has no care plans, so return an empty array
        return new Array<CarePlan>();
      }
    });
  }
}
