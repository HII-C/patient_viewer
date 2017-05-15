import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {FhirService} from './fhir.service';

@Injectable()
export class PatientService {
    // private options: Headers = new Headers;["Accept: application/json";

    constructor(private fhirService: FhirService, private http: Http) {
        console.log("PatientService created...");
    }
    private path = '/Patient';
    private patients;

    index(): Observable<any> {
        var url = this.fhirService.getUrl() + this.path;
        // this.http.get

        return this.http.get(url, this.fhirService.options()).map(res => res.json());
    }
    index2(): Observable<any> {
        var url = this.fhirService.getUrl() + this.path;
        // this.http.get

        return this.http.get(url, this.fhirService.options2()).map(res => res.json());
    }
    get(id): Observable<any> {
        var url = this.fhirService.getUrl() + this.path + '/' + id;
        return this.http.get(url, this.fhirService.options()).map(res => res.json());
    }

    setPath(newPath) {
      this.path = newPath;
    }
}
