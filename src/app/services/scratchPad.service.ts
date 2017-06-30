import { Injectable, Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Condition} from '../models/condition.model';

@Injectable()
@Component({
})
export class ScratchPadService {
    currentCondSpArray: Array<Condition> = [];
    toAddToCondSpArray: Array<Condition> = [];
    toRemovceFromCondSpArray: Array<Condition> = [];
    private updatedCondSP = new Subject<boolean>();
    buttonInCondCompClicked$ = this.updatedCondSP.asObservable();

    constructor() {
        console.log("ScratchPadService Created...");
    }

    buttonClicked(clicked: boolean){
         this.updatedCondSP.next(clicked);
    }
}