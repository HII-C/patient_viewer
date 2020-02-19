import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, concat } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { FhirService } from './fhir.service';

import { Bundle } from '../models/bundle.model';
import { Patient } from '../models/patient.model';
import { Encounter } from '../models/encounter.model';


@Injectable()
export class EncounterService {
  private path = '/Encounter';

  constructor(
    private http: HttpClient,
    private fhirService: FhirService
  ) { }

  private loadEncountersPage(url: string): Observable<Array<Encounter>> {
    return this.http.get<Bundle>(url, this.fhirService.getRequestOptions())
      .pipe(concatMap(bundle => {
        let encounters: Array<Encounter> = [];
        if (bundle.entry) {
          encounters = bundle.entry.map(e => this.deserialize(e['resource']));
        }

        let nextLink = bundle.link.find(link => link.relation == 'next');
        if (nextLink) {
          return concat(of(encounters), this.loadEncountersPage(nextLink.url));
        } else {
          return of(encounters);
        }
      }));
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
