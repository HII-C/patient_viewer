import {Component} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'firebase',
  template: `
  <ul>
    <li *ngFor="let item of items | async">
       {{ item | json }}
    </li>
  </ul>
  `,
})

export class FirebaseComponent{

    items: FirebaseListObservable<any[]>;

    constructor(private firebaseService: FirebaseService){
        console.log("Firebase Component running");
        this.items = this.firebaseService.items;
    }
}
