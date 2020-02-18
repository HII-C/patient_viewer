import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { FhirService } from './fhir.service';
import { Patient } from '../models/patient.model';

@Injectable()
export class PatientService {
  private path = '/Patient';

  // The id of the currently set patient
  public patientId: number;

  constructor(
    private http: HttpClient,
    private fhirService: FhirService
  ) { }

  // Responsible for initial authentication when the application is starting
  index(): Observable<any> {
    var url = this.fhirService.getUrl() + this.path;
    return this.http.get(url, this.fhirService.getRequestOptions(false));
  }

  // Set the id of the patient
  setPatientId(patientId) {
    this.patientId = patientId;
  }

  // Retrieve the patient with the id previously set using setPatientId()
  loadPatient(): Observable<Patient> {
    var url = this.fhirService.getUrl() + this.path + '/' + this.patientId;
    let options = this.fhirService.getRequestOptions(true);

    return this.http.get(url, options).map(res => {
      let patient = <Patient>res;

      // Assign patient MRN
      for (let id of res['identifier']) {
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
