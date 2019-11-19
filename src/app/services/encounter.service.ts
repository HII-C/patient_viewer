import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Patient } from '../models/patient.model';
import { Encounter } from '../models/encounter.model';
import { FhirService } from './fhir.service';
import { Observable } from 'rxjs';

@Injectable()
@Component({})
export class EncounterService {
  private path = '/Encounter';

  constructor(private fhirService: FhirService, private http: Http) { }

  // TODO: Currently only retrieves 10 encounters. Need to add pagination support.
  loadEncounters(patient: Patient): Observable<Array<Encounter>> {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.options(true))
      .map(res => res.json()['entry'].map(e => this.deserialize(e['resource'])));
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
