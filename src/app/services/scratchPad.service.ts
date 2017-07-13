import { Injectable, Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Condition} from '../models/condition.model';
import {ObservationService} from '../services/observation.service';
import {ConditionService} from '../services/condition.service';


@Injectable()
@Component({
})
export class ScratchPadService {
    currentCondSpArray: Array<Condition> = [];
    toAddToCondSpArray: Array<Condition> = [];
    toRemoveFromCondSpArray: Array<Condition> = [];

    dataToAdd: Array<any> = [];

    private addNewDataSource = new Subject<string>();

    addNewData$ = this.addNewDataSource.asObservable();

    constructor(private observationService: ObservationService, private conditionService: ConditionService) {
        console.log("ScratchPadService Created...");
    }

    addData(location: string){
      switch(location) {
        case "observation":
          console.log("observation");
          this.dataToAdd = this.observationService.selected;
          this.addNewDataSource.next(location);
          break;
        default:
          console.log("error");
      }
         //this.updatedCondSP.next(clicked);
    }
}
