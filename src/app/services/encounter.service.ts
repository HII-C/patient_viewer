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

  private loadEncountersPage(url: string): Observable<Array<Encounter>> {
    return this.http.get(url, this.fhirService.options(true))
      .map(res => res.json())
      .concatMap(data => {
        let encounters: Array<Encounter> = [];
        if (data.hasOwnProperty('entry')) {
          encounters = data.entry.map(e => this.deserialize(e['resource']));
        }
        for (let link of data.link) {
          if (link.relation === "next") {
            return Observable.of(encounters).concat(this.loadEncountersPage(link.url));
          }
        }
        return Observable.of(encounters);
      });
  }

  public loadEncounters(patient: Patient): Observable<Array<Encounter>> {
    const url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.loadEncountersPage(url);
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
