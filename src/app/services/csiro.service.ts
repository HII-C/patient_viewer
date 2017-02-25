import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
@Component({
})
export class CsiroService {
	url: 'http://ontoserver.csiro.au/stu3'

	QueryParam: {
		code: string,
		system: string,
		target: string,
	}

	constructor(private http: Http) {}

	MapQuery(){
		console.log('TESTING CSIRO');
		this.QueryParam.code = 'ACNE';
		this.QueryParam.target = 'http://snomed.info/sct/';
		this.QueryParam.system = 'http://hl7.org/fhir/v2/0487';
		var testUrl = this.urlCreation();
		
		var authHeaders = new Headers();
	    authHeaders.append('Content-Type', 'application/json');
	    authHeaders.append('Accept', 'application/json');

		var result = this.http.get(testUrl, authHeaders).subscribe(res => res.json());
		console.log(result);
	}

	urlCreation(){
		var finalUrl = this.url + '/ConceptMap/102/$translate?code=' + this.QueryParam.code + '&system=' + this.QueryParam.system + '&target' + this.QueryParam.target;
		return finalUrl
	}
}
