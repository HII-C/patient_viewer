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
    // Do not allow duplicate conditions in the scratch pad.
    if (this.conditions.indexOf(condition) == -1) {
      this.conditions.push(condition);
    }
  }

  removeCondition(condition: Condition) {
    // Remove a given condition from the scratch pad.
    var index = this.conditions.indexOf(condition);

    if (index != -1) {
      this.conditions.splice(index, 1);
    }
  }

  getConditions() {
    // Return the conditions currently in the scratch pad.
    return this.conditions;
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
