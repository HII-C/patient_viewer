import {Component, Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoupeService {

    // FIXME These are private credentials that should not be hard-coded into the app or checked into version control!
    private static URL: string = 'https://hil1c9muna.execute-api.us-west-2.amazonaws.com/prod/CallLoupe';
    private static API_KEY: string = 'Dy2EMpRmVr55dhHwejwZn8uf4FCKiHiu9k3fnSJ0';

    constructor(private http: Http) {
    }

    query(query: Object): Observable<Response> {
        let headers = new Headers({
            'Accept': 'application/json',
            'x-api-key': LoupeService.API_KEY
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(LoupeService.URL, query, options).map(res => res.json());
    }

}
