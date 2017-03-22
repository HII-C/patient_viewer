import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
@Component({})
export class FirebaseService {

  items: FirebaseListObservable<any[]>;
  item: FirebaseObjectObservable<any>;
  
  constructor(private http: Http, private angularFire: AngularFire) {
        this.items = angularFire.database.list('/associations');

        console.log(this.items);
    }
}
