import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {FhirService} from './fhir.service';
import {Patient} from '../models/patient.model';
import {Condition} from '../models/condition.model';

@Injectable()
@Component({
})
export class ConditionService {

    private path = '/Condition';
    conditions: Array<Condition> = [];

    constructor(private fhirService: FhirService, private http: Http) {
        console.log("ConditionService created...");
    }

    index(patient: Patient, authParam: boolean): Observable<any> {
        var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
        return this.http.get(url, this.fhirService.options(authParam)).map(res => res.json());
    }
    
    indexNext(url: string): Observable<any> {
      return this.http.get(url, this.fhirService.options(true)).map(res => res.json());

    }
}
