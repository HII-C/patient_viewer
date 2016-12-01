import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
@Component({
})
export class MapService {

    private path = 'app/data/mappings.json';

    constructor(private http: Http) {
        console.log("MapService created...");
    }

    load(): Observable<any> {
      return this.http.get(this.path).map(res => res.json());
    }
}
