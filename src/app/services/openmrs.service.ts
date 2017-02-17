import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {HealthCreekService} from './healthcreek.service';

@Injectable()
@Component({})
export class OpenMRSService {
  private static BASE_URL: string = 'http://windows.healthcreek.org/openmrs-standalone/ws/rest/v1/';

  private static LOCATION_UUID: string = '8d6c993e-c2cc-11de-8d13-0010c6dffd0f';
  private static OLD_ID_NUMBER: string = '8d79403a-c2cc-11de-8d13-0010c6dffd0f';
  private static AUTH_TOKEN: string = 'Basic YWRtaW46dGVzdA==';

	constructor(private http: Http) {}

  public createPatient(firstName: string, lastName: string, gender: string) {
    this.addPerson(firstName, lastName).subscribe(person => {
      console.log(person);
      var personUUID = person['uuid'];
      console.log('UUID: ' + personUUID);

      this.addPatient(personUUID).subscribe(patient => {
        console.log(patient);
      });
    });
  }

  public queryPerson(name: string) {
    var authHeaders = new Headers();
    authHeaders.append('Authorization', OpenMRSService.AUTH_TOKEN);
    authHeaders.append('Content-Type', 'application/json');

    return this.http.get(OpenMRSService.BASE_URL + 'person?q=' + name, {
      headers: authHeaders
    }).map(res => res.json());
  }

  private addPerson(firstName: string, lastName: string) {
    var body = {
      'gender': 'M',
      'names': [
        {
          'givenName': firstName,
          'familyName': lastName
        }
      ]
    };

    var authHeader = new Headers();
    authHeader.append('Authorization', OpenMRSService.AUTH_TOKEN);

    return this.http.post(OpenMRSService.BASE_URL + 'person', body, {
      headers: authHeader
    }).map(res => res.json());
  }

  private addPatient(personUUID: String) {
    var authHeaders = new Headers();
    authHeaders.append('Content-Type', 'application/json');
    authHeaders.append('Authorization', OpenMRSService.AUTH_TOKEN);

    var body = {
      "person": personUUID,
      "identifiers": [{
        "identifier": Math.random().toString(36).slice(2),
        "identifierType": OpenMRSService.OLD_ID_NUMBER,
        "location": OpenMRSService.LOCATION_UUID,
        "preferred": true
      }]
    };

    return this.http.post(OpenMRSService.BASE_URL + 'patient', body, {
      headers: authHeaders
    }).map(res => res.json());
  }
}
