import { Component, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { FhirService } from './fhir.service';
import { Patient } from '../models/patient.model';

@Injectable()
export class PatientService {
  private path = '/Patient';
  public patient;

  constructor(private fhirService: FhirService, private http: Http) { }

  // Responsible for initial authentication when the application is starting
  index(withAuth): Observable<any> {
    var url = this.fhirService.getUrl() + this.path;
    return this.http.get(url, this.fhirService.options(withAuth)).map(res => res.json());
  }

  // Retrieve a patient by its id
  loadPatient(patientId): Observable<Patient> {
    var url = this.fhirService.getUrl() + this.path + '/' + patientId;
    this.patient = patientId;

    let options = this.fhirService.options(true);
    options.headers.append('Pragma', 'no-cache');
    options.headers.append('Cache-Control', 'no-store');
    options.headers.append('Cache-Control', 'no-cache');
    options.headers.append('Cache-Control', 'must-revalidate');

    return this.http.get(url, options).map(res => res.json()).map(json => {
      let patient = <Patient>json;

      for (let id of json.identifier) {
        if (id.type && id.type.coding[0].code == "MR") {
          patient.mrn = id.value;
        }
      }

      return patient;
    });
  }

  setPath(newPath) {
    this.path = newPath;
  }
}
