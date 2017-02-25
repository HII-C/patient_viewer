import {Component, Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Condition} from '../models/condition.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoupeService {

    // FIXME These are private credentials that should not be hard-coded into the app or checked into version control!
    private static URL: string = 'https://hil1c9muna.execute-api.us-west-2.amazonaws.com/prod/CallLoupe';
    private static API_KEY: string = 'Dy2EMpRmVr55dhHwejwZn8uf4FCKiHiu9k3fnSJ0';

    observationsArray: Array<any>;
    activeCondition: Condition;

    constructor(private http: Http) {
    }

    query(body: Object): Observable<Response> {
        let headers = new Headers({
            'x-api-key': LoupeService.API_KEY,
            'Accept': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        var resp = this.http.post(LoupeService.URL, body, options).map(res => res.json());
        return resp;
    }

}
