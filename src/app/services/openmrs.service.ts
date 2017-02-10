import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {HealthCreekService} from './healthcreek.service';

@Injectable()
@Component({})
export class OpenMRSService {
  private url: string = 'http://windows.healthcreek.org/openmrs-standalone/ws/rest/v1/';

  private static LOCATION_UUID: string = '8d6c993e-c2cc-11de-8d13-0010c6dffd0f';
  private OLD_ID_NUMBER: string = '8d79403a-c2cc-11de-8d13-0010c6dffd0f';
  private static AUTH_TOKEN: string = 'Basic YWRtaW46dGVzdA==';

	constructor(private http: Http) {}

	/*public index(): Observable<Client> {
		var url = this.healthCreekService.getUrl() + this.path;
		var result = <Observable<Client>>this.http.get(url, {
      headers: this.headers
    }).map(res => res.json());
		return result;
	}*/

  public addPerson() {
    var body = {
      'gender': 'M',
      'names': [
        {
          'givenName': 'Test First',
          'familyName':'Test Last'
        }
      ]
    };

    var authHeader = new Headers();
    authHeader.append('Authorization', OpenMRSService.AUTH_TOKEN);

    return this.http.post(this.url + 'person', body, {
      headers: authHeader
    }).map(res => res.json());
  }

  private addPatient() {
    //this.headers.append('Content-Type', 'application/json');
    //Do POST here.

    //this.headers.delete('Content-Type');
  }
}
