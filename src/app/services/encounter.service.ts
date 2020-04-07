import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, concat } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { FhirService } from './fhir.service';

import { Bundle } from '../models/bundle.model';
import { Patient } from '../models/patient.model';
import { Encounter } from '../models/encounter.model';

/**
 * A service for retrieving patient encounters
 * from the FHIR server
 */
@Injectable()
export class EncounterService {
  private path = '/Encounter';

  constructor(
    private http: HttpClient,
    private fhirService: FhirService
  ) { }

  /**
   * Load a page of encounters
   * @param url Endpoint from which to retrieve encounters
   */
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

  /**
   * Retrieve encounters for a given patient from the FHIR server.
   * @param patient The patient whose encounters to retrieve
   */
  public loadEncounters(patient: Patient): Observable<Array<Encounter>> {
    const url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
    return this.loadEncountersPage(url);
  }

  /**
   * Convert a JSON encounter object from the FHIR server
   * to an instance of the Encounter class
   * @param input JSON encounter object from FHIR server
   */
  private deserialize(input: any): Encounter {
    // We cannot simply cast the JSON object to an Encounter, because this casted
    // Encounter will not have the methods of the Encounter class.
    var fixed: Encounter = new Encounter();

    for (let prop in input) {
      fixed[prop] = input[prop];
    }

    return fixed;
  }
}
