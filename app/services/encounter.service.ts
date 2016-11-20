import {Component, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {FhirService} from './fhir.service';

@Injectable()
@Component({
})
export class EncounterService {

	private path = '/Encounter';

	constructor(private fhirService: FhirService, private http: Http) {
	}

	index() {
		var url = this.fhirService.getUrl() + this.path;
		return this.http.get(url).map(res => res.json());
	}

	get(id) {
		console.log("Used the Encounter service.");
		var url = this.fhirService.getUrl() + this.path + '/' + id;
		return this.http.get(url).map(res => res.json());
	}

}
