import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {FhirService} from './fhir.service';

@Injectable()
export class PatientService {
    private path = '/Patient';
    public patient;
    // private patients;
    // private options: Headers = new Headers;["Accept: application/json";

    constructor(private fhirService: FhirService, private http: Http) {
        console.log("PatientService created...");
    }

    index(withAuth): Observable<any> {
        var url = this.fhirService.getUrl() + this.path;
        console.log("PatientService.index URL: " + url);

        return this.http.get(url, this.fhirService.options(withAuth)).map(res => res.json());
    }

    get(id): Observable<any> {
        var url = this.fhirService.getUrl() + this.path + '/' + id;
        this.patient = id;
        let options = this.fhirService.options(true);
        options.headers.append('Pragma', 'no-cache');
        options.headers.append('Cache-Control', 'no-store');
        options.headers.append('Cache-Control', 'no-cache');
        options.headers.append('Cache-Control', 'must-revalidate');

        return this.http.get(url, options).map(res => res.json());
    }

    setPath(newPath) {
      this.path = newPath;
    }
}
