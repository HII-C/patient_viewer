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

    loadConditions(patient: Patient, authParam: boolean) {
      var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;

      return this.http.get(url, this.fhirService.options(authParam)).map(data => {
        data = data.json();

        var loadedConditions = [];

        if (data['entry']) {
          loadedConditions = <Array<Condition>>data['entry'].map(item => item['resource']);
        }

        return loadedConditions;
      });

      // TODO: Implement the paginated loading functionality shown below:
      /*if (this.patient) {
        this.conditionService.index(this.patient, true).subscribe(data => {
          console.log("LOAD DATA: ");
          console.log(data);

          if (data.entry) {
            let nextLink = null;
            this.conditions = <Array<Condition>>data.entry.map(r => r['resource']);
            console.log(this.conditions);
  					for(let i of data.link) {
  						if(i.relation=="next") {
  							nextLink = i.url;
  						}
  					}
  					if(nextLink) {this.loadData(nextLink);}
  					else {this.loadFinished();}

          } else {
            this.conditions = new Array<Condition>();
            console.log("No conditions for patient.");
          }
        });
      }*/
    }
}
