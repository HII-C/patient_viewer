import { Injectable, Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Condition } from '../models/condition.model';
import { ObservationService } from '../services/observation.service';
import { ConditionService } from '../services/condition.service';


@Injectable()
@Component({})
export class ScratchPadService {
  // Old fields that will likely be removed:
  toAddToCondSpArray: Array<Condition> = [];
  dataToAdd: Array<any> = [];
  private addNewDataSource = new Subject<string>();
  addNewData$ = this.addNewDataSource.asObservable();

  conditions: Array<Condition> = [];

  constructor(private observationService: ObservationService, private conditionService: ConditionService) { }


  addCondition(condition: Condition) {
    this.conditions.push(condition);
    console.log("ScratchPadService has " + this.conditions.length + " conditions.");
  }

  // Old method likely to be removed.
  addData(location: string) {
    switch (location) {
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
