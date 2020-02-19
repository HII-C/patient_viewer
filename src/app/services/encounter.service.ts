import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FhirService } from './fhir.service';

import { Patient } from '../models/patient.model';
import { Encounter } from '../models/encounter.model';


@Injectable()
export class EncounterService {
  private path = '/Encounter';

  constructor(
    private http: HttpClient,
    private fhirService: FhirService
  ) { }

  // TODO: Currently only retrieves 10 encounters. Need to add pagination support.
  loadEncounters(patient: Patient): Observable<Array<Encounter>> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.getRequestOptions())
      .pipe(map(res => res['entry'].map(e => this.deserialize(e['resource']))));
  }

  // We cannot simply cast the JSON object to an Encounter, because this casted
  // Encounter will not have the methods of the Encounter class.
  private deserialize(input: any): Encounter {
    var fixed: Encounter = new Encounter();

    for (let prop in input) {
      fixed[prop] = input[prop];
    }

    return fixed;
  }
}
