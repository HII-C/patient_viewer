import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Patient } from '../models/patient.model';
import { Encounter } from '../models/encounter.model';
import { FhirService } from './fhir.service';

@Injectable()
@Component({})
export class EncounterService {
  private path = '/Encounter';

  constructor(private fhirService: FhirService, private http: Http) { }

  // TODO: Currently only retrieves 10 encounters. Need to add pagination support.
  loadEncounters(patient: Patient) {
    var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.http.get(url, this.fhirService.options(true))
        .map(res => res.json()['entry'].map(e => <Encounter> e['resource']));
  }
}
