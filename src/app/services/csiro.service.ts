import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Csiro} from '../models/csiro.model';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
@Component({
})
export class CsiroService {
	url = 'https://ontoserver.csiro.au/stu3';

	QueryParam: {
		code: string,
		system: string,
		target: string
	} = {
		code: "",
		system: "",
		target: ""
	};
	csiro: Csiro = new Csiro;

	constructor(private http: Http) {}

	MapQuery(): Observable<any> {
		console.log('TESTING CSIRO');
		this.QueryParam.code = "152631000036101";
		this.QueryParam.system = 'http://snomed.info/sct';
		this.QueryParam.target = 'http://hl7.org/fhir/v2';

		let authHeaders = new Headers();
	    authHeaders.append('Accept', 'application+json');
		let pingUrl = this.csiroTranslateURL();

		var result = this.http.get(pingUrl).map(res => res.json());
		return result;
	}

	urlLookupCreation(){
		var finalUrl = this.url + '/CodeSystem/$lookup?system=' + String(this.QueryParam.system) + '&code=' + String(this.QueryParam.code);
		return finalUrl;
	}

	csiroTranslateURL(){
		let translateURL=this.url+'/ConceptMap/-1806908278/$translate?code='+this.QueryParam.code+'&system='+this.QueryParam.system+'&target='+this.QueryParam.target;
		return translateURL;
	}
}
