import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {FhirService} from './fhir.service';
import {Patient} from '../models/patient.model';
import {Observation} from '../models/observation.model';

@Injectable()
@Component({
})
export class ObservationService {
    categorizedObservations: any;
    count: number = 0;
    private path = '/Observation';
    constructor(private fhirService: FhirService, private http: Http) {
      this.categorizedObservations = {"categories":[

        {
          "display":"Vitals",
          "data":[],
          "id":"1"
        },
        {
          "display":"Patient History / Review of Systems",
          "data":[],
          "id":"2"
        },
        {
          "display":"Physical Exam",
          "data":[],
          "id":"3"
        }
      ]};

        console.log("ObservationService created...");
    }

    index(patient: Patient): Observable<any> {
        var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
		// console.log("ESNUTH");
        return this.http.get(url, this.fhirService.options(true)).map(res => res.json());
    }

    indexNext(url: string): Observable<any> {
      return this.http.get(url, this.fhirService.options(true)).map(res => res.json());

    }
    filterCategory(observations: Array<Observation>) {
      for(let obs of observations) {
          this.categorizedObservations.categories[this.count%3].data.push(obs);
        this.count++;
      }


    }
    // get(id): Observable<any> {
    //     var url = this.fhirService.getUrl() + this.path + '/' + id;
    //     return this.http.get(url, this.fhirService.options()).map(res => res.json());
    // }

}
